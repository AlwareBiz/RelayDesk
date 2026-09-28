# Decision records

Each file records one decision that later work must follow, and why. Issues link the records that apply to them, and agents read them before planning.

## When to write one

Write a record when a choice would be easy to undo by accident in a later change:
- a name for a concept, especially when another word was rejected;
- a data model, a store, or who owns a piece of data;
- a process that every contributor follows.

A choice that the code alone makes obvious does not need a record.

## Format

Name the file `NNNN-short-title.md`, with the next free four-digit number. Use these sections:

- **Status:** `Accepted`, or `Superseded by NNNN`.
- **Date:** when it was accepted, as `YYYY-MM-DD`.
- **Context:** the problem and the facts that forced a choice.
- **Decision:** what was decided, as rules someone can follow.
- **Rejected options:** each option considered and why it lost.
- **Consequences:** what changes because of it, including the costs.

Never rewrite an accepted record. When a decision changes, write a new record and set the old one's status to `Superseded by NNNN`.
