import { pgTable, serial, foreignKey, integer, text, boolean, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const space = pgTable("space", {
	id: serial("id").primaryKey().notNull(),
});

export const hotdesk = pgTable("hotdesk", {
	id: serial("id").primaryKey().notNull().references(() => space.id, { onDelete: "cascade" } ),
	floor: integer("floor").notNull(),
	desknumber: integer("desknumber").notNull(),
});

export const room = pgTable("room", {
	id: serial("id").primaryKey().notNull().references(() => space.id, { onDelete: "cascade" } ),
	capacity: integer("capacity").notNull(),
	roomnumber: integer("roomnumber").notNull(),
	usage: integer("usage").notNull(),
});

export const person = pgTable("person", {
	zid: integer("zid").primaryKey().notNull(),
	email: text("email").notNull(),
	fullname: text("fullname").notNull(),
	school: text("school").notNull(),
	faculty: text("faculty").notNull(),
});

export const staff = pgTable("staff", {
	zid: integer("zid").primaryKey().notNull().references(() => person.zid),
	isadmin: boolean("isadmin"),
});

export const hdr = pgTable("hdr", {
	zid: integer("zid").primaryKey().notNull().references(() => person.zid),
	degree: text("degree"),
});

export const booking = pgTable("booking", {
	id: serial("id").primaryKey().notNull(),
	zid: integer("zid").notNull().references(() => person.zid),
	starttime: timestamp("starttime", { mode: 'string' }).notNull(),
	endtime: timestamp("endtime", { mode: 'string' }).notNull(),
	spaceid: integer("spaceid").notNull(),
	currentstatus: text("currentstatus").notNull(),
});
