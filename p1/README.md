# p1 — CLI Todo List

A small command-line todo manager built with plain Node.js. Todos are stored in a local JSON file (`db/data.json`), so state survives between runs. No dependencies, no database, no server.

This is a learning project from the *Fundamentals of Backend* track — the goal is to work through file I/O, JSON persistence, and argument parsing before moving on to HTTP APIs and real databases.

## Requirements

- Node.js 18+ (CommonJS, uses only built-in `fs`)

## Usage

Run from the project root so the relative `db/data.json` path resolves:

```bash
node index.js <command> [args]
```

Or via npm:

```bash
npm start -- <command> [args]
```

### Commands

| Command | Description | Example |
|---|---|---|
| `add <text...>` | Add one or more todos (status `todo`) | `node index.js add "Buy milk" "Walk the dog"` |
| `update <id> <text>` | Replace the description of a todo | `node index.js update 1 "Buy oat milk"` |
| `delete <id>` | Remove a todo by id | `node index.js delete 2` |
| `mark-in-progress <id>` | Set a todo's status to `in-progress` | `node index.js mark-in-progress 1` |
| `mark-done <id>` | Mark a todo as completed | `node index.js mark-done 1` |
| `list` | List todos (falls back to `todo` filter) | `node index.js list` |
| `list todo` | List todos with status `todo` | `node index.js list todo` |
| `list in-progress` | List todos with status `in-progress` | `node index.js list in-progress` |
| `list done` | List todos with status `done` | `node index.js list done` |

Every todo has the shape:

```json
{
  "id": 1,
  "description": "Buy milk",
  "status": "todo",
  "createdAt": "2026-10-27T12:03:54.850Z",
  "updatedAt": "2026-10-27T12:03:54.850Z"
}
```

Statuses: `todo` (default), `in-progress`, `done`.

## How it works

1. On startup `initializeDB()` reads `db/data.json` synchronously and parses it into the in-memory `todoList`.
2. The first CLI argument picks the command; the matching block mutates `todoList`.
3. `writeFile()` serializes the whole list back to `db/data.json` (pretty-printed) after every mutating command.
4. `list` filters the in-memory list and prints matching objects.

Because the entire file is rewritten per command, this is a "load all → mutate → save all" design. That is fine for one user with a handful of todos and becomes a problem the moment there is concurrency — which is exactly the lesson that leads into databases later.

## Project structure

```
p1/
├── index.js        # CLI entry point: commands, read/parse, write/serialize
├── db/data.json    # todos (gitignored state, created on first run)
└── package.json
```

## Known limitations

These are current behaviors, not intended design — worth fixing as the project grows:

- `mark-done` writes the status `"mark-done"` instead of `"done"`, so `list done` returns nothing for items marked done.
- `initializeDB()` mixes `fs.readFileSync` with a callback, so the JSON parse and the "create empty file" path can race; a missing file crashes the process before it can be initialized.
- Ids are `todoList.length + 1`, so deleting a todo and adding a new one produces duplicate ids.
- `add` with no text silently does nothing.
- Every command runs through `if` chains rather than `switch`, and unknown commands exit silently with no usage message.
- No tests (`npm test` is a placeholder).

## Next steps

- Return a non-zero exit code and print usage for unknown/invalid commands.
- Fix the `done` status and derive ids from `max(id) + 1`.
- Add an `--help` flag and colored/formatted table output.
- Extract persistence into a `todoStore` module so it can be swapped for SQLite later.
- Add tests around add/update/delete/mark transitions.
