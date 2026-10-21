import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  loadEpisode,
  validateEpisode,
  validateAll,
  validateConfig,
  config,
  root,
  readinessErrors,
  sourcePath,
  fingerprint,
} from "../scripts/project.mjs";
import { buildEpisode } from "../scripts/build.mjs";
import { outputErrors } from "../scripts/media.mjs";

const fixture = () => structuredClone(loadEpisode());
const rejects = (edit, pattern) => {
  const episode = fixture();
  edit(episode);
  assert.match(validateEpisode(episode).join("\n"), pattern);
};
test("fixture and repository are valid and fixture is never releasable", () => {
  assert.deepEqual(validateAll(undefined, { checkLocalMedia: false }), []);
  assert.match(readinessErrors(fixture()).join("\n"), /Fixtures cannot be released/);
  assert.match(readinessErrors(fixture()).join("\n"), /Missing human narration/);
});
test("schemas reject unsupported versions, missing fields and unknown keys", () => {
  rejects((e) => {
    e.schemaVersion = 2;
  }, /schemaVersion/);
  rejects((e) => {
    delete e.script;
  }, /script/);
  rejects((e) => {
    e.unexpected = true;
  }, /unexpected/);
});
test("repository validation detects duplicate episode IDs", () => {
  const file = resolve(root, "episodes/fixture-pipeline-smoke/episode.json");
  assert.match(validateAll([file, file]).join("\n"), /Duplicate episode ID/);
});
test("scene contracts reject duplicate IDs, unresolved components and references", () => {
  rejects((e) => {
    e.scenes[1].id = e.scenes[0].id;
  }, /duplicate ID/);
  rejects((e) => {
    e.scenes[0].component = "missing";
  }, /unknown component/);
  rejects((e) => {
    e.scenes[1].exampleId = "missing";
  }, /unresolved/);
  rejects((e) => {
    e.scenes[0].ruleIds = ["missing"];
  }, /unresolved rule/);
  rejects((e) => {
    e.quizzes[0].answerIndex = 99;
  }, /answerIndex/);
});
test("timeline contracts reject overlap, gaps, overflow and sub-frame scene boundaries", () => {
  rejects((e) => {
    e.scenes[1].start = 1;
  }, /without overlap/);
  rejects((e) => {
    e.scenes[1].start = 3;
  }, /contiguous/);
  rejects((e) => {
    e.durationSeconds = 7;
  }, /scene end/);
  rejects((e) => {
    e.scenes[0].duration = 2.01;
  }, /frame boundaries/);
  rejects((e) => {
    e.scenes[2].answerAt = 2;
  }, /answerAt/);
});
test("caption contract rejects backwards, overlapping and out-of-range timestamps", () => {
  rejects((e) => {
    e.captions[0].end = -1;
  }, /end/);
  rejects((e) => {
    e.captions[0].start = 2;
  }, /start < end/);
  rejects((e) => {
    e.captions.push({ ...e.captions[0], id: "second" });
  }, /non-overlapping/);
  rejects((e) => {
    e.captions[0].end = 7;
  }, /durationSeconds/);
});
test("assets require explicit licensing and resolvable source files", () => {
  rejects((e) => {
    e.mediaAssetIds = ["not-present"];
  }, /unresolved asset/);
  const asset = {
    id: "missing-image",
    type: "image",
    path: "assets/local/no-such-fixture.svg",
    creator: "Fixture author",
    source: "Original test fixture",
    license: {
      name: "Original",
      source: "Original fixture",
      redistributionAllowed: true,
    },
    attribution: "No attribution required",
    intendedUsage: "Test failure path",
    distribution: "local-required",
  };
  rejects((e) => {
    e.assets = [asset];
    e.mediaAssetIds = [asset.id];
  }, /Required source missing/);
  rejects((e) => {
    e.assets = [
      { ...asset, license: { ...asset.license, redistributionAllowed: false } },
    ];
  }, /permission/);
  rejects((e) => {
    e.assets = [{ ...asset, creator: "" }];
  }, /creator/);
  assert.throws(
    () => sourcePath("assets/../references-private/page.png"),
    /Unsafe source path/,
  );
  assert.throws(() => sourcePath("references-private/page.png"), /Unsafe source path/);
});
test("configuration rejects horizontal format and invalid safe areas", () => {
  const changed = structuredClone(config);
  changed.profiles.vertical.width = 1920;
  assert.match(validateConfig(changed).join("\n"), /approved output/);
  changed.safeAreas["social-conservative"].top = 1900;
  assert.match(validateConfig(changed).join("\n"), /content region/);
});
test("generated composition uses the centralized profile, timings and local media", () => {
  const episode = fixture();
  const destination = buildEpisode(episode);
  const html = readFileSync(resolve(destination, "index.html"), "utf8");
  assert.match(html, /data-width="1080" data-height="1920" data-fps="30"/);
  for (const scene of episode.scenes)
    assert.ok(
      html.includes(`data-start="${scene.start}" data-duration="${scene.duration}"`),
    );
  assert.match(html, /window\.__timelines\['episode'\]=tl/);
  assert.match(html, /NOT FOR PUBLICATION/);
  assert.match(html, /--canvas:#F6F5F0/);
  assert.doesNotMatch(html, /https?:\/\//);
  const quiz = readFileSync(
    resolve(destination, "compositions/fixture-practice.html"),
    "utf8",
  );
  assert.match(quiz, /fixture-practice-answer/);
  assert.match(quiz, /window\.__timelines\['fixture-practice'\]=tl/);
});
test("export probe rejects wrong dimensions, FPS, duration, codec and missing audio", () => {
  const episode = fixture();
  const info = {
    format: { format_name: "mov,mp4,m4a,3gp,3g2,mj2", duration: "6" },
    streams: [
      {
        codec_type: "video",
        codec_name: "h264",
        width: 1080,
        height: 1920,
        avg_frame_rate: "30/1",
        pix_fmt: "yuv420p",
      },
      { codec_type: "audio", codec_name: "aac", sample_rate: "48000" },
    ],
  };
  assert.deepEqual(outputErrors(info, episode), []);
  const bad = structuredClone(info);
  bad.streams[0].width = 1920;
  bad.streams[0].codec_name = "vp9";
  bad.streams[0].avg_frame_rate = "24/1";
  bad.format.duration = 9;
  bad.streams.pop();
  assert.equal(outputErrors(bad, episode).length, 3);
  assert.deepEqual(
    outputErrors({ ...info, streams: [info.streams[0]] }, episode, {
      requireAudio: false,
    }),
    [],
  );
});
test("review fingerprint changes with content while approval metadata stays independent", () => {
  const original = fixture();
  const expected = fingerprint(original);
  original.status = "QA-approved";
  assert.equal(fingerprint(original), expected);
  original.script += " A correction.";
  assert.notEqual(fingerprint(original), expected);
});
test("stale review evidence and missing recording prevent release", () => {
  const episode = fixture();
  episode.reviewEvidence = {
    fingerprint: "0".repeat(64),
    reviewer: "Fixture reviewer",
    reviewedAt: "2026-10-22T00:00:00.000Z",
    checks: {
      originality: true,
      grammar: true,
      visual: true,
      audio: true,
      captions: true,
    },
  };
  assert.match(readinessErrors(episode).join("\n"), /fingerprint is stale/);
  episode.status = "visual-review";
  assert.match(validateEpisode(episode).join("\n"), /requires the human recording/);
});
test("a changed narration duration requires scene and caption realignment", () => {
  const episode = fixture();
  episode.narration = {
    performer: "human-owner",
    masterAssetId: "test-master",
    editAssetId: "test-edit",
    transcriptPath: `episodes/${episode.id}/transcript.txt`,
    durationSeconds: 9,
    transcriptApproved: true,
    captionsApproved: true,
  };
  assert.match(
    validateEpisode(episode, { checkFiles: false }).join("\n"),
    /recording length changed/,
  );
});
test("portable CI validates local-required declarations without requiring private media", () => {
  const episode = fixture();
  const asset = {
    id: "private-local-image",
    type: "image",
    path: "assets/local/no-such-private-source.png",
    creator: "Owner",
    source: "Original artwork",
    license: {
      name: "Original owned work",
      source: "Owner grant",
      redistributionAllowed: true,
    },
    attribution: "No attribution required",
    intendedUsage: "Local production input",
    distribution: "local-required",
  };
  episode.assets.push(asset);
  episode.mediaAssetIds.push(asset.id);
  assert.match(validateEpisode(episode).join("\n"), /Required source missing/);
  assert.deepEqual(validateEpisode(episode, { checkLocalMedia: false }), []);
  asset.path = "assets/no-such-tracked-source.png";
  asset.distribution = "tracked";
  assert.match(
    validateEpisode(episode, { checkLocalMedia: false }).join("\n"),
    /Required source missing/,
  );
});
