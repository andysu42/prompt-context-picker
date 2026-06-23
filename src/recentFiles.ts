import * as vscode from "vscode";

/** Workspace-state key under which the recent file list is stored. */
const STATE_KEY = "promptContextPicker.recentFiles";

/** Maximum number of recently used files to remember. */
const MAX_RECENT = 10;

/**
 * Tracks the most recently inserted file references, persisted per workspace.
 *
 * Used to surface frequently referenced files at the top of the `@` suggestion
 * list (most-recent first).
 */
export class RecentFiles {
  constructor(private readonly memento: vscode.Memento) {}

  /** Returns recent paths, most-recent first. */
  get(): string[] {
    return this.memento.get<string[]>(STATE_KEY, []);
  }

  /** Records `path` as the most recently used, de-duplicating and capping. */
  add(path: string): Thenable<void> {
    const next = [path, ...this.get().filter((p) => p !== path)].slice(
      0,
      MAX_RECENT,
    );
    return this.memento.update(STATE_KEY, next);
  }
}
