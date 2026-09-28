# 0002: A customer's request is a conversation, not a ticket

- **Status:** Accepted
- **Date:** 2026-09-28

## Context

RelayDesk called a customer's request a "ticket". Our issue tracker also calls its work items tickets, so plans, issues and reviews about "tickets" were ambiguous. The docs also used "conversation" for a ticket's message thread, so renaming without a decision would have given that word two meanings.

## Decision

1. A customer's request is a **conversation**: PostgreSQL table `conversation`, enums `conversation_status` and `conversation_priority`, counter `workspace.conversation_counter`, UI text "conversation" (es: "conversación").
2. A message in it is a **conversation message**: MongoDB collection `conversation_message`, linked by `conversation_id`.
3. "Conversation thread" is not a term. Say "a conversation's messages".
4. "Ticket" means a work item in the issue tracker and never names anything in the product.
5. Renames of stored names run as expand → migrate → contract: compatibility aliases for the old names are added in one change and removed in a later one, and the old data is dropped only after a check shows it has been copied.

## Rejected options

- **Keep "ticket".** It keeps the ambiguity with the tracker.
- **Request.** It collides with HTTP requests (`req`) in the server code.
- **Case.** It collides with `case` in `switch` statements and reads as legal or CRM jargon.
- **Thread.** It names only the messages, not the status, priority and assignee.
- **Rename stored names in place with a short downtime.** It breaks running code, and a MongoDB collection rename can silently split messages when old code creates the old collection again on insert.

## Consequences

- The rename spans several pull requests and a period where aliases exist under the old names.
- Applied migrations, merged pull requests and git history keep the word "ticket".
