import * as vscode from "vscode";

/**
 * Configuration namespace used by all extension settings.
 */
export const CONFIG_SECTION = "promptContextPicker";

/**
 * Default folders/files excluded from the workspace file index.
 *
 * These cover common dependency, build, and system directories so the
 * suggestion list only contains files that are useful as prompt context.
 */
export const DEFAULT_EXCLUDE: readonly string[] = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.git/**",
  "**/coverage/**",
  "**/.next/**",
  "**/.nuxt/**",
  "**/.output/**",
];

/** Default maximum number of files returned by the index. */
export const DEFAULT_MAX_RESULTS = 200;

/** Default format used when inserting a selected file reference. */
export const DEFAULT_INSERT_FORMAT = "@${path}";

/**
 * Resolved extension configuration.
 */
export interface AtContextConfig {
  exclude: string[];
  maxResults: number;
  insertFormat: string;
}

/**
 * Reads the current extension configuration, falling back to sensible
 * defaults when a setting is unset or invalid.
 */
export function getConfig(): AtContextConfig {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION);

  const exclude = config.get<string[]>("exclude");
  const maxResults = config.get<number>("maxResults");
  const insertFormat = config.get<string>("insertFormat");

  return {
    exclude: Array.isArray(exclude) && exclude.length > 0 ? exclude : [...DEFAULT_EXCLUDE],
    maxResults:
      typeof maxResults === "number" && maxResults > 0
        ? Math.floor(maxResults)
        : DEFAULT_MAX_RESULTS,
    insertFormat:
      typeof insertFormat === "string" && insertFormat.length > 0
        ? insertFormat
        : DEFAULT_INSERT_FORMAT,
  };
}
