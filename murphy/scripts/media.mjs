import { spawnSync } from "node:child_process";
import { config, assetMap, sourcePath } from "./project.mjs";

export function probe(path) {
  const result = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_format", "-show_streams", "-of", "json", path],
    { encoding: "utf8" },
  );
  if (result.error || result.status !== 0)
    throw new Error(
      `ffprobe failed for ${path}: ${result.error?.message || result.stderr.trim()}`,
    );
  return JSON.parse(result.stdout);
}

export function outputErrors(info, episode, { requireAudio = true } = {}) {
  const p = config.profiles[episode.profile];
  const video = info.streams.find((stream) => stream.codec_type === "video");
  const audio = info.streams.find((stream) => stream.codec_type === "audio");
  const errors = [];
  if (!info.format?.format_name?.split(",").includes("mp4"))
    errors.push("Export container must be MP4");
  const [numerator, denominator] = (video?.avg_frame_rate || "0/1")
    .split("/")
    .map(Number);
  if (
    !video ||
    video.width !== p.width ||
    video.height !== p.height ||
    numerator / denominator !== p.fps ||
    video.codec_name !== p.videoCodec ||
    video.pix_fmt !== p.pixelFormat
  )
    errors.push("Export must be 1080×1920, 30 FPS, H.264 and yuv420p");
  if (
    Math.abs(Number(info.format.duration) - episode.durationSeconds) >
      config.audio.durationToleranceSeconds ||
    !Number.isFinite(Number(info.format.duration))
  )
    errors.push("Export duration differs from episode timeline");
  if (
    requireAudio &&
    (!audio ||
      audio.codec_name !== p.audioCodec ||
      Number(audio.sample_rate) !== config.audio.sampleRate)
  )
    errors.push("Export requires audible narration encoded as 48 kHz AAC");
  return errors;
}

export function narrationErrors(episode) {
  if (!episode.narration) return ["Missing human narration blocks final release"];
  const assets = assetMap(episode);
  const errors = [];
  for (const [role, id] of [
    ["master", episode.narration.masterAssetId],
    ["edit", episode.narration.editAssetId],
  ]) {
    const path = sourcePath(assets.get(id).path);
    const info = probe(path);
    const stream = info.streams.find((item) => item.codec_type === "audio");
    if (
      !info.format.format_name.split(",").includes("wav") ||
      !stream?.codec_name?.startsWith("pcm_") ||
      Number(stream.sample_rate) !== config.audio.sampleRate ||
      stream.channels !== config.audio.channels
    )
      errors.push(`Narration ${role}: use 48 kHz mono PCM WAV`);
    if (
      role === "edit" &&
      Math.abs(Number(info.format.duration) - episode.narration.durationSeconds) >
        config.audio.durationToleranceSeconds
    )
      errors.push("Narration edit duration changed; realign scenes and captions");
  }
  const path = sourcePath(assets.get(episode.narration.editAssetId).path);
  const measure = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-nostats",
      "-i",
      path,
      "-af",
      `loudnorm=I=${config.audio.targetLufs}:TP=${config.audio.maxTruePeakDb}:print_format=json`,
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8" },
  );
  if (measure.error || measure.status !== 0)
    errors.push(
      `Narration loudness measurement failed: ${measure.error?.message || "ffmpeg returned an error"}`,
    );
  else {
    const match = measure.stderr.match(/\{\s*"input_i"[\s\S]*?\}/);
    if (!match) errors.push("Narration loudness could not be measured");
    else {
      const values = JSON.parse(match[0]);
      if (
        !Number.isFinite(Number(values.input_i)) ||
        Math.abs(Number(values.input_i) - config.audio.targetLufs) >
          config.audio.lufsTolerance
      )
        errors.push(
          `Narration loudness ${values.input_i} LUFS: target ${config.audio.targetLufs} ± ${config.audio.lufsTolerance}; normalize a copy, then review again`,
        );
      if (
        !Number.isFinite(Number(values.input_tp)) ||
        Number(values.input_tp) > config.audio.maxTruePeakDb
      )
        errors.push(
          `Narration true peak ${values.input_tp} dBTP exceeds ${config.audio.maxTruePeakDb}`,
        );
    }
  }
  return errors;
}
