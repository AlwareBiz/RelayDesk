import * as yup from 'yup';

// ********************************************************************************
// == Type ========================================================================
export type TicketMessageAuthorType = 'agent' | 'customer';

/** a message as stored in the MongoDB `ticket_message` collection */
export type TicketMessageDocument = {
 _id: string;
 author_email: string;
 author_profile_id: string | null;
 author_type: TicketMessageAuthorType;
 body: string;
 created_at: Date;
 ticket_id: string;
 workspace_id: string;
};

/** a message as exposed through the API */
export type TicketMessage = Omit<TicketMessageDocument, '_id' | 'created_at'> & {
 created_at: string;
 id: string;
};

export type TicketMessageInsert = Omit<TicketMessage, 'created_at' | 'id'>;

// == Constant ====================================================================
export const ticketMessageAuthorTypes: { [key in TicketMessageAuthorType]: key } = {
 agent: 'agent',
 customer: 'customer',
};

// == Schema ======================================================================
export const createTicketMessageSchema = yup.object({
 body: yup.string().trim().min(1).max(20000).required(),
});

export type CreateTicketMessageData = yup.InferType<typeof createTicketMessageSchema>;

export type CreateTicketMessageResponseData = {
 message: TicketMessage;
};

export const createTicketMessageSchemaKeys: { [key in keyof CreateTicketMessageData]: key } = {
 body: 'body',
};
