# Unit 1 · Part 1 — take 2

Active narration is the owner's supplied `2.mp3`, stored unchanged as
`take-02-original.mp3`. The unused first take is retained as `take-01-original.mp3`.
Loose root inputs were tidied after verifying take 2's duplicate was byte-identical. SHA-256 is recorded in `edit-v02.json`. No take 1 audio is
used. Superseded preparation is preserved under ignored
`renders/u001-p01-am-is-are/versions/abandoned-audio1-preparation/`.

`edit-v02.wav` is the 48 kHz mono PCM 24-bit working edit. Speech speed is unchanged.
Three seconds of silence were inserted at source 97 seconds (inside a detected
quiet gap) for the required quiz pause. End padding brings the timeline to 126.3
seconds. Two-pass FFmpeg normalization targets central audio standards with an
extra 0.5 dB of peak headroom for AAC. Measured edit: -16.34 LUFS, -1.47 dBTP.
`edit-v02-pre-normalize.wav` preserves the editorial intermediate.

These MP3/WAV files are ignored; back up originals and working files independently
of Git. The original MP3 is the declared source/master reference, not a lossless
48 kHz recording master. Converting it does not recover lost detail. This draft
keeps final-release master-format gates intact; see docs/PRODUCTION_WORKFLOW.md.

The transcript is the known script, not a verified transcription. Sentence/caption
estimates use script sequence and quiet gaps; no recognizer or listening review
was available. Verify the actual words, insertion boundary and cue alignment by
listening to the encoded MP4. Both transcript/caption approval flags remain false.
Episode JSON alone owns active timing. Local alignment estimates in renders/ are
review evidence, never a second runtime timing source.
