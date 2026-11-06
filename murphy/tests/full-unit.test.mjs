import test from "node:test";
import assert from "node:assert/strict";
import { loadEpisode, validateEpisode, assetMap, config } from "../scripts/project.mjs";
import { components } from "../compositions/factory/components.mjs";
test("complete unit is silent and its contextual assets and reading holds are validated", () => {
  const e = structuredClone(loadEpisode("u001-p01-am-is-are-complete"));
  assert.deepEqual(validateEpisode(e), []);
  assert.equal(e.narration, null);
  assert.equal(e.quizzes.length, 5);
  const s = e.scenes.find((s) => s.component === "visual-context");
  assert.match(components["visual-context"].render(s, e, assetMap(e)), /<img/);
  assert.match(components["visual-context"].animate(s, config, e), /fromTo/);
  s.visual.states[0].assetId = "missing";
  assert.match(validateEpisode(e).join("\n"), /context asset/);
  s.visual.states[0].at = s.duration;
  assert.match(validateEpisode(e).join("\n"), /final hold/);
});
