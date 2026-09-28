---
name: implement-issue
description: Build one GitHub issue end to end, plan first. Posts a plan on the issue, waits for the engineer's approval, then implements it on a branch and opens a pull request that closes the issue. Use when asked to implement, build, fix or work on an issue by number.
---

# Implement an issue

The issue is the brief. Everything you need should be in it, in the records it links, and in this repository. When something is missing, ask on the issue; do not fill the gap with a guess.

## 1. Read
1. Read the issue with its comments: `gh issue view <number> --comments`. If it has a parent epic, read the epic too.
2. Read every record in `docs/decisions/` that the issue or the epic links.
3. Check the blockers in Dependencies: `gh issue view <blocker> --json state`. If one is still open, stop and tell the engineer.
4. If the issue has the `needs-format` label, stop and tell the engineer; it is missing a section.

## 2. Ask when the issue does not answer
When a name, a behavior, a criterion or a limit is ambiguous or missing, post one comment that starts with `Question:` and lists every question, then stop:
```sh
gh issue comment <number> --body-file question.md
```
Ask only what the issue should have answered. Anything the repository answers, find in the repository.

## 3. Plan, then stop
Post the plan as a comment that starts with `## Plan`:
- the files you will add or change, and what changes in each;
- the approach, in the issue's own names;
- for each acceptance criterion, how you will show it is met;
- the risks, and any assumption you had to make, labeled as an assumption.

Then stop and tell the engineer the plan is posted. Write no code until the engineer approves it on the issue. When you resume, read the comments again: the engineer may have changed the plan.

## 4. Build
1. Branch from an up-to-date `main`: `issue-<number>-<short-slug>`.
2. Build only what the issue asks. Leave everything under "Out of scope" alone, even when it is tempting.
3. If the plan must change while you build, post a comment that starts with `Plan change:` and says what changed and why before you continue.
4. Follow `CLAUDE.md` and the rules that load for each file. Run the checks from `CLAUDE.md` before finishing.

## 5. Verify
Run every step of "How to verify" and keep the output. Show each acceptance criterion met: command output, a before/after comparison with `main`, or the text a headless browser reads from the page for UI changes.

If the issue asks for evidence you cannot produce or attach, such as screenshots (`gh` cannot upload images), say so under Testing, give the closest evidence you can, and report it as an issue gap (step 7).

## 6. Open the pull request
Open it with `gh pr create`, following `.github/pull_request_template.md`. The first line is `Closes #<number>`. Put the verification output under Testing, and say which feature flag, if any, the change sits behind and what state the flag must be in to see it.

## 7. Report issue gaps
If the issue was missing something you needed or was wrong about the code, post a comment on the issue that starts with `Issue gap:` and says what was missing. These comments improve `write-issue` and the issue forms.
