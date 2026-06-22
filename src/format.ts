/**
 * Builds the text inserted for a selected file by applying the configured
 * insert format. Supported `${...}` variables (all derived from the
 * workspace-relative path):
 *
 * - `${path}`      full workspace-relative path, e.g. `src/components/Button.vue`
 * - `${dir}`       directory portion, e.g. `src/components` (empty at root)
 * - `${name}`      file name with extension, e.g. `Button.vue`
 * - `${nameNoExt}` file name without extension, e.g. `Button`
 * - `${ext}`       extension including the dot, e.g. `.vue` (empty if none)
 *
 * Unknown variables are left untouched.
 */
export function formatInsertText(insertFormat: string, relativePath: string): string {
  const path = relativePath.replace(/\\/g, "/");
  const slash = path.lastIndexOf("/");
  const dir = slash === -1 ? "" : path.slice(0, slash);
  const name = slash === -1 ? path : path.slice(slash + 1);
  const dot = name.lastIndexOf(".");
  const ext = dot <= 0 ? "" : name.slice(dot);
  const nameNoExt = ext ? name.slice(0, -ext.length) : name;

  const vars: Record<string, string> = { path, dir, name, nameNoExt, ext };

  return insertFormat.replace(/\$\{(\w+)\}/g, (match, key: string) =>
    key in vars ? vars[key] : match,
  );
}
