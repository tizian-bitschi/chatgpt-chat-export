(async () => {
  if (document.getElementById("chat-export-panel")) return;
  const panel = document.createElement("div");
  panel.id = "chat-export-panel";
  panel.style.cssText = "position:fixed;z-index:2147483647;right:16px;top:16px;width:300px;padding:16px;background:#fff;color:#202123;border:1px solid #bbb;border-radius:8px;box-shadow:0 4px 18px #0003;font:14px/1.5 system-ui,sans-serif";
  const label = document.createElement("strong");
  label.textContent = "Chat-Export";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.textContent = "Export wird vorbereitet …";
  const button = document.createElement("button");
  button.textContent = "Export abbrechen";
  button.style.cssText = "background:#155e4c;color:#fff;border:0;border-radius:5px;padding:8px 12px;cursor:pointer";
  panel.append(label, status, button);
  document.body.append(panel);
  browser.runtime.sendMessage({type: "chat-export-started"}).catch(() => {});
  let cancelled = false;
  button.addEventListener("click", () => {
    if (button.dataset.done) { panel.remove(); return; }
    cancelled = true;
    button.disabled = true;
    status.textContent = "Abbruch angefordert …";
  });
  try {
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const selector = '[data-message-author-role="user"], [data-message-author-role="assistant"], [data-chatgpt-search-unit-key$=":user"], [data-chatgpt-search-unit-key$=":assistant"]';
  const first = document.querySelector(selector);
  if (!first) throw new Error("Keine Nachrichten gefunden. Öffne einen Chat und warte, bis er geladen ist.");
  let scroller = first.parentElement;
  while (scroller && !(scroller.scrollHeight > scroller.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(scroller).overflowY))) scroller = scroller.parentElement;
  scroller ||= document.scrollingElement;
  if (!scroller) throw new Error("Der Chatverlauf konnte nicht gescrollt werden.");
  const start = scroller.scrollTop;
  const entries = new Map();
  let order = [];
  function collect() {
    const visible = [];
    for (const node of document.querySelectorAll(selector)) {
      const role = node.getAttribute("data-message-author-role") || node.getAttribute("data-chatgpt-search-unit-key")?.split(":").pop();
      const id = node.getAttribute("data-message-id") || node.getAttribute("data-chatgpt-search-message-ids")?.trim().split(/\s+/)[0] || node.closest("[data-turn-id]")?.getAttribute("data-turn-id");
      if (!id) throw new Error("Nachrichten können nicht eindeutig erkannt werden. Die Oberfläche von ChatGPT hat sich möglicherweise geändert.");
      const content = node.querySelector("[data-user-message-bubble], [data-chatgpt-selection-message-id]") || node;
      const text = content.innerText.trim();
      const media = node.querySelector("img, video, audio, [data-testid*='attachment'], [data-testid*='file']") ? "\n[Medium oder Anhang: Datei nicht im Export enthalten]" : "";
      if (!text && !media) continue;
      entries.set(id, `${role === "user" ? "Du" : "ChatGPT"}:\n${text}${media}`);
      visible.push(id);
    }
    if (!order.length) { order = [...visible]; return; }
    if (visible.length && !visible.some(id => order.includes(id))) throw new Error("Der Nachrichtenverlauf konnte nicht lückenlos erfasst werden.");
    // Existing overlap anchors each newly loaded block in chronological order.
    for (let i = visible.length - 1; i >= 0; i--) {
      const id = visible[i];
      if (order.includes(id)) continue;
      const next = visible.slice(i + 1).find(item => order.includes(item));
      if (next) order.splice(order.indexOf(next), 0, id); else order.push(id);
    }
  }
  try {
    // Start at the latest message even if the user opened the chat midway.
    scroller.scrollTop = scroller.scrollHeight;
    await pause(1200);
    scroller.scrollTop = scroller.scrollHeight;
    await pause(500);
    collect();
    let steps = 0;
    let topChecks = 0;
    let loadingAtTop = 0;
    let lastProgress = 0;
    let stalledSince = null;
    while (topChecks < 3) {
      if (cancelled) throw new Error("Export abgebrochen.");
      if (++steps > 3000) throw new Error("Der Anfang des Chats wurde nicht erreicht.");
      const before = scroller.scrollTop;
      scroller.scrollTop = Math.max(0, before - Math.max(100, scroller.clientHeight * 0.8));
      await pause(before <= 1 ? 1000 : 120);
      collect();
      const loading = !!document.querySelector("[data-loading-indicator]");
      if (Date.now() - lastProgress > 500) {
        status.textContent = `${order.length} Nachrichten erfasst. ${scroller.scrollTop <= 1 && loading ? "Ältere Nachrichten werden geladen …" : "Der Verlauf wird nach oben durchsucht …"}`;
        lastProgress = Date.now();
      }
      if (scroller.scrollTop <= 1 && loading) {
        if (++loadingAtTop > 30) throw new Error("Ältere Nachrichten wurden nicht vollständig geladen. Bitte später erneut versuchen.");
      } else loadingAtTop = 0;
      if (scroller.scrollTop <= 1 && !loading) topChecks++; else topChecks = 0;
      if (scroller.scrollTop >= before && scroller.scrollTop > 1 && !loading) {
        stalledSince ??= Date.now();
        if (Date.now() - stalledSince > 10000) throw new Error("Der Chat hat sich 10 Sekunden lang nicht weiterbewegt. Bitte erneut versuchen.");
        await pause(300);
      } else stalledSince = null;
    }
    await pause(1000);
    collect();
    if (cancelled) throw new Error("Export abgebrochen.");
    if (!order.length) throw new Error("Keine lesbaren Nachrichten gefunden.");
    const title = document.title.replace(/\s*[-|–]\s*ChatGPT\s*$/i, "").trim() || "ChatGPT-Chat";
    const filename = title.replace(/[\\/:*?"<>|\x00-\x1f]/g, "_").slice(0, 100) + ".txt";
    const text = `${title}\n\n${order.map(id => entries.get(id)).join("\n\n---\n\n")}\n`;
    const blobUrl = URL.createObjectURL(new Blob([text], {type: "text/plain;charset=utf-8"}));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    status.textContent = `${order.length} Nachrichten erfasst. Download „${filename}“ gestartet. Prüfe die Firefox-Downloads.`;
  } finally { scroller.scrollTop = start; }
  } catch (error) {
    status.textContent = `Export beendet: ${error.message || error} Keine Datei wurde gespeichert.`;
  } finally {
    button.disabled = false;
    button.dataset.done = "true";
    button.textContent = "Schließen";
  }
})()
