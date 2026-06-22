# prompt-context-picker

**Prompt Context Picker** is a VS Code extension that helps you prepare prompts/specs for AI
coding agents. Type `@` in any editable file to search workspace files and insert
a workspace-relative file reference such as `@src/components/UserCard.vue`.

It is **not** an AI agent: it does not call any LLM API, execute tasks, or inject
file contents. It only inserts text to help you reference project files while
writing prompts. See [docs/product-brief.md](docs/product-brief.md) for details.

## Status

Implemented: **Phase 1 (project setup)**, **Phase 2 (workspace file index)**,
**Phase 3 (`@` completion provider)**, **Phase 4 (configuration)**, and part of
**Phase 6 (polish)**. Typing `@` in any editable file suggests workspace files
and inserts a reference like `@src/main.ts`, and the behavior is configurable
via settings.

Phase 6 so far: the file index refreshes automatically on file create/delete/
rename, workspace-folder changes, and settings changes; recently inserted files
are ranked to the top of the suggestion list (per workspace); a
`Prompt Context Picker: Insert File Reference` command offers a QuickPick
(fuzzy-filtered) alternative to the inline `@` trigger; and `insertFormat`
supports multiple variables.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `promptContextPicker.exclude` | common deps/build/system globs | Glob patterns excluded from the file index. |
| `promptContextPicker.maxResults` | `200` | Maximum number of files returned by the index. |
| `promptContextPicker.insertFormat` | `@${path}` | Format for the inserted reference. Variables: `${path}`, `${dir}`, `${name}`, `${nameNoExt}`, `${ext}`. |

## Development

```bash
npm install      # install dev dependencies
npm run compile  # build TypeScript into ./out
npm run watch    # rebuild on change
```

Press **F5** in VS Code to launch the extension in an Extension Development Host.

### Commands

From the Command Palette:

- `Prompt Context Picker: Insert File Reference` — pick a file from a QuickPick and insert its reference at the cursor.
- `Prompt Context Picker: Refresh File Index` — rebuilds the workspace file index and reports the count.
- `Prompt Context Picker: Show Indexed File Count` — shows how many files are currently indexed.

## Project structure

```txt
src/
  extension.ts            # activation, file-index cache + watcher, commands
  fileIndex.ts            # workspace file discovery -> relative paths
  completionProvider.ts   # `@` trigger -> file suggestions -> inserted reference
  quickPick.ts            # "Insert File Reference" QuickPick command
  recentFiles.ts          # per-workspace recently-used tracking
  format.ts               # insertFormat variable substitution
  config.ts               # settings + defaults (exclude / maxResults / insertFormat)
```

## License

MIT
