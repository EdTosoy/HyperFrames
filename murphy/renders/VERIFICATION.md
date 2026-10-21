# Verification — Am, Is & Are

PASS: `HYPERFRAMES_BROWSER_PATH=/etc/profiles/per-user/edtosoy/bin/chromium npm run check`
Final report: `.hyperframes/artifacts/checks/21d47431-84a9-4986-b301-84ca5a27d772.json`.
Zero lint findings, zero runtime findings, zero layout issues across nine samples,
zero motion findings, and 52/52 text checks passing WCAG AA.

PASS: six ordered-word assertions, answer arrival by 27.6 seconds, and sentence bounds.
PASS: native `hyperframes keyframes` and `timeline --json` inspection; focused verb motion strip captured.
PASS: scene midpoint, word progression, quiz-before-answer, answer, and final-frame snapshots visually inspected.
PASS: managed Studio preview running at http://localhost:3002/#project/grammar-video-factory; HTTP 200.
PASS: delivery-quality MP4 render completed in 49.7 seconds with hardware GPU.
Renderer final summary reports screenshot capture; runtime traces also mention BeginFrame.
PASS: ffprobe confirms H.264/yuv420p, 1080×1920, 30 fps, 900 frames, exactly 30.000000 seconds, 1,579,138 bytes. Silent video.
PASS: eight decoded MP4 frames visually inspected, including every scene, the blank quiz, the answer reveal, and frame 899. Final answer remains visible.

Browser diagnosis: bundled Chrome lacks NixOS shared libraries; Chromium startup is
restricted inside the agent sandbox. The existing NixOS Chromium passed an isolated
headless launch outside the sandbox and was selected through HYPERFRAMES_BROWSER_PATH.
No system configuration was changed. Optional voice, transcription, music, and search models were not installed.

The optional animation-map helper could not resolve its helper packages; native CLI
keyframe inspection supplied motion-map evidence without adding dependencies.
An optional numerical image comparison was unavailable because Pillow is absent;
visual inspection of decoded frames completed successfully. No dependency was added.

No commits, pushes, or external publication were performed. Studio remains running for review.
