import * as yup from 'yup';

// ********************************************************************************
// == Type ========================================================================
export type ConversationMessageAuthorType = 'agent' | 'customer';

/** a message as stored in MongoDB, in the collection named by `conversationMessageCollection` */
export type ConversationMessageDocument = {
 _id: string;
 author_email: string;
 author_profile_id: string | null;
 author_type: ConversationMessageAuthorType;
 body: string;
 conversation_id: string;
 created_at: Date;
 workspace_id: string;
};

/** a message as exposed through the API */
export type ConversationMessage = Omit<ConversationMessageDocument, '_id' | 'created_at'> & {
 created_at: string;
 id: string;
};

export type ConversationMessageInsert = Omit<ConversationMessage, 'created_at' | 'id'>;

// == Constant ====================================================================
export const conversationMessageAuthorTypes: { [key in ConversationMessageAuthorType]: key } = {
 agent: 'agent',
 customer: 'customer',
};

// == Schema ======================================================================
export const createConversationMessageSchema = yup.object({
 body: yup.string().trim().min(1).max(20000).required(),
});

export type CreateConversationMessageData = yup.InferType<typeof createConversationMessageSchema>;

export type CreateConversationMessageResponseData = {
 message: ConversationMessage;
};

export const createConversationMessageSchemaKeys: { [key in keyof CreateConversationMessageData]: key } = {
 body: 'body',
};
