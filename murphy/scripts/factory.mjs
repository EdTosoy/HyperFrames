import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, relative } from "node:path";
import {
  root,
  config,
  loadEpisode,
  validateEpisode,
  validateAll,
  episodeFiles,
  readJson,
  readinessErrors,
  fingerprint,
} from "./project.mjs";
import { buildEpisode } from "./build.mjs";
import { probe, outputErrors, narrationErrors } from "./media.mjs";

const cli = resolve(root, "node_modules/hyperframes/bin/hyperframes.mjs");
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit", ...options });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${command === process.execPath ? "Node/HyperFrames" : command} failed (${result.status ?? result.signal})`,
    );
}
const hf = (...args) => run(process.execPath, [cli, ...args]);
function fail(errors) {
  if (errors.length) throw new Error(errors.map((error) => `- ${error}`).join("\n"));
}
function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? sourceFiles(resolve(directory, entry.name))
      : entry.name.endsWith(".mjs")
        ? [resolve(directory, entry.name)]
        : [],
  );
}

const [command = "validate", arg, ...flags] = process.argv.slice(2);
try {
  if (
    ![
      "validate",
      "lint",
      "static",
      "check",
      "build",
      "preview",
      "status",
      "stop",
      "ready",
      "draft",
      "production",
      "new",
    ].includes(command)
  )
    throw new Error(`Unknown factory command: ${command}`);
  if (command === "new") {
    const match = arg?.match(/^u(\d{3})-p(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/);
    if (!match || Number(match[1]) < 1 || Number(match[2]) < 1)
      throw new Error("Use: npm run episode:new -- uNNN-pNN-topic");
    const destination = resolve(root, "episodes", arg);
    if (existsSync(destination)) throw new Error(`Episode already exists: ${arg}`);
    const episode = structuredClone(loadEpisode());
    Object.assign(episode, {
      id: arg,
      kind: "lesson",
      curriculum: {
        reference:
          "Essential Grammar in Use (red book); private curriculum reference only",
        unit: Number(match[1]),
        part: Number(match[2]),
      },
      title: "TODO original title",
      learningObjective: "TODO one measurable learning objective",
      learnerLevel: "A1",
      hook: "TODO original hook",
      script: "TODO original human narration script",
      rules: [],
      examples: [],
      quizzes: [],
      durationSeconds: 60,
      durationReason: "",
      captions: [],
    });
    episode.scenes = [
      "hook",
      "real-life-example",
      "visual-explanation",
      "grammar-breakdown",
      "guided-practice",
      "recap",
    ].map((purpose, index) => ({
      id: `scene-${index + 1}`,
      purpose,
      component: "card",
      start: index * 10,
      duration: 10,
      heading: `TODO ${purpose.replaceAll("-", " ")}`,
      body: "TODO original visual content",
      ruleIds: [],
      highlightAt: 0.3,
    }));
    mkdirSync(destination);
    writeFileSync(
      resolve(destination, "episode.json"),
      `${JSON.stringify(episode, null, 2)}\n`,
      { flag: "wx" },
    );
    console.log(
      `Created draft ${relative(root, destination)}. Replace TODOs; do not copy textbook prose.`,
    );
  } else if (command === "validate") {
    if (arg && arg !== "--portable")
      throw new Error("validate accepts only optional --portable (CI source checks)");
    fail(validateAll(undefined, { checkLocalMedia: arg !== "--portable" }));
    console.log(
      arg === "--portable"
        ? "PASS: portable schemas, references, tracked assets and timelines; local-required bytes are checked at build/release"
        : "PASS: all episode schemas, references, assets and timeline contracts",
    );
  } else if (command === "lint") {
    for (const file of [
      ...sourceFiles(resolve(root, "scripts")),
      ...sourceFiles(resolve(root, "compositions/factory")),
      ...sourceFiles(resolve(root, "tests")),
    ])
      run(process.execPath, ["--check", file]);
    console.log("PASS: Node source syntax");
  } else if (command === "static" || command === "check") {
    fail(validateAll(undefined, { checkLocalMedia: false }));
    hf(command === "static" ? "lint" : "check", root);
    const fixtures = arg
      ? [loadEpisode(arg)]
      : episodeFiles()
          .map(readJson)
          .filter((episode) => episode.kind === "fixture");
    for (const episode of fixtures)
      hf(command === "static" ? "lint" : "check", buildEpisode(episode));
  } else {
    if (
      flags.some((flag) => flag !== "--fingerprint") ||
      (flags.length && command !== "ready")
    )
      throw new Error("Unsupported arguments");
    if (["production", "ready"].includes(command) && !arg)
      throw new Error(`${command} requires an explicit episode ID`);
    const episode = loadEpisode(arg);
    if (command === "ready") {
      if (flags.includes("--fingerprint")) {
        fail(validateEpisode(episode));
        console.log(fingerprint(episode));
      } else {
        fail(readinessErrors(episode));
        fail(narrationErrors(episode));
        console.log(
          `PASS: production input readiness for ${episode.id}. Export still needs output QA.`,
        );
      }
    } else if (command === "status" || command === "stop") {
      hf(
        "preview",
        resolve(root, ".hyperframes-build", episode.id),
        command === "status" ? "--status" : "--stop",
      );
    } else {
      if (command === "production") {
        fail(readinessErrors(episode));
        fail(narrationErrors(episode));
      }
      const destination = buildEpisode(episode, { draft: command !== "production" });
      if (command === "build") console.log(`Built ${relative(root, destination)}`);
      if (command === "preview") hf("preview", destination, "--background");
      if (command === "draft" || command === "production") {
        hf("check", destination);
        const directory = resolve(root, "renders", episode.id);
        mkdirSync(directory, { recursive: true });
        const output = resolve(directory, `${command}.mp4`);
        hf(
          "render",
          destination,
          "--quality",
          command === "draft" ? "draft" : "delivery",
          "--format",
          config.profiles[episode.profile].container,
          "--fps",
          String(config.profiles[episode.profile].fps),
          "--workers",
          "2",
          "--strict",
          "--output",
          output,
        );
        fail(
          outputErrors(probe(output), episode, {
            requireAudio: command === "production" || Boolean(episode.narration),
          }),
        );
        writeFileSync(
          resolve(directory, `${command}.verification.json`),
          `${JSON.stringify({ episodeId: episode.id, fingerprint: fingerprint(episode), output: relative(root, output), probe: probe(output), requiresHumanExportReview: true }, null, 2)}\n`,
        );
        console.log(
          `PASS: encoded media contract ${relative(root, output)}. Watch and listen before approval.`,
        );
      }
    }
  }
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}
