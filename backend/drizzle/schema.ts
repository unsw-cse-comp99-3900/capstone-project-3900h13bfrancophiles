import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const space = pgTable("space", {
	id: serial("id").primaryKey()
});

export const hotdesk = pgTable("hotdesk", {
	id: serial("id").primaryKey(),
	floor: integer("floor").notNull(),
	deskNumber: integer("deskNumber").notNull(),
	spaceId: serial("spaceId")
		.references(() => space.id, { onDelete: "cascade" })
});

export const room = pgTable("room", {
	id: serial("id").primaryKey(),
	capacity: integer("capacity").notNull(),
	roomNumber: integer("roomNumber").notNull(),
	usage: integer("usage").notNull(),
	spaceId: serial("spaceId")
		.references(() => space.id, { onDelete: "cascade" })
});

export const booking = pgTable("booking", {
	id: serial("id").primaryKey(),
	startTime: timestamp("startTime").notNull(),
	endTime: timestamp("endTime").notNull(),
	spaceId: integer("spaceId").notNull()
		.references(() => space.id, { onDelete: "cascade" })
});
