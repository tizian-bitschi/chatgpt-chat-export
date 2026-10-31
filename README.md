# ChatGPT Chat Export for Firefox

A Firefox extension that saves the text messages from the open ChatGPT conversation to a local TXT file.

The extension scrolls through the conversation and displays its progress on the page. Keep the ChatGPT tab open and in the foreground until the export finishes. You can cancel the export from the progress panel. The file is saved to your Firefox downloads only after the export completes. The extension does not send chat data to a server.

## Install for testing

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Select **Load Temporary Add-on** and choose `manifest.json` from this repository.
3. Open a conversation on [ChatGPT](https://chatgpt.com) and wait for it to load.
4. Select the extension icon, then choose **Export starten**. The extension interface is in German.

Firefox removes the temporary installation when it closes. Permanent installation requires an extension signed by Mozilla.

## Limitations

The export contains text from the visible conversation branch. Images, audio, video, and attachments are not embedded; detected media are marked in the text. Formatting, tables, equations, citations, and links are exported as displayed text and may look different. Other response variants and hidden content are not included.

The extension depends on ChatGPT's page structure, which can change. Check important exports for completeness. The export stops without saving if it cannot reach the beginning of the conversation. A complete end-to-end Firefox test has not yet been performed.

For a broader account export that includes additional account data, OpenAI provides its own [data export](https://help.openai.com/en/articles/7260999-exporting-your-chatgpt-history-and-data) under Settings → Data Controls.

## License

[MIT](LICENSE)
