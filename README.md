# RelayDesk

A multi-tenant helpdesk. Teams create workspaces, log customer conversations, and reply to them from a shared queue.

Built with npm workspaces: an Express API, a React web app, and shared TypeScript contracts. Workspaces, members and conversations live in PostgreSQL; a conversation's messages live in MongoDB.

## Start here

Humans and agents read the same instructions, so each lives in one place:

| You want to                                  | Read                                                                         |
|----------------------------------------------|------------------------------------------------------------------------------|
| Run RelayDesk locally                        | [`.claude/skills/local-setup/SKILL.md`](.claude/skills/local-setup/SKILL.md) |
| Learn the layout, commands and conventions   | [`CLAUDE.md`](CLAUDE.md)                                                     |
| See the conventions for one part of the code | [`.claude/rules/`](.claude/rules)                                            |
| Follow a recurring procedure                 | [`.claude/skills/`](.claude/skills)                                          |
| Open a pull request                          | [`.github/pull_request_template.md`](.github/pull_request_template.md)       |
| Use a coding agent other than Claude Code    | [`AGENTS.md`](AGENTS.md)                                                     |
