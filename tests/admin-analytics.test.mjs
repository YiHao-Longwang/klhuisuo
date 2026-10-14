import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

async function scriptHarness(file, hooks, elements) {
  const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
  const context = vm.createContext({
    document: {
      readyState: "loading", addEventListener() {},
      querySelector: (selector) => elements[selector] || null,
      querySelectorAll: () => [],
    },
    window: {}, location: { hostname: "example.com" },
  });
  vm.runInContext(source.replace("\n})();", "\n" + hooks + "\n})();"), context);
  return context.window.hooks;
}

test("dashboard includes WhatsApp and Telegram for technician selection", async () => {
  const grid = { innerHTML: "" };
  const api = await scriptHarness("public/admin-reservations.js", `
    window.hooks = undefined;
    window.hooks = { render: function (summary) { clickSummary = summary; renderClickStats(); } };
  `, { "[data-admin-click-stats]": grid });
  api.render([
    { site: "klhuisuo", source: "main", channel: "telegram", total: 17 },
    { site: "klhuisuo", source: "jishi_tiaoxuan", channel: "whatsapp", total: 9 },
    { site: "jinyuehui", source: "jishi_tiaoxuan", channel: "telegram", total: 22 },
    { site: "unknown", source: "unknown", channel: "wechat", total: 31 },
  ]);
  for (const label of ["金悦汇", "Nanhai Onsen", "吉隆坡会所"]) {
    assert.match(grid.innerHTML, new RegExp(label + " · 技师挑选 · WhatsApp"));
    assert.match(grid.innerHTML, new RegExp(label + " · 技师挑选 · Telegram"));
  }
  assert.doesNotMatch(grid.innerHTML, /技师挑选 · WeChat/);
  assert.match(grid.innerHTML, /金悦汇 · 技师挑选 · Telegram<\/span><strong>22/);
  assert.match(grid.innerHTML, /吉隆坡会所 · 主页 · Telegram<\/span><strong>17/);
  assert.match(grid.innerHTML, /吉隆坡会所 · 技师挑选 · WhatsApp<\/span><strong>9/);
  assert.match(grid.innerHTML, /旧记录 · 旧来源 · WeChat<\/span><strong>31/);
});

test("technician filter offers WhatsApp and Telegram and hides WeChat", async () => {
  const channel = { value: "all", dataset: {}, options: ["all", "whatsapp", "telegram", "wechat"].map(value => ({value})) };
  const area = { value: "jishi_tiaoxuan" };
  const note = { hidden: true };
  const graph = { innerHTML: "" };
  const api = await scriptHarness("public/admin-click-history.js", `
    window.hooks = { sync: syncChannelOptions, render: function (series, groups) { seriesRows = series; dailyGroupRows = groups; renderGraph(); } };
  `, {
    "[data-click-channel]": channel, "[data-click-source]": area,
    "[data-click-channel-note]": note, "[data-click-graph]": graph,
  });
  api.sync();
  assert.equal(channel.value, "all");
  assert.equal(note.hidden, false);
  assert.deepEqual(channel.options.filter(o => !o.disabled).map(o => o.value), ["all", "whatsapp", "telegram"]);
  api.render([{day:"2026-10-02",whatsapp:9,telegram:4,total:13}], [{day:"2026-10-02",site:"klhuisuo",source:"jishi_tiaoxuan",whatsapp:9,telegram:4,total:13}]);
  assert.match(graph.innerHTML, /吉隆坡会所/);
  assert.match(graph.innerHTML, /WhatsApp/);
  assert.match(graph.innerHTML, /Telegram/);
  assert.doesNotMatch(graph.innerHTML, /WeChat|click-line wc/);
  assert.match(graph.innerHTML, /<strong class="wa">9/);
  assert.match(graph.innerHTML, /<strong class="tg">4/);
  area.value = "main";
  api.sync();
  assert.equal(channel.value, "all");
  assert.equal(note.hidden, true);
  assert.equal(channel.options.filter(o => !o.disabled).length, 4);
});

test("both backend implementations recognize klhuisuo instead of broadening its filter to all sites", async () => {
  for (const file of ["server/index.mjs", "app/api/contact-clicks/route.ts"]) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    const clean = source.match(/function clean\(value[^)]*\) \{[\s\S]*?\n\}/)[0].replace("value: unknown", "value");
    const filter = source.match(/function siteFilter\(value[^)]*\) \{[\s\S]*?\n\}/)[0].replace("value: unknown", "value");
    const context = vm.createContext({});
    vm.runInContext(clean + "\n" + filter, context);
    assert.equal(context.siteFilter("klhuisuo"), "klhuisuo", file);
    assert.equal(context.siteFilter("jinyuehui"), "jinyuehui", file);
    assert.equal(context.siteFilter("onespa"), "onespa", file);
    assert.equal(context.siteFilter("not-a-site"), "all", file);
  }
});
