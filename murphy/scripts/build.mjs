import { mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import {
  root,
  config,
  validateEpisode,
  assetMap,
  requiredAssetIds,
  sourcePath,
  fingerprint,
} from "./project.mjs";
import { renderComposition, renderScene } from "../compositions/factory/layout.mjs";

export function buildEpisode(episode, { draft = true } = {}) {
  const errors = validateEpisode(episode);
  if (errors.length) throw new Error(errors.join("\n"));
  const destination = resolve(root, ".hyperframes-build", episode.id);
  mkdirSync(destination, { recursive: true });
  const assets = assetMap(episode);
  for (const id of requiredAssetIds(episode)) {
    const asset = assets.get(id);
    // The original take stays in recordings. Only the selected edit enters the render.
    if (episode.narration?.masterAssetId === id && episode.narration.editAssetId !== id)
      continue;
    const target = resolve(destination, asset.path);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(sourcePath(asset.path), target);
    if (asset.license.source.startsWith("assets/")) {
      const notice = resolve(destination, asset.license.source);
      mkdirSync(dirname(notice), { recursive: true });
      copyFileSync(sourcePath(asset.license.source), notice);
    }
  }
  writeFileSync(
    resolve(destination, "index.html"),
    renderComposition(episode, config, assets, draft),
  );
  mkdirSync(resolve(destination, "compositions"), { recursive: true });
  episode.scenes.forEach((scene, index) =>
    writeFileSync(
      resolve(destination, "compositions", `${scene.id}.html`),
      renderScene(scene, index, episode, config, assets),
    ),
  );
  const assertions = episode.scenes.flatMap((scene) => [
    {
      kind: "appearsBy",
      selector: `#${scene.id}-content`,
      bySec:
        scene.start +
        config.motion.enterSeconds +
        1 / config.profiles[episode.profile].fps,
    },
    { kind: "staysInFrame", selector: `#${scene.id}-content` },
    ...(scene.component === "quiz"
      ? [
          {
            kind: "appearsBy",
            selector: `#${scene.id}-answer`,
            bySec:
              scene.start +
              scene.answerAt +
              (scene.visual ? config.motion.replaceSeconds : 0) +
              config.motion.enterSeconds +
              1 / config.profiles[episode.profile].fps,
          },
        ]
      : []),
  ]);
  writeFileSync(
    resolve(destination, "index.motion.json"),
    `${JSON.stringify({ duration: episode.durationSeconds, assertions }, null, 2)}\n`,
  );
  writeFileSync(
    resolve(destination, "meta.json"),
    `${JSON.stringify({ id: episode.id, name: episode.title }, null, 2)}\n`,
  );
  writeFileSync(
    resolve(destination, "build.json"),
    `${JSON.stringify({ episodeId: episode.id, fingerprint: fingerprint(episode), draft, profile: episode.profile }, null, 2)}\n`,
  );
  return destination;
}
