# Infrastructure fixture

This six-second smoke test is unrelated to a textbook unit. It tests the shared
frame, card, sentence underline, quiz reveal and caption band. Its `kind: fixture`,
null unit and draft status permanently block production release. It has no
narration because the owner has not supplied a recording.

For a future lesson, declare recordings in the episode's assets array:

```json
{
  "id": "uNNN-pNN-topic-edit-v01",
  "type": "audio",
  "path": "recordings/uNNN-pNN-topic/edit-v01.wav",
  "creator": "Owner",
  "source": "Original human voice recording",
  "license": {
    "name": "Original owned recording",
    "source": "Owner permission for this series",
    "redistributionAllowed": true
  },
  "attribution": "No external attribution required",
  "intendedUsage": "Episode narration",
  "distribution": "local-required"
}
```

Declare the original take separately, then replace `narration: null` with the
fields defined in schemas/episode.schema.json. The approved transcript is tracked
text; audio stays local and backed up. Do not turn this fixture into a lesson;
create a separate episode with `episode:new`. See docs/PRODUCTION_WORKFLOW.md.
