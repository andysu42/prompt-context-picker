import * as vscode from "vscode";
import { getWorkspaceFiles } from "./fileIndex";
import { registerCompletionProvider } from "./completionProvider";

/**
 * Cached list of workspace-relative file paths.
 *
 * Phase 2 builds the index on activation and exposes a refresh command. The
 * completion provider (Phase 3) will consume this cache.
 */
let fileIndex: string[] = [];

/**
 * Rebuilds the workspace file index and updates the cache.
 */
async function refreshFileIndex(): Promise<string[]> {
  fileIndex = await getWorkspaceFiles();
  return fileIndex;
}

/** Returns the current cached file index. */
export function getFileIndex(): string[] {
  return fileIndex;
}

/**
 * Returns the cached file index, building it on first use if the initial
 * background build has not finished yet.
 */
async function ensureFileIndex(): Promise<string[]> {
  if (fileIndex.length === 0) {
    return refreshFileIndex();
  }
  return fileIndex;
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // Build the initial index. Run in the background so activation stays fast.
  void refreshFileIndex();

  // Phase 3: suggest workspace files when the user types `@`.
  registerCompletionProvider(context, ensureFileIndex);

  context.subscriptions.push(
    vscode.commands.registerCommand("promptContextPicker.refreshFileIndex", async () => {
      const files = await refreshFileIndex();
      vscode.window.showInformationMessage(
        `Prompt Context Picker: indexed ${files.length} workspace file(s).`,
      );
    }),
    vscode.commands.registerCommand("promptContextPicker.showFileIndexCount", () => {
      vscode.window.showInformationMessage(
        `Prompt Context Picker: ${fileIndex.length} file(s) currently in the index.`,
      );
    }),
  );
}

export function deactivate(): void {
  fileIndex = [];
}
