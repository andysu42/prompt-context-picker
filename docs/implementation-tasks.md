# Implementation Tasks

## Phase 1: Project Setup

### Goal

Create the initial VS Code Extension project structure using TypeScript.

### Tasks

- Initialize a VS Code Extension project.
- Use TypeScript.
- Configure `package.json`.
- Configure `tsconfig.json`.
- Create `src/extension.ts`.
- Add extension activation.
- Add a simple command for smoke testing if useful.

### Expected Result

The extension can be launched in the VS Code Extension Development Host.

## Phase 2: Workspace File Index

### Goal

Implement logic to find files in the current workspace.

### Tasks

- Create a file indexing module.
- Use VS Code workspace APIs to find files.
- Return workspace-relative paths.
- Apply default exclude rules.
- Limit the number of results to avoid performance issues.
- Handle the case where no workspace folder is open.

### Suggested Files

```txt
src/fileIndex.ts
src/config.ts
```

### Default Excludes

```txt
**/node_modules/**
**/dist/**
**/build/**
**/.git/**
**/coverage/**
**/.next/**
**/.nuxt/**
**/.output/**
```

### Expected Result

The extension can retrieve a list of project files as relative paths.

Example:

```txt
src/App.vue
src/main.ts
src/components/UserCard.vue
package.json
README.md
```

## Phase 3: Completion Provider

### Goal

Trigger file suggestions when the user types `@`.

### Tasks

- Create a completion provider module.
- Register a `CompletionItemProvider`.
- Use `@` as the trigger character.
- Provide file suggestions from the workspace file index.
- Insert the selected file as `@relative/path`.

### Suggested Files

```txt
src/completionProvider.ts
src/extension.ts
```

### Expected Behavior

When the user types:

```txt
@
```

VS Code shows workspace file suggestions.

When the user selects:

```txt
src/components/UserCard.vue
```

The inserted text should be:

```txt
@src/components/UserCard.vue
```

## Phase 4: Basic Configuration

### Goal

Allow basic user customization.

### Tasks

Add settings for:

- `atContext.exclude`
- `atContext.maxResults`
- `atContext.insertFormat`

### Suggested Defaults

```json
{
  "atContext.exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.git/**",
    "**/coverage/**"
  ],
  "atContext.maxResults": 200,
  "atContext.insertFormat": "@${path}"
}
```

### Expected Result

Users can configure file excludes, max result count, and inserted text format.

## Phase 5: Manual Testing

### Goal

Verify the MVP behavior manually.

### Test Files

Test the extension in:

```txt
README.md
prompt.md
src/App.vue
src/main.ts
package.json
```

### Test Cases

#### Test Case 1: Basic Trigger

1. Open any editable file.
2. Type `@`.
3. Confirm file suggestions appear.

#### Test Case 2: File Selection

1. Type `@`.
2. Select a file from the suggestion list.
3. Confirm the inserted text is `@relative/path`.

#### Test Case 3: Workspace Relative Path

1. Select a nested file.
2. Confirm the inserted path is relative to the workspace root.

#### Test Case 4: Excluded Files

1. Confirm files inside `node_modules`, `dist`, `build`, `.git`, and `coverage` are not suggested.

#### Test Case 5: Arbitrary File Support

1. Try the feature inside `.md`, `.vue`, `.ts`, `.js`, and `.json` files.
2. Confirm the feature is not limited to Markdown.

## Phase 6: Polish After MVP

Only start this phase after the MVP works.

Potential improvements:

- Improve ranking.
- Add fuzzy search.
- Cache file index.
- Refresh cache on file create/delete/rename.
- Add recently used files.
- Add QuickPick command.
- Add more insert formats.
