const button = document.getElementById("export");
const status = document.getElementById("status");
button.addEventListener("click", async () => {
  button.disabled = true;
  status.textContent = "Export wird gestartet …";
  try {
    const [tab] = await browser.tabs.query({active: true, currentWindow: true});
    const url = new URL(tab.url);
    if (url.protocol !== "https:" || !["chatgpt.com", "chat.openai.com"].includes(url.hostname)) throw new Error("Bitte einen Chat auf chatgpt.com öffnen.");
    const started = (message, sender) => {
      if (message?.type === "chat-export-started" && sender.tab?.id === tab.id) window.close();
    };
    browser.runtime.onMessage.addListener(started);
    const result = await browser.scripting.executeScript({target: {tabId: tab.id}, files: ["export.js"]});
    browser.runtime.onMessage.removeListener(started);
    if (result[0]?.error) throw new Error(result[0].error.message || String(result[0].error));
  } catch (error) {
    status.textContent = `Export fehlgeschlagen: ${error.message || error}`;
    button.disabled = false;
  }
});
