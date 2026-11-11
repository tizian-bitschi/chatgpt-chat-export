const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('exports the full user message without the expansion control', async () => {
  const script = fs.readFileSync('extension/export.js', 'utf8');
  let downloaded;
  const scroller = { scrollHeight: 100, clientHeight: 100, scrollTop: 0, parentElement: null };
  const fullText = 'First paragraph.\nMehr anzeigen\nLast paragraph.';
  const fullMessage = { innerText: fullText };
  const bubble = { innerText: `${fullText}\n…\nMehr anzeigen`, querySelector: selector => selector === '[data-search-result-target]' ? fullMessage : null };
  const user = {
    parentElement: scroller,
    getAttribute: name => ({ 'data-chatgpt-search-unit-key': 'turn:0:user', 'data-chatgpt-search-message-ids': 'user-1' })[name] || null,
    querySelector: selector => selector.includes('[data-user-message-bubble]') ? bubble : null,
    closest: () => null,
  };
  const document = {
    title: 'Example', scrollingElement: scroller,
    getElementById: () => null,
    querySelector: selector => selector.startsWith('[data-message-author-role=') ? user : null,
    querySelectorAll: () => [user],
    body: { append() {} },
    createElement: () => ({ style: {}, dataset: {}, setAttribute() {}, append() {}, addEventListener() {}, click() {} }),
  };
  const context = {
    document, Blob, getComputedStyle: () => ({ overflowY: 'auto' }),
    browser: { runtime: { sendMessage: () => Promise.resolve() } },
    setTimeout: callback => callback(),
    URL: { createObjectURL: blob => { downloaded = blob; return 'blob:test'; }, revokeObjectURL() {} },
  };
  await vm.runInNewContext(script, context);
  assert.ok(downloaded, 'export should produce a file');
  const result = await downloaded.text();
  assert.equal(result, `Example\n\nDu:\n${fullText}\n`);
});
