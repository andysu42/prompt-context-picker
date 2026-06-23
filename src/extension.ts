import * as vscode from "vscode";
import { getWorkspaceFiles } from "./fileIndex";
import { registerCompletionProvider } from "./completionProvider";
import { registerInsertCommand } from "./quickPick";
import { CONFIG_SECTION } from "./config";
import { RecentFiles } from "./recentFiles";

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

/** Debounce timer used to coalesce bursty index-refresh triggers. */
let refreshTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Schedules a debounced index rebuild. Coalesces bursts of file-system or
 * configuration events (e.g. branch switches, bulk file operations) into a
 * single refresh.
 */
function scheduleRefresh(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  refreshTimer = setTimeout(() => {
    refreshTimer = undefined;
    void refreshFileIndex();
  }, 300);
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
  // Phase 6: rank recently used files first.
  const recent = new RecentFiles(context.workspaceState);
  registerCompletionProvider(context, ensureFileIndex, recent);

  // Phase 6: command-driven QuickPick alternative to the inline `@` completion.
  registerInsertCommand(context, ensureFileIndex, recent);

  // Phase 6: keep the index fresh as files and settings change.
  const watcher = vscode.workspace.createFileSystemWatcher("**/*");
  watcher.onDidCreate(scheduleRefresh);
  watcher.onDidDelete(scheduleRefresh);
  // Content changes (onDidChange) don't affect the set of paths, so ignore them.

  context.subscriptions.push(
    watcher,
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(CONFIG_SECTION)) {
        scheduleRefresh();
      }
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(scheduleRefresh),
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
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = undefined;
  }
  fileIndex = [];
}
