# Product Brief

## Project Name

Prompt Context Picker

> The project name is temporary and can be changed later.

## Repository / Package Name

prompt-context-picker

## Product Summary

Prompt Context Picker is a VS Code Extension that helps developers prepare prompts and specs for AI coding agents.

The extension allows users to type `@` in any editable file inside VS Code, search files from the current workspace, and insert a workspace-relative file reference.

Example inserted output:

```txt
@src/components/UserCard.vue
```

## Problem

When using AI coding agents such as Codex, Claude Code, Cursor, or similar tools, developers often need to reference project files as context.

However, the `@file` selection experience is usually limited to the agent chat interface or CLI.

This creates a workflow problem:

1. The user wants to prepare a high-quality prompt or spec before sending it to an AI agent.
2. The user opens a normal file in VS Code, such as `prompt.md`, `spec.md`, `todo.md`, `.vue`, `.ts`, or `.js`.
3. The user wants to reference project files while writing.
4. The user cannot use the same `@` file selection experience outside the agent interface.

Prompt Context Picker solves this by bringing an `@` workspace-file picker into normal VS Code editing.

## Target User

The primary target users are developers who:

- Use AI coding agents for vibe coding.
- Prefer to write prompts/specs before sending them to an agent.
- Work inside VS Code.
- Need to reference existing project files frequently.
- Want to prepare structured agent instructions in normal project files.

## Core Use Case

The user opens any editable file in VS Code and writes a prompt/spec such as:

```md
Please refactor the user profile display logic.

Reference these files:

@src/components/UserCard.vue
@src/stores/user.ts
@src/api/user.ts
```

The user should be able to insert those file references by typing `@` and selecting files from a suggestion list.

## Core Value

Prompt Context Picker helps users write better prompts/specs for AI coding agents by making it easier to reference project files while staying inside VS Code.

The product does not try to replace AI coding agents.

Instead, it supports the preparation stage before sending instructions to an agent.

## MVP Scope

The MVP should focus on one core feature:

> In any editable VS Code file, typing `@` should show workspace file suggestions. Selecting a file should insert a relative file reference.

## Non-Goals for MVP

The MVP should not include:

- AI API integration
- Codex / Claude / OpenAI / Anthropic integration
- Agent execution
- Webview UI
- Sidebar UI
- Prompt history management
- File content injection
- Complex project indexing
- Semantic search
- Embedding search
- Multi-agent workflow management

## Future Opportunities

Possible future features include:

- Custom insert formats
- Expanding selected file references into full file contents
- Copying a prompt with all referenced file contents included
- Recently used file ranking
- Fuzzy search
- QuickPick-based file picker
- Dedicated prompt/spec file format
- Context bundle generation
- Integration with selected coding agents
