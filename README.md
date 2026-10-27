# Fundamentals of Backend — Personal Projects

A collection of hands-on projects built while working through backend fundamentals. Each subdirectory is a standalone project with its own `README.md`, `package.json`, and dependencies.

The through-line: start with the raw primitives (files, JSON, process arguments), then keep adding the layers a real backend needs — validation, persistence, HTTP, auth, and tests.

## Projects

| Project | What it is | Stack |
|---|---|---|
| [`p1/`](./p1) | CLI todo list backed by a JSON file — argument parsing, CRUD, and file persistence | Node.js (no dependencies) |

## Conventions

- **One folder per project.** No shared runtime code between projects; they are deliberately independent so each can be read on its own.
- **Node.js projects** are CommonJS (`"type": "commonjs"`) and run with `node` — check each project's README for the exact command.
- **State lives on disk**, not in memory: a process should be able to exit and resume where it left off.
- **Each project documents its own limitations.** A README that only claims what works is hiding the part worth studying. Known broken behavior is listed rather than glossed over.

## Running a project

```bash
cd <project>
npm install        # only if the project has dependencies
node index.js      # or the command listed in that project's README
```

## Roadmap

- `p1` — CLI todos over a JSON file (done)
- Next: move persistence to SQLite, then expose the same domain over HTTP with validation, auth, and tests

## Adding a new project

1. Create the folder and initialize it (`npm init -y`).
2. Add its own `README.md` with purpose, commands, structure, and known limitations.
3. Add a row to the table above.
