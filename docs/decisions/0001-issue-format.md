# 0001: Issues state their model, and are written apart from the build

- **Status:** Accepted
- **Date:** 2026-09-28

## Context

Issues in this repository are built by agent sessions that have only the repository and the issue. A goal and a list of criteria tell such a session what to deliver, but not what the concepts are called, where the data comes from, or what the work must not break. The session fills those gaps with guesses, and a wrong name or data flow spreads through the code and is expensive to undo later.

## Decision

1. Every issue follows a form in `.github/ISSUE_TEMPLATE/`: `task.yml` for one pull request, `epic.yml` for work that needs several. Besides goal, context, criteria, scope and verification, every issue states its naming, lifecycle, dependencies and constraints.
2. The forms are the only definition of the format. The `write-issue` skill and the `Issue format` workflow read them; nothing else lists the sections.
3. Issues are written in a discussion between an engineer and an agent that reads the code (`write-issue`). The engineer approves the text before the issue is created.
4. A different session builds each issue (`implement-issue`). It posts a plan on the issue, and an engineer approves the plan before any code is written. Changes to the plan during the build are posted on the issue.
5. Questions and gaps found while building are posted on the issue as `Question:` and `Issue gap:` comments, so they can improve the forms and the skill.
6. The `Issue format` workflow labels an issue `needs-format` when a required section is missing or empty.
7. Changes that need no discussion, such as a typo or a broken link, need no issue.

## Rejected options

- **Goal, criteria and verification only.** It leaves the model of the change implicit, so each session rebuilds it from the code and can rebuild it differently.
- **One session writes the issue and builds it.** The issue is then never read by anyone without the discussion's context, so its gaps go unnoticed.
- **A template in documentation only.** Issues created from the command line skip the form, so nothing would check them.

## Consequences

- Writing an issue takes a discussion instead of a one-line title.
- Changing a form changes the format everywhere at once, including the check.
- Issues created with `gh issue create --body` must use `### <Label>` headings that match the form's labels.
