import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const prompts = pgTable('prompts', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    content: text('content').notNull(),
    tags: jsonb('tags').$type<string[]>().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});