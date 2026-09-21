# Financial Management Platform (Finance)

> A modular, testable financial management system designed for robust financial processing, automated testing, and seamless human-AI agent collaboration.

---

## 1. Project Overview

The **finance** repository provides capabilities for calculation engines, transaction management, expense tracking, and financial forecasting. The codebase adheres to modular architecture principles, comprehensive technical documentation in English, and optimized workflows for AI agent-assisted engineering.

---

## 2. AI Collaboration & Git Workflow

- **Agent Instructions**: Read `AGENTS.md` before making code or architectural modifications.
- **Git Conventions**: Review `docs/GIT_CONVENTIONS.md` for branch naming, Conventional Commits format, and mandatory approval gates.
- **Domain Language**: Review `CONTEXT.md` for domain terminology and data models.

---

## 3. Directory Structure

```text
finance/
├── .agents/                    # Tooling and engineering skills for AI agents
├── AGENTS.md                   # Core agent guidelines & Git workflow rules
├── README.md                   # Project overview (this file)
├── CONTEXT.md                  # Ubiquitous language & core domain model
└── docs/                       # Project documentation repository
    ├── GIT_CONVENTIONS.md      # Branch naming, commit message & agent workflow rules
    ├── specs/                  # Feature specifications and requirements
    ├── adr/                    # Architecture Decision Records
    ├── guides/                 # Technical and runbook guides
    └── agents/                 # Issue tracker, triage labels & domain docs configuration
```

---

## 4. Git Approval Gate

Every AI Agent operating in this repo adheres to a strict **Propose-First** gate:
1. Agent proposes: Branch name (`<type>/<issue>-<slug>`), Scope of work, and Draft commit message.
2. Maintainer reviews and approves.
3. Agent executes, runs tests, and creates a local commit.
4. Agent asks for confirmation before executing `git push`.
