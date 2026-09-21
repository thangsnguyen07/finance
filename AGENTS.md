# AI Agent Guidelines (AGENTS.md)

This file contains operating instructions for AI Agents working in this repository.

---

## Git Workflow & Human-in-the-Loop Rules

> **CRITICAL RULE**: The AI Agent must **never** autonomously create branches, modify files, or make commits without prior maintainer approval. The agent **only suggests** the planned work; the maintainer makes the final decision.

### 1. Mandatory Proposal Flow (Before Any Code or Document Change)
Before running any write command or switching branches, the agent must propose:
- **Target Branch Name**: `<type>/<issue-number>-<short-slug>` (e.g. `feat/3-relational-schema`, `docs/git-rules`). Lowercase kebab-case, no `#` symbol.
- **Scope of Work**: Precise files to be created, modified, or deleted.
- **Draft Commit Message**: Formatted according to Conventional Commits (e.g. `feat(account): add snapshot balance (#3)`).

### 2. Hard Stop Gate
The agent **MUST STOP** and await explicit confirmation from the maintainer before running `git checkout -b` or editing files.

### 3. Execution & Local Commit
Once approved, the agent performs the work, runs tests/lints, and creates a **local commit**.

### 4. Push Approval Gate
The agent **never** executes `git push` autonomously. It must request explicit confirmation before pushing to the remote repository.

---

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical five-role triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (`CONTEXT.md` at root, ADRs in `docs/adr/`). See `docs/agents/domain.md`.
