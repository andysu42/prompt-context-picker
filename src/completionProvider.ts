import * as vscode from "vscode";
import { getConfig } from "./config";
import { formatInsertText } from "./format";
import { RecentFiles } from "./recentFiles";

/** Character that triggers workspace-file suggestions. */
export const TRIGGER_CHARACTER = "@";

/** Command invoked after a suggestion is accepted, to record recent usage. */
export const MARK_RECENT_COMMAND = "promptContextPicker.markRecentlyUsed";

/** Zero-pads a number for lexicographic sorting via `sortText`. */
function pad(n: number): string {
  return n.toString().padStart(6, "0");
}

/**
 * Creates a completion provider that suggests workspace files after `@`.
 *
 * The provider:
 * - Activates only when an `@` precedes the cursor on the current line.
 * - Treats the text after `@` as a filter query (stops if it contains
 *   whitespace, which means the `@` belongs to earlier text).
 * - Replaces `@<query>` with the formatted reference, e.g. `@src/main.ts`.
 *
 * Files are supplied lazily via `getFiles` so the cached index is reused.
 * Recently used files (via `getRecent`) are ranked to the top of the list.
 */
export function createCompletionProvider(
  getFiles: () => Promise<string[]>,
  getRecent: () => string[],
): vscode.CompletionItemProvider {
  return {
    async provideCompletionItems(document, position) {
      const linePrefix = document
        .lineAt(position.line)
        .text.slice(0, position.character);

      const atIndex = linePrefix.lastIndexOf(TRIGGER_CHARACTER);
      if (atIndex === -1) {
        return undefined;
      }

      // Only trigger when `@` begins a token: at line start or after whitespace.
      // This avoids firing inside emails (foo@bar) and similar text.
      const charBefore = atIndex > 0 ? linePrefix[atIndex - 1] : "";
      if (charBefore !== "" && !/\s/.test(charBefore)) {
        return undefined;
      }

      // If the query already contains whitespace, the `@` is stale text.
      const query = linePrefix.slice(atIndex + 1);
      if (/\s/.test(query)) {
        return undefined;
      }

      const files = await getFiles();
      if (files.length === 0) {
        return undefined;
      }

      const { insertFormat } = getConfig();

      // Replace from the `@` up to the cursor so selecting an item swaps the
      // partially typed query for the full formatted reference.
      const replaceRange = new vscode.Range(
        new vscode.Position(position.line, atIndex),
        position,
      );

      // Rank recently used files first (most-recent first), then the rest in
      // their existing (alphabetical) order. With no query typed, `sortText`
      // governs ordering, so recent files surface at the top.
      const recentRank = new Map(getRecent().map((p, i) => [p, i]));

      return files.map((path, i) => {
        const item = new vscode.CompletionItem(
          path,
          vscode.CompletionItemKind.File,
        );
        item.detail = recentRank.has(path) ? "Recent · workspace file" : "Workspace file";
        item.insertText = formatInsertText(insertFormat, path);
        // Include the `@` so VS Code can match the typed `@query` against items.
        item.filterText = TRIGGER_CHARACTER + path;
        item.range = replaceRange;

        const recentIndex = recentRank.get(path);
        item.sortText =
          recentIndex === undefined ? `1_${pad(i)}` : `0_${pad(recentIndex)}`;

        // Record the file as recently used once the suggestion is accepted.
        item.command = {
          command: MARK_RECENT_COMMAND,
          title: "",
          arguments: [path],
        };
        return item;
      });
    },
  };
}

/**
 * Registers the `@` completion provider for editable documents (saved files
 * and untitled buffers) across all languages, plus the command that records a
 * file as recently used when its suggestion is accepted.
 */
export function registerCompletionProvider(
  context: vscode.ExtensionContext,
  getFiles: () => Promise<string[]>,
  recent: RecentFiles,
): void {
  const provider = createCompletionProvider(getFiles, () => recent.get());
  context.subscriptions.push(
    vscode.commands.registerCommand(MARK_RECENT_COMMAND, (path: string) => {
      void recent.add(path);
    }),
    vscode.languages.registerCompletionItemProvider(
      [
        { scheme: "file" },
        { scheme: "untitled" },
      ],
      provider,
      TRIGGER_CHARACTER,
    ),
  );
}
