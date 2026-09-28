---
name: write-issue
description: Turn a need into GitHub issues that another agent session can build without a follow-up conversation, through a discussion with the engineer. Use when asked to write, plan, scope or break down an issue, a feature, a bug fix or an epic.
---

# Write an issue

This is a discussion, not a build. The output is one or more issues that match `.github/ISSUE_TEMPLATE/task.yml` or `epic.yml`. Never write product code in this session; a separate session builds each issue with `implement-issue`.

Skip issues for changes that need no discussion, such as a typo or a broken link; make those changes directly.

## 1. Understand the need
1. Ask the engineer what the need is, who has it, and what they see today. Ask for example data or a reproduction path when the need is a bug.
2. Read the code the change touches and every record in `docs/decisions/` that applies. Quote what exists instead of assuming it.

## 2. Work through the model
Settle each section with the engineer before writing criteria. Ask one topic at a time and propose an answer from the code; do not fill a section with a guess.

- **Naming:** list every entity, workflow and term. Check each name against the code, the dictionaries and `docs/decisions/`. One name per concept, one concept per name. When the need uses a word that means something else in the code, stop and settle it.
- **Lifecycle:** where the data comes from, which store holds it (PostgreSQL or MongoDB), what changes it (API, job, user), who can see it, and when it is removed.
- **Dependencies:** the code, tables, collections, jobs and other issues the work needs. An open issue that must merge first is a blocker.
- **Constraints:** workspace isolation, member roles, limits, compatibility with existing data, and the missing transaction across the two stores.

## 3. Write checkable criteria
- Each acceptance criterion is behavior someone can observe with a command, a request or a UI step, with the expected result.
- Push back on criteria nobody can check. Rewrite "fast" as a measured limit on stated data, and "works well" as the behaviors it stands for. When the engineer cannot say what would make a criterion true, it is not ready.
- "How to verify" gives the steps and data a reviewer uses, including how to show the result: a before/after script when there is no UI, screenshots or a video when there is.

## 4. Size the work
- One task is one pull request that a human can review in one sitting and revert on its own.
- Every task can merge alone without a regression. Work that users must not see until a later task lands sits behind a feature flag, named in the Feature flag section.
- When the work needs more than one pull request, write an epic: the shared model in the epic, then one task per pull request, ordered so each task's blockers come first.
- The engineer decides the size and the risk. Propose a split and say why; do not decide it alone.

## 5. Record decisions
When the discussion settles a choice that later work must follow (a name, a data model, a rejected option), draft a decision record for `docs/decisions/` following its README. Put the draft in the first task's Context and add a criterion that the task commits it.

## 6. Get approval, then create
1. Show the engineer the full text of every issue. Create nothing until they approve it.
2. Write each body with `### <Label>` headings that match the form's field labels exactly, in form order. Do not use `###` headings inside a section.
3. Check each body before creating it:
   ```sh
   npm run -s check:issue-format -- --form task < body.md
   ```
4. Create the issues. An epic comes first; each task is then created as its sub-issue, in build order, with its blockers written as "Blocked by #N" in Dependencies:
   ```sh
   gh issue create --title "<title>" --label epic --body-file epic.md
   gh issue create --title "<title>" --label task --parent <epic number> --body-file task.md
   ```
5. Delete the body files, then give the engineer the issue links.

The `Issue format` workflow labels any issue that is missing a section `needs-format`. When an issue gets that label, fix its body; do not remove the label by hand.
