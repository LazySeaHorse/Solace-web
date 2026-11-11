import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
// A single private journal vault, not a multi-tenant collection.
export const vault=sqliteTable('haff_vault',{id:integer('id').primaryKey(),owner:text('owner').notNull(),revision:integer('revision').notNull(),envelope:text('envelope').notNull(),updatedAt:integer('updated_at').notNull()});
