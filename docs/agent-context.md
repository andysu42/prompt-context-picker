# Agent Context

## Project Overview

This project is a VS Code Extension designed to assist vibe coding workflows.

The extension allows users to type `@` inside any editable file in VS Code and select a file from the current workspace.

After the user selects a file, the extension inserts a workspace-relative file reference.

Example:

```txt
@src/components/UserCard.vue
```

## Main Goal

The goal is to let users prepare prompts/specs inside VS Code while still being able to quickly reference project files, similar to the `@file` feature found in AI agent chat interfaces.

## Important Product Clarification

This extension is not an AI coding agent.

It should not call Codex, Claude, OpenAI, Anthropic, or any LLM API.

It should not execute coding tasks.

It should not attempt to read or modify files using AI.

Its purpose is only to help users prepare better prompts/specs by quickly inserting project file references.

## Expected User Flow

1. User opens VS Code.
2. User opens a project folder.
3. User opens any editable file.
4. User types `@`.
5. The extension shows file suggestions from the current workspace.
6. User continues typing to filter the suggestions.
7. User selects a file.
8. The extension inserts a reference like:

```txt
@src/stores/user.ts
```

9. User continues writing the prompt/spec.
10. User copies the final prompt/spec into Codex, Claude, Cursor, or another AI coding agent.

## MVP Behavior

The MVP should implement:

1. Trigger file suggestions when the user types `@`.
2. Search files from the current VS Code workspace.
3. Exclude irrelevant folders and generated files.
4. Insert the selected file as a relative path with an `@` prefix.
5. Work in arbitrary editable files.

## Supported File Types

The extension should work in normal editable files, including but not limited to:

- `.md`
- `.txt`
- `.vue`
- `.ts`
- `.js`
- `.json`
- `.tsx`
- `.jsx`
- `.css`
- `.scss`
- `.html`

The extension should not be limited to Markdown files.

## Recommended Technical Approach

Use the VS Code Extension API with TypeScript.

For the MVP, use `CompletionItemProvider` with `@` as the trigger character.

Do not build a Webview for the MVP.

Do not build a custom sidebar for the MVP.

Do not build a custom chat interface for the MVP.

## Suggested Implementation Concept

When the user types `@`, the extension should:

1. Detect the `@` trigger.
2. Search or retrieve cached workspace files.
3. Convert absolute file URIs to workspace-relative paths.
4. Create completion items.
5. Insert the selected item using the configured insert format.

Default insert format:

```txt
@${path}
```

Example result:

```txt
@src/components/Button.vue
```

## Default Exclude Rules

The file search should exclude common dependency, build, and system folders:

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

The implementation may also exclude lock files or large generated files if necessary.

## Suggested Settings

The extension should eventually support these settings:

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

## Important Constraints

The implementation should stay simple for the first version.

Avoid overengineering.

Avoid implementing future features before the MVP works.

Avoid adding AI behavior.

Avoid relying on a specific AI agent's private behavior.

The extension should only insert text into the editor.

## Future Ideas

The following ideas are not part of the MVP, but may be considered later:

- Support custom insert formats.
- Support expanding `@file` references into full file contents.
- Support copying the current prompt with all referenced file contents.
- Support recently used files ranking.
- Support fuzzy search.
- Support QuickPick UI.
- Support a command such as `Prompt Context Picker: Insert File Reference`.
- Support context bundle generation.
- Support parsing all `@file` references in the current document.
