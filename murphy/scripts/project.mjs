import { readFileSync, readdirSync, realpathSync, existsSync, statSync } from "node:fs";
import { resolve, relative, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import Ajv from "ajv";
import { components } from "../compositions/factory/components.mjs";
import { visualErrors } from "../compositions/factory/contracts.mjs";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
export const config = readJson(resolve(root, "config/production.json"));
const ajv = new Ajv({ allErrors: true, strict: true });
ajv.addSchema(readJson(resolve(root, "schemas/visual.schema.json")));
const episodeSchema = ajv.compile(readJson(resolve(root, "schemas/episode.schema.json")));
const assetSchema = ajv.compile(readJson(resolve(root, "schemas/asset.schema.json")));
const message = (error) =>
  `${error.instancePath || "/"} ${error.message}${error.params.missingProperty ? `: ${error.params.missingProperty}` : ""}${error.params.additionalProperty ? `: ${error.params.additionalProperty}` : ""}`;

export function sourcePath(path, { mustExist = true } = {}) {
  if (
    typeof path !== "string" ||
    !/^(assets|recordings|episodes)\/[A-Za-z0-9_./-]+$/.test(path) ||
    path.split("/").some((part) => part === ".." || part.startsWith("."))
  ) {
    throw new Error(
      `Unsafe source path: ${path}; use assets/, recordings/ or episodes/ without traversal`,
    );
  }
  const result = resolve(root, path);
  if (mustExist && !existsSync(result))
    throw new Error(
      `Required source missing: ${path}; restore the declared file from backup`,
    );
  if (existsSync(result)) {
    if (!statSync(result).isFile()) throw new Error(`Expected a file: ${path}`);
    const actual = relative(root, realpathSync(result));
    if (
      actual.startsWith(`..${sep}`) ||
      actual.startsWith("references-private") ||
      !/^(assets|recordings|episodes)\//.test(actual)
    )
      throw new Error(`Source escapes publishable roots: ${path}`);
  }
  return result;
}

export function episodeFiles() {
  return readdirSync(resolve(root, "episodes"), { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(resolve(root, "episodes", entry.name, "episode.json")),
    )
    .map((entry) => resolve(root, "episodes", entry.name, "episode.json"))
    .sort();
}

export function loadEpisode(id = "fixture-pipeline-smoke") {
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id))
    throw new Error(`Invalid episode ID: ${id}`);
  const path = resolve(root, "episodes", id, "episode.json");
  if (!existsSync(path))
    throw new Error(`Episode not found: episodes/${id}/episode.json`);
  const episode = readJson(path);
  if (episode.id !== id)
    throw new Error(`${relative(root, path)}: folder and episode ID must match`);
  return episode;
}

export function validateConfig(value = config) {
  const errors = [];
  const p = value.profiles?.vertical;
  if (value.schemaVersion !== 1)
    errors.push("config/schemaVersion: only version 1 is supported");
  if (
    !p ||
    p.width !== 1080 ||
    p.height !== 1920 ||
    p.aspectRatio !== "9:16" ||
    p.fps !== 30 ||
    p.container !== "mp4" ||
    p.videoCodec !== "h264" ||
    p.audioCodec !== "aac" ||
    p.pixelFormat !== "yuv420p"
  )
    errors.push(
      "config/profiles/vertical: approved output is 1080×1920, 9:16, 30 FPS, MP4/H.264/yuv420p/AAC",
    );
  for (const key of [
    "canvas",
    "text",
    "grammar",
    "focus",
    "error",
    "panel",
    "line",
    "muted",
  ])
    if (!/^#[a-f0-9]{6}$/i.test(value.tokens?.[key]))
      errors.push(`config/tokens/${key}: expected a six-digit hex color`);
  for (const key of ["seriesTitle", "label"])
    if (
      typeof value.branding?.[key] !== "string" ||
      !value.branding[key].trim() ||
      value.branding[key].length > 50
    )
      errors.push(`config/branding/${key}: required text, at most 50 characters`);
  for (const key of ["title", "body", "caption", "label", "compact", "role"])
    if (
      !Number.isFinite(value.typography?.[key]) ||
      value.typography[key] < 24 ||
      value.typography[key] > 100
    )
      errors.push(`config/typography/${key}: expected 24–100 pixels`);
  if (!/^[A-Za-z ]+$/.test(value.typography?.family || ""))
    errors.push("config/typography/family: use a simple local font family name");
  if (
    value.audio?.sampleRate !== 48000 ||
    value.audio?.masterFormat !== "wav" ||
    value.audio?.channels !== 1
  )
    errors.push("config/audio: recording contract requires 48 kHz mono WAV");
  for (const key of [
    "targetLufs",
    "lufsTolerance",
    "maxTruePeakDb",
    "durationToleranceSeconds",
  ])
    if (!Number.isFinite(value.audio?.[key]))
      errors.push(`config/audio/${key}: expected a finite number`);
  if (
    !(
      value.audio?.lufsTolerance > 0 &&
      value.audio?.durationToleranceSeconds > 0 &&
      value.audio?.maxTruePeakDb <= -1
    )
  )
    errors.push(
      "config/audio: positive tolerances and true peak at or below -1 dBTP required",
    );
  for (const [name, area] of Object.entries(value.safeAreas || {})) {
    if (
      ["top", "right", "bottom", "left", "captionHeight", "captionGap"].some(
        (key) => !Number.isFinite(area[key]) || area[key] < 0,
      ) ||
      area.left + area.right >= 1080 ||
      area.top + area.bottom + area.captionHeight + area.captionGap >= 1920
    )
      errors.push(`config/safeAreas/${name}: invalid or empty content region`);
  }
  if (!value.safeAreas?.["social-conservative"])
    errors.push("config/safeAreas: conservative social preset is required");
  if (
    !(
      value.motion?.enterSeconds > 0 &&
      value.motion?.enterSeconds <= 0.5 &&
      value.motion?.highlightSeconds > 0 &&
      value.motion?.highlightSeconds <= 0.5 &&
      value.motion?.risePixels >= 0 &&
      value.motion?.risePixels <= 24 &&
      value.motion?.ease === "power2.out"
    )
  )
    errors.push("config/motion: use restrained seekable entrances and power2.out easing");
  for (const [group, keys] of Object.entries({
    spacing: ["xs", "sm", "md", "lg", "xl"],
    layout: [
      "contentOffset",
      "legacyContentOffset",
      "legacyGap",
      "panelPadding",
      "captionPadding",
      "progressHeight",
      "illustrationHeight",
      "progressOffset",
      "captionMaxCharsPerSecond",
    ],
    surface: ["radius", "stroke"],
  })) {
    for (const key of keys)
      if (!Number.isFinite(value[group]?.[key]) || value[group][key] <= 0)
        errors.push(`config/${group}/${key}: positive finite design token required`);
  }
  if (value.surface?.shadow !== "none")
    errors.push("config/surface/shadow: library uses no decorative shadows");
  for (const key of [
    "exitSeconds",
    "staggerSeconds",
    "replaceSeconds",
    "drawSeconds",
    "reducedSeconds",
  ])
    if (!(value.motion?.[key] > 0 && value.motion[key] <= 1))
      errors.push(`config/motion/${key}: expected (0,1] seconds`);
  return errors;
}

export function assetMap(episode) {
  const manifest = readJson(resolve(root, "assets/manifest.json"));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.assets))
    throw new Error("assets/manifest.json: expected schemaVersion 1 and assets array");
  const assets = [...manifest.assets, ...episode.assets];
  const map = new Map();
  const paths = new Set();
  for (const asset of assets) {
    if (!assetSchema(asset))
      throw new Error(
        `asset ${asset.id || "?"}: ${assetSchema.errors.map(message).join("; ")}`,
      );
    if (map.has(asset.id)) throw new Error(`Duplicate asset ID: ${asset.id}`);
    if (paths.has(asset.path))
      throw new Error(
        `Duplicate asset path: ${asset.path}; reuse its existing identifier`,
      );
    if (
      asset.type !== "audio" &&
      asset.distribution === "local-required" &&
      !asset.path.startsWith("assets/local/")
    )
      throw new Error(`asset ${asset.id}: local media must use assets/local/`);
    if (asset.type === "audio" && !asset.path.startsWith(`recordings/${episode.id}/`))
      throw new Error(`asset ${asset.id}: audio must use recordings/${episode.id}/`);
    if (
      asset.distribution === "tracked" &&
      (asset.path.startsWith("assets/local/") || asset.path.startsWith("recordings/"))
    )
      throw new Error(
        `asset ${asset.id}: local media must declare local-required distribution`,
      );
    sourcePath(asset.path, { mustExist: false });
    if (!asset.license.redistributionAllowed)
      throw new Error(
        `asset ${asset.id}: distribution permission must be resolved before inclusion`,
      );
    if (asset.license.source.startsWith("assets/")) sourcePath(asset.license.source);
    paths.add(asset.path);
    map.set(asset.id, asset);
  }
  return map;
}

export function requiredAssetIds(episode) {
  return [
    ...new Set([
      config.typography.fontAssetId,
      config.runtimeAssetId,
      ...episode.mediaAssetIds,
      ...episode.scenes.flatMap((scene) =>
        scene.mediaAssetId ? [scene.mediaAssetId] : [],
      ),
      ...(episode.narration
        ? [episode.narration.masterAssetId, episode.narration.editAssetId]
        : []),
    ]),
  ];
}

export function validateEpisode(
  episode,
  { checkFiles = true, checkLocalMedia = true } = {},
) {
  const errors = [...validateConfig()];
  if (!episodeSchema(episode)) return [...errors, ...episodeSchema.errors.map(message)];
  errors.push(...visualErrors(episode, config));
  if (
    episode.kind === "lesson" &&
    (!Number.isInteger(episode.curriculum.unit) ||
      episode.learnerLevel === "fixture" ||
      !/^u\d{3}-p\d{2}-[a-z0-9-]+$/.test(episode.id))
  )
    errors.push(
      "/curriculum: lessons require a unit, learner level and uNNN-pNN-topic ID",
    );
  if (
    episode.kind === "lesson" &&
    !episode.id.startsWith(
      `u${String(episode.curriculum.unit).padStart(3, "0")}-p${String(episode.curriculum.part).padStart(2, "0")}-`,
    )
  )
    errors.push("/id: unit and part must match curriculum");
  if (
    episode.kind === "fixture" &&
    (episode.curriculum.unit !== null ||
      episode.status !== "draft" ||
      !episode.id.startsWith("fixture-"))
  )
    errors.push("/kind: fixtures require fixture-* ID, null unit and draft status");
  if (episode.profile !== "vertical")
    errors.push(
      `/profile: approved series profile is vertical; received ${episode.profile}`,
    );
  if (!config.safeAreas[episode.safeArea])
    errors.push(`/safeArea: unknown safe-area preset ${episode.safeArea}`);
  const p = config.profiles[episode.profile];
  if (
    p &&
    (episode.durationSeconds < p.typicalMinSeconds ||
      episode.durationSeconds > p.typicalMaxSeconds) &&
    !episode.durationReason.trim()
  )
    errors.push("/durationReason: explain durations outside 45–90 seconds");
  const ids = new Set();
  for (const group of ["scenes", "examples", "rules", "quizzes", "captions"])
    for (const item of episode[group]) {
      if (ids.has(item.id)) errors.push(`/${group}: duplicate ID ${item.id}`);
      ids.add(item.id);
    }
  const domIds = new Set(["root", "episode", "narration"]);
  for (const id of [
    ...episode.scenes.flatMap((scene) => [
      scene.id,
      `slot-${scene.id}`,
      `${scene.id}-content`,
      `${scene.id}-answer`,
    ]),
    ...episode.captions.map((cue) => cue.id),
  ]) {
    if (domIds.has(id))
      errors.push(
        `/scenes: generated DOM/timeline ID collision: ${id}; choose a different ID`,
      );
    domIds.add(id);
  }
  for (const quiz of episode.quizzes)
    if (
      quiz.kind === "fill-blank"
        ? !quiz.question.includes("___")
        : quiz.answerIndex >= quiz.choices.length
    )
      errors.push(
        `/quizzes/${quiz.id}/answerIndex: select an existing choice, or use ___ in a fill-blank prompt`,
      );
  let end = 0;
  const tolerance = 0.00001;
  const frameAligned = (time) =>
    Math.abs(
      time * config.profiles.vertical.fps -
        Math.round(time * config.profiles.vertical.fps),
    ) < tolerance;
  for (const scene of episode.scenes) {
    if (!components[scene.component])
      errors.push(`/scenes/${scene.id}/component: unknown component ${scene.component}`);
    else if (!existsSync(resolve(root, components[scene.component].file)))
      errors.push(`/scenes/${scene.id}: component source missing`);
    if (Math.abs(scene.start - end) > tolerance)
      errors.push(
        `/scenes/${scene.id}/start: expected ${end}; scenes must be ordered and contiguous without overlap`,
      );
    if (!frameAligned(scene.start) || !frameAligned(scene.duration))
      errors.push(`/scenes/${scene.id}: timing must align to 30 FPS frame boundaries`);
    if (scene.highlightAt + config.motion.highlightSeconds > scene.duration)
      errors.push(`/scenes/${scene.id}/highlightAt: animation extends beyond scene`);
    for (const id of scene.ruleIds)
      if (!episode.rules.some((rule) => rule.id === id))
        errors.push(`/scenes/${scene.id}/ruleIds: unresolved rule ${id}`);
    for (const [field, group] of [
      ["exampleId", "examples"],
      ["quizId", "quizzes"],
    ])
      if (scene[field] && !episode[group].some((item) => item.id === scene[field]))
        errors.push(`/scenes/${scene.id}/${field}: unresolved ${scene[field]}`);
    if (scene.component === "sentence" && !scene.exampleId)
      errors.push(`/scenes/${scene.id}: sentence requires exampleId`);
    if (
      scene.component === "quiz" &&
      (!scene.quizId ||
        scene.answerAt === undefined ||
        scene.answerAt < config.motion.enterSeconds ||
        scene.answerAt >= scene.duration - config.motion.enterSeconds)
    )
      errors.push(
        `/scenes/${scene.id}: quiz requires quizId and answerAt within the readable hold`,
      );
    if (scene.component === "image" && !scene.mediaAssetId)
      errors.push(`/scenes/${scene.id}: image requires mediaAssetId`);
    if (
      scene.component === "quiz" &&
      !scene.visual &&
      episode.quizzes.find((q) => q.id === scene.quizId)?.kind === "fill-blank"
    )
      errors.push(
        `/scenes/${scene.id}: fill-blank quiz requires visual thinking-pause configuration`,
      );
    end = scene.start + scene.duration;
  }
  if (Math.abs(end - episode.durationSeconds) > tolerance)
    errors.push(
      `/durationSeconds: scene end ${end} differs from declared ${episode.durationSeconds}`,
    );
  let captionEnd = 0;
  for (const cue of episode.captions) {
    if (
      cue.start < captionEnd ||
      cue.end <= cue.start ||
      cue.end > episode.durationSeconds
    )
      errors.push(
        `/captions/${cue.id}: require ordered, non-overlapping 0 <= start < end <= durationSeconds`,
      );
    captionEnd = cue.end;
  }
  try {
    const map = assetMap(episode);
    if (
      map.get(config.runtimeAssetId)?.type !== "runtime" ||
      map.get(config.typography.fontAssetId)?.type !== "font"
    )
      errors.push("config: font and runtime asset IDs must resolve to the correct types");
    for (const id of requiredAssetIds(episode)) {
      if (!map.has(id)) errors.push(`/assets: unresolved asset ${id}`);
      else if (checkFiles)
        sourcePath(map.get(id).path, {
          mustExist: checkLocalMedia || map.get(id).distribution === "tracked",
        });
    }
    for (const scene of episode.scenes)
      if (scene.mediaAssetId && map.get(scene.mediaAssetId)?.type !== "image")
        errors.push(`/scenes/${scene.id}/mediaAssetId: expected an image asset`);
    if (episode.narration) {
      for (const id of [episode.narration.masterAssetId, episode.narration.editAssetId])
        if (map.get(id)?.type !== "audio")
          errors.push(`/narration: ${id} must resolve to audio`);
      if (!episode.narration.transcriptPath.startsWith(`episodes/${episode.id}/`))
        errors.push(
          "/narration/transcriptPath: keep approved transcript text with its episode",
        );
      sourcePath(episode.narration.transcriptPath, { mustExist: checkFiles });
      if (
        Math.abs(episode.narration.durationSeconds - episode.durationSeconds) >
        config.audio.durationToleranceSeconds
      )
        errors.push(
          "/narration/durationSeconds: recording length changed; realign the scene timeline and captions",
        );
    }
  } catch (error) {
    errors.push(error.message);
  }
  if (
    ["voiceover-ready", "visual-review", "QA-approved", "published"].includes(
      episode.status,
    ) &&
    !episode.narration
  )
    errors.push(
      "/narration: this lifecycle stage requires the human recording and approved transcript",
    );
  if (
    ["voiceover-ready", "visual-review", "QA-approved", "published"].includes(
      episode.status,
    ) &&
    !episode.narration?.transcriptApproved
  )
    errors.push("/narration/transcriptApproved: approve the transcript before alignment");
  if (episode.status === "published" && !episode.publication.length)
    errors.push("/publication: published episodes require a platform URL and date");
  for (const record of episode.publication)
    if (
      !/^https:\/\//.test(record.url) ||
      !Number.isFinite(Date.parse(record.publishedAt))
    )
      errors.push("/publication: expected an HTTPS URL and parseable publication date");
  return errors;
}

export function validateAll(files = episodeFiles(), options = {}) {
  const errors = [];
  const ids = new Set();
  for (const file of files) {
    try {
      const episode = readJson(file);
      if (ids.has(episode.id)) errors.push(`Duplicate episode ID: ${episode.id}`);
      ids.add(episode.id);
      if (relative(root, file) !== `episodes/${episode.id}/episode.json`)
        errors.push(`${relative(root, file)}: folder must match episode ID`);
      errors.push(
        ...validateEpisode(episode, options).map(
          (error) => `${relative(root, file)} ${error}`,
        ),
      );
    } catch (error) {
      errors.push(`${relative(root, file)}: ${error.message}`);
    }
  }
  return errors;
}

export function fingerprint(episode) {
  const { status, reviewEvidence, publication, ...content } = episode;
  const hash = createHash("sha256")
    .update(JSON.stringify(content))
    .update(JSON.stringify(config));
  const map = assetMap(episode);
  const files = [
    "assets/manifest.json",
    "package-lock.json",
    "schemas/episode.schema.json",
    "schemas/asset.schema.json",
    "schemas/visual.schema.json",
    ...readdirSync(resolve(root, "compositions/factory")).map(
      (file) => `compositions/factory/${file}`,
    ),
    ...["project.mjs", "build.mjs", "media.mjs", "factory.mjs"].map(
      (file) => `scripts/${file}`,
    ),
  ];
  for (const id of requiredAssetIds(episode)) files.push(map.get(id).path);
  for (const id of requiredAssetIds(episode))
    if (map.get(id).license.source.startsWith("assets/"))
      files.push(map.get(id).license.source);
  if (episode.narration) files.push(episode.narration.transcriptPath);
  for (const file of [...new Set(files)].sort())
    hash.update(file).update(readFileSync(resolve(root, file)));
  return hash.digest("hex");
}

export function readinessErrors(episode) {
  const errors = validateEpisode(episode);
  if (errors.length) return errors;
  if (episode.kind === "fixture") errors.push("Fixtures cannot be released");
  if (!["QA-approved", "published"].includes(episode.status))
    errors.push("Release requires QA-approved status");
  if (!episode.narration) errors.push("Missing human narration blocks final release");
  if (
    !episode.narration?.transcriptApproved ||
    !episode.narration?.captionsApproved ||
    !episode.captions.length
  )
    errors.push("Release requires approved transcript and timed captions");
  if (!episode.rules.length || !episode.examples.length || !episode.quizzes.length)
    errors.push("Release requires original rules, examples and a checked quiz");
  const purposes = [
    "hook",
    "real-life-example",
    "visual-explanation",
    "grammar-breakdown",
    "guided-practice",
    "recap",
  ];
  if (
    episode.scenes
      .map((scene) => scene.purpose)
      .filter((purpose, index, array) => index === 0 || purpose !== array[index - 1])
      .join(",") !== purposes.join(",")
  )
    errors.push(
      "Release requires the six teaching phases in order; adjacent scenes may share a phase",
    );
  if (JSON.stringify(episode).includes("TODO"))
    errors.push("Resolve all TODO placeholders before release");
  if (
    !episode.reviewEvidence ||
    !Object.values(episode.reviewEvidence.checks).every(Boolean) ||
    !Number.isFinite(Date.parse(episode.reviewEvidence.reviewedAt))
  )
    errors.push(
      "Release requires named, dated content, visual, audio and caption review evidence",
    );
  else if (episode.reviewEvidence.fingerprint !== fingerprint(episode))
    errors.push(
      "Review fingerprint is stale; review the current script, timing, assets, configuration and renderer",
    );
  return errors;
}
