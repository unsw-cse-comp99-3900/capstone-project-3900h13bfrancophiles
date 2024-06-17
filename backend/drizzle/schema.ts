import { pgTable, serial, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const visits = pgTable("visits", {
	id: serial("id").primaryKey().notNull(),
	time: timestamp("time", { mode: 'string' }),
});