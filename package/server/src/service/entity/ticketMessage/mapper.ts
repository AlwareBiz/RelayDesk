import type { TicketMessage, TicketMessageDocument } from '@relaydesk/common';

// ********************************************************************************
// == Util ========================================================================
export const toTicketMessage = ({ _id, created_at, ...rest }: TicketMessageDocument): TicketMessage => ({
 ...rest,
 created_at: created_at.toISOString(),
 id: _id,
});
