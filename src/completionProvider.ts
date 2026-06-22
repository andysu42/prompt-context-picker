import * as vscode from "vscode";
import { getConfig } from "./config";

/** Character that triggers workspace-file suggestions. */
export const TRIGGER_CHARACTER = "@";

/**
 * Builds the text inserted for a selected file by applying the configured
 * insert format. `${path}` is replaced with the workspace-relative path.
 */
export function formatInsertText(insertFormat: string, path: string): string {
  return insertFormat.replace(/\$\{path\}/g, path);
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
 */
export function createCompletionProvider(
  getFiles: () => Promise<string[]>,
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

      return files.map((path) => {
        const item = new vscode.CompletionItem(
          path,
          vscode.CompletionItemKind.File,
        );
        item.detail = "Workspace file";
        item.insertText = formatInsertText(insertFormat, path);
        // Include the `@` so VS Code can match the typed `@query` against items.
        item.filterText = TRIGGER_CHARACTER + path;
        item.range = replaceRange;
        return item;
      });
    },
  };
}

/**
 * Registers the `@` completion provider for editable documents (saved files
 * and untitled buffers) across all languages.
 */
export function registerCompletionProvider(
  context: vscode.ExtensionContext,
  getFiles: () => Promise<string[]>,
): void {
  const provider = createCompletionProvider(getFiles);
  context.subscriptions.push(
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
