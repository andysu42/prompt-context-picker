import * as vscode from "vscode";
import { getConfig } from "./config";

/**
 * Builds a glob exclude pattern from a list of glob patterns.
 *
 * `vscode.workspace.findFiles` accepts a single exclude `GlobPattern`, so the
 * configured patterns are combined using brace expansion: `{a,b,c}`.
 * Returns `undefined` when there is nothing to exclude.
 */
function buildExcludePattern(exclude: string[]): vscode.GlobPattern | undefined {
  if (exclude.length === 0) {
    return undefined;
  }
  if (exclude.length === 1) {
    return exclude[0];
  }
  return `{${exclude.join(",")}}`;
}

/**
 * Retrieves workspace files as workspace-relative paths.
 *
 * - Applies the configured exclude rules (node_modules, dist, build, ...).
 * - Limits the number of results to avoid performance issues on large repos.
 * - Returns an empty list when no workspace folder is open.
 *
 * Paths use forward slashes and are relative to the workspace root, e.g.
 * `src/components/UserCard.vue`.
 */
export async function getWorkspaceFiles(): Promise<string[]> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return [];
  }

  const { exclude, maxResults } = getConfig();
  const excludePattern = buildExcludePattern(exclude);

  const uris = await vscode.workspace.findFiles("**/*", excludePattern, maxResults);

  const relativePaths = uris.map((uri) => toRelativePath(uri));

  // De-duplicate (possible across multi-root workspaces) and sort for a stable
  // suggestion order.
  return Array.from(new Set(relativePaths)).sort((a, b) => a.localeCompare(b));
}

/**
 * Converts an absolute file URI to a workspace-relative path using forward
 * slashes. Falls back to the full path when the URI is outside the workspace.
 */
export function toRelativePath(uri: vscode.Uri): string {
  // `asRelativePath` with includeWorkspaceFolder=false yields a path relative
  // to the containing workspace folder.
  return vscode.workspace.asRelativePath(uri, false).replace(/\\/g, "/");
}
