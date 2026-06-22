# Decision Log

## 2026-06-22 — Project Direction

### Decision

Build a VS Code Extension that allows users to type `@` in any editable file and select files from the current workspace.

### Reason

The user wants to prepare prompts/specs before sending them to AI coding agents.

Current AI agent tools often provide `@file` selection only inside their own chat interface or CLI. This project brings that convenience into normal VS Code editing.

### Status

Accepted.

---

## 2026-06-22 — Project Name

### Decision

Use `Prompt Context Picker` as the project name for now.

The suggested repository/package slug is:

```txt
prompt-context-picker

---

## 2026-06-22 — MVP Should Focus on File Reference Insertion

### Decision

The MVP should only insert file references, such as:

```txt
@src/components/UserCard.vue
```

It should not inject file contents or execute AI tasks.

### Reason

The smallest useful version is a fast file reference picker.

Adding file content expansion, AI execution, or agent integration would increase complexity and distract from the core workflow problem.

### Status

Accepted.

---

## 2026-06-22 — Use VS Code Extension as Initial Product Form

### Decision

Build the first version as a VS Code Extension.

### Reason

The desired behavior happens inside VS Code while editing normal project files.

A VS Code Extension is the most direct way to support typing `@` in arbitrary files and inserting workspace-relative paths.

### Status

Accepted.

---

## 2026-06-22 — Use CompletionItemProvider for MVP

### Decision

Use VS Code's `CompletionItemProvider` for the first implementation.

The provider should trigger on the `@` character.

### Reason

CompletionItemProvider provides a native inline editing experience and matches the user's desired behavior: typing `@` directly in the editor should show file suggestions.

It is simpler and more suitable for MVP than a Webview, sidebar, or custom UI.

### Rejected Alternatives

- Webview UI
- Sidebar UI
- Custom floating picker
- AI chat interface
- Agent integration

### Status

Accepted.

---

## 2026-06-22 — QuickPick Is Future Enhancement, Not MVP

### Decision

Do not use QuickPick as the primary MVP interaction.

QuickPick may be added later as a command-based alternative.

### Reason

QuickPick is useful for command-style selection, but the user's desired interaction is closer to inline typing completion after entering `@`.

### Status

Accepted.

---

## 2026-06-22 — No AI API Integration in MVP

### Decision

Do not integrate OpenAI, Anthropic, Codex, Claude, Cursor, or any other AI service in the MVP.

### Reason

The product is a context reference helper, not an AI agent.

The purpose is to help users prepare prompts/specs before sending them to agents.

### Status

Accepted.

---

## 2026-06-22 — Maintain Project Knowledge in Repo Documents

### Decision

Maintain project knowledge in Markdown documents inside the repo:

```txt
docs/product-brief.md
docs/agent-context.md
docs/implementation-tasks.md
docs/decision-log.md
```

### Reason

The user wants to hand off the project to Codex or Claude for implementation.

Relying on chat memory is fragile. Repo documents provide stable context that coding agents can read directly.

### Status

Accepted.
