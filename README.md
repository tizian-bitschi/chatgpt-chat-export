# ChatGPT Chat Export for Firefox

A Firefox extension that saves the text messages from the open ChatGPT conversation to a local TXT file.

The extension scrolls through the conversation and displays its progress on the page. Keep the ChatGPT tab open and in the foreground until the export finishes. You can cancel the export from the progress panel. The file is saved to your Firefox downloads only after the export completes. The extension does not send chat data to a server.

## Install

1. Download the signed XPI from the [latest release](https://github.com/tizian-bitschi/chatgpt-chat-export/releases/latest).
2. In Firefox, open `about:addons`, select the gear icon, and choose **Install Add-on From File**.
3. Select the downloaded XPI and confirm the installation.

The extension is signed by Mozilla for self-distribution and is not listed on Mozilla Add-ons. It requires Firefox 140 or later on desktop.

To test the source temporarily:

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Select **Load Temporary Add-on** and choose `extension/manifest.json` from this repository.
3. Open a conversation on [ChatGPT](https://chatgpt.com) and wait for it to load.
4. Select the extension icon, then choose **Export starten**. The extension interface is in German.

Firefox removes the temporary installation when it closes.

## Build and sign

Install Node.js and run:

```sh
npm ci
npm run lint
npm run build
```

The ZIP in `web-ext-artifacts/` is an unsigned submission package, not a permanently installable extension. To obtain a signed XPI for self-distribution, create [Mozilla Add-ons API credentials](https://addons.mozilla.org/developers/addon/api/key/) and set `WEB_EXT_API_KEY` and `WEB_EXT_API_SECRET` as environment variables in your shell. Do not commit or share these credentials. Then run:

```sh
npm run sign
```

Mozilla validates the submission and returns the signed XPI in `web-ext-artifacts/` if it approves it. See [Mozilla's signing guide](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#sign-your-extension-for-self-distribution). The installation flow has not yet been tested end to end.

## Limitations

The export contains text from the visible conversation branch. Images, audio, video, and attachments are not embedded; detected media are marked in the text. Formatting, tables, equations, citations, and links are exported as displayed text and may look different. Other response variants and hidden content are not included.

The extension depends on ChatGPT's page structure, which can change. Check important exports for completeness. The export stops without saving if it cannot reach the beginning of the conversation. A complete end-to-end Firefox test has not yet been performed.

For a broader account export that includes additional account data, OpenAI provides its own [data export](https://help.openai.com/en/articles/7260999-exporting-your-chatgpt-history-and-data) under Settings → Data Controls.

## License

[MIT](LICENSE)
