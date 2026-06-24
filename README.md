# Prompt Context Picker

Type `@` in any file to search your workspace and insert a file reference —
the same `@file` experience you get inside AI coding agents, but right in your
editor while you draft prompts and specs.

```md
Please refactor the user profile display logic.

Reference these files:
@src/components/UserCard.vue
@src/stores/user.ts
@src/api/user.ts
```

Prepare high-quality prompts for **Claude, Copilot, Cursor, Codex** and other
AI coding agents without leaving the file you're writing in — then copy the
finished prompt into your agent of choice.

## Features

- **`@` to reference files** — type `@` in any editable file to get workspace
  file suggestions, then insert a workspace-relative reference like
  `@src/main.ts`.
- **Works everywhere** — Markdown, plain text, and source files alike
  (`.md`, `.txt`, `.ts`, `.tsx`, `.js`, `.vue`, `.json`, `.css`, `.html`, …),
  not just Markdown.
- **Fuzzy QuickPick** — prefer a command? Run **Insert File Reference** to pick
  a file from a fuzzy-filtered list and insert it at the cursor.
- **Recent files first** — files you reference most are surfaced at the top.
- **Always up to date** — the file index refreshes automatically as you add,
  delete, or rename files.
- **Smart excludes** — `node_modules`, `dist`, `build`, `.git`, and other noise
  are filtered out by default.
- **Customizable output** — change the inserted format to match your workflow.

## Usage

1. Open any editable file.
2. Type `@`.
3. Pick a file from the suggestions (keep typing to filter).
4. A reference like `@src/components/UserCard.vue` is inserted.

Or open the Command Palette and run **Prompt Context Picker: Insert File
Reference** to choose a file from a QuickPick.

## Commands

| Command | Description |
| --- | --- |
| `Prompt Context Picker: Insert File Reference` | Pick a file from a QuickPick and insert its reference at the cursor. |
| `Prompt Context Picker: Refresh File Index` | Rebuild the workspace file index. |
| `Prompt Context Picker: Show Indexed File Count` | Show how many files are currently indexed. |

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `promptContextPicker.exclude` | common deps/build/system globs | Glob patterns excluded from the file index. |
| `promptContextPicker.maxResults` | `200` | Maximum number of files returned by the index. |
| `promptContextPicker.insertFormat` | `@${path}` | Format for the inserted reference. |

The inserted format supports these variables (derived from the
workspace-relative path):

| Variable | Example (`src/components/Button.vue`) |
| --- | --- |
| `${path}` | `src/components/Button.vue` |
| `${dir}` | `src/components` |
| `${name}` | `Button.vue` |
| `${nameNoExt}` | `Button` |
| `${ext}` | `.vue` |

For example, set `insertFormat` to `[[${name}]](${path})` to insert Markdown
links instead of `@` references.

## Good to know

Prompt Context Picker is **not** an AI agent. It does not call any LLM, execute
tasks, or read/inject file contents — it only inserts a text reference so you
can reference project files quickly while writing prompts.

## License

[MIT](LICENSE)
