# ChatGPT Chat-Export für Firefox

Exportiert die Textnachrichten des aktuell geöffneten Chats in eine lokale TXT-Datei. Während des Exports scrollt der Chat automatisch nach oben. Der Fortschritt erscheint direkt auf der Chatseite. Lasse den Chat-Tab bis zum Abschluss geöffnet und im Vordergrund. Die Datei wird erst nach Abschluss im Firefox-Downloadordner gespeichert. Der Export kann auf der Chatseite abgebrochen werden. Keine Chatdaten werden von der Erweiterung an einen Server gesendet.

## Installation zum Testen

1. In Firefox `about:debugging#/runtime/this-firefox` öffnen.
2. „Temporäres Add-on laden“ wählen und in diesem Ordner die Datei `manifest.json` auswählen.
3. Einen Chat auf https://chatgpt.com öffnen und warten, bis er geladen ist.
4. Auf das Erweiterungssymbol und anschließend auf „Export starten“ klicken.

Die temporäre Installation endet beim Schließen von Firefox. Für eine dauerhafte Installation ist eine von Mozilla signierte Erweiterung erforderlich.

## Grenzen

Der Export enthält Text aus dem sichtbaren Gesprächszweig. Bilder, Audio, Video und angehängte Dateien werden nicht eingebettet; erkannte Medien werden markiert. Formatierung, Tabellen, Formeln, Zitate und Links erscheinen als Seitentext und können anders aussehen. Andere Antwortvarianten und ausgeblendete Inhalte sind nicht enthalten. Die Erweiterung nutzt Merkmale der ChatGPT-Oberfläche, die sich ändern können. Prüfe bei wichtigen Chats das Ergebnis auf Vollständigkeit. Wenn der Chat nicht bis zum Anfang scrollen kann, bricht der Export ab.

Für einen umfassenden Kontoexport einschließlich weiterer Kontodaten bietet OpenAI einen eigenen Datenexport unter Einstellungen → Datenkontrollen an: https://help.openai.com/en/articles/7260999-exporting-your-chatgpt-history-and-data
