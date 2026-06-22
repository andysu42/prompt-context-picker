import * as vscode from "vscode";
import { getConfig } from "./config";
import { formatInsertText } from "./format";
import { RecentFiles } from "./recentFiles";

/** Command that opens a QuickPick to insert a file reference at the cursor. */
export const INSERT_COMMAND = "promptContextPicker.insertFileReference";

/**
 * Registers a command that lets the user pick a workspace file from a QuickPick
 * (with built-in fuzzy filtering) and inserts the formatted reference at the
 * active editor's cursor(s). Recently used files are listed first.
 *
 * This is the command-driven alternative to the inline `@` completion.
 */
export function registerInsertCommand(
  context: vscode.ExtensionContext,
  getFiles: () => Promise<string[]>,
  recent: RecentFiles,
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(INSERT_COMMAND, async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage(
          "Prompt Context Picker: open a file to insert a reference.",
        );
        return;
      }

      const files = await getFiles();
      if (files.length === 0) {
        vscode.window.showInformationMessage(
          "Prompt Context Picker: no workspace files found.",
        );
        return;
      }

      // Recently used files first (in recent order), then the rest.
      const fileSet = new Set(files);
      const recentList = recent.get().filter((p) => fileSet.has(p));
      const recentSet = new Set(recentList);
      const ordered = [
        ...recentList,
        ...files.filter((p) => !recentSet.has(p)),
      ];

      const items: vscode.QuickPickItem[] = ordered.map((p) => ({
        label: p,
        description: recentSet.has(p) ? "recent" : undefined,
      }));

      const picked = await vscode.window.showQuickPick(items, {
        placeHolder: "Select a workspace file to insert as a reference",
      });
      if (!picked) {
        return;
      }

      const { insertFormat } = getConfig();
      const text = formatInsertText(insertFormat, picked.label);

      await editor.edit((builder) => {
        for (const selection of editor.selections) {
          builder.replace(selection, text);
        }
      });

      void recent.add(picked.label);
    }),
  );
}
