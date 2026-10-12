# Financial Management Platform (Finance)

> A modular, testable financial management system designed for robust financial processing, automated testing, and seamless human-AI agent collaboration.

---

## 1. Project Architecture (Decoupled Services)

This repository contains two completely decoupled, standalone services that can be developed and deployed independently:

```text
finance/
├── AGENTS.md                  # Core AI Agent guidelines & workflow rules
├── README.md                  # Project overview (this file)
├── CONTEXT.md                 # Domain ubiquitous language & core data models
├── docker-compose.yml         # Local PostgreSQL 16 database service
├── .oxlintrc.json             # Root OXC (Rust) linter configuration
├── .env.example               # Environment variables template
├── docs/                      # Project documentation (ADRs, Git conventions, Specs)
│
├── frontend/                  # Standalone Next.js 15 Web Application
│   ├── src/app/               # App Router with HeroUI integration
│   ├── package.json           # Independent dependencies & deployment target (Vercel/Netlify)
│   └── tsconfig.json
│
└── backend/                   # Standalone NestJS REST API Service
    ├── src/                   # Modular architecture with TypeORM & Swagger
    ├── package.json           # Independent dependencies & deployment target (Railway/Render/Docker)
    └── tsconfig.json
```

---

## 2. Quick Start

### Start Local PostgreSQL Database

```bash
docker compose up -d
```

### Run Frontend (Next.js 15 + HeroUI)

```bash
cd frontend
pnpm dev
# App running at: http://localhost:3000
```

### Run Backend (NestJS + TypeORM)

```bash
cd backend
pnpm start:dev
# API running at: http://localhost:4000
# Swagger docs: http://localhost:4000/api/docs
```

### Run Linter (OXC)

```bash
pnpm dlx oxlint frontend backend
```

---

## 3. Git Workflow & Approval Gate

AI Agents operating in this repository adhere to a strict **Propose-First** human-in-the-loop gate:

1. Agent proposes planned scope of work and draft commit message.
2. Maintainer reviews and approves.
3. Agent executes, verifies, and commits directly on `main`.
4. Agent asks for confirmation before executing `git push`.
