# Unit 1 — complete silent lesson

Episode: `u001-p01-am-is-are-complete`. One continuous 637-second lesson; `p01`
is required internal schema metadata, not an audience-facing part or sub-episode.
The earlier partial lesson remains untouched. This is a draft, not release-ready.

`episode.json` owns the complete script, 39 scenes, provisional captions, five
practice questions, timings and asset provenance. `SCRIPT.md` is the editable
reading copy; update both when revising narration. Eight original SVG illustrations
are in `assets/`. No stock media, textbook images, third-party icons or music.

## Teaching sequence

Meaning of be and present states → subject and agreement → singular/plural you →
negative meaning and not placement → all seven positive contractions → I'm not
and both negative contraction patterns → that's, there's, here's → five practice
pauses with explanations → two concise recap scenes.

Beginner-confusion review: subject means the person/thing discussed; present means
now or generally true; negative means the description is not true; contraction
means words joined into a shorter form. Singular you still takes are. Both
negative contraction patterns retain meaning; standard everyday English uses
I'm not. There's introduces something present, rather than identifying possession;
here's fits offering an item. Questions and advanced meanings of 's remain outside
this unit. Practice waits six seconds before revealing an explained answer.

Grammar cross-checks (accuracy references only; examples independently written):
[British Council, present be](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/present-simple-be?page=2)
and [Cambridge, here and there](https://dictionary.cambridge.org/grammar/british-grammar/here-and-there?q=here).
Cambridge's full page blocked retrieval; its indexed explanation was available.
No private screenshots were found locally.

## Review and revisions

```bash
npm run validate
npm run check:static
HYPERFRAMES_BROWSER_PATH="$(command -v chromium)" npm run check -- u001-p01-am-is-are-complete
npm run preview -- u001-p01-am-is-are-complete
HYPERFRAMES_BROWSER_PATH="$(command -v chromium)" npm run check:visual -- u001-p01-am-is-are-complete http://localhost:3003
HYPERFRAMES_BROWSER_PATH="$(command -v chromium)" npm run render:draft -- u001-p01-am-is-are-complete
```

Use the actual port printed by preview. Draft output is
`renders/u001-p01-am-is-are-complete/draft.mp4` when using the factory wrapper.
The reviewed six-worker export is `renders/u001-p01-am-is-are-complete/review-silent.mp4`.
The preview is editable; translate
Studio changes back into episode JSON/shared components before rebuilding.

Later record the owner reading the reviewed script. Preserve the original and a
separate normalized edit, declare both assets and narration metadata, and manually
align scene/caption times to that recording. Replace provisional captions with the
verified spoken transcript; clear obsolete review evidence and rerun checks. Follow
`docs/PRODUCTION_WORKFLOW.md` for human approvals and production export. Do not
infer recording/caption approval from this silent render.
