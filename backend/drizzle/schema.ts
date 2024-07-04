import { pgTable, integer, text, foreignKey, boolean, serial, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



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

export const booking = pgTable("booking", {
	id: serial("id").primaryKey().notNull(),
	zid: integer("zid").notNull().references(() => person.zid),
	starttime: timestamp("starttime", { mode: 'string' }).notNull(),
	endtime: timestamp("endtime", { mode: 'string' }).notNull(),
	spaceid: text("spaceid").notNull().references(() => space.id),
	currentstatus: text("currentstatus").notNull(),
	description: text("description").notNull(),
	checkintime: timestamp("checkintime", { mode: 'string' }),
	checkouttime: timestamp("checkouttime", { mode: 'string' }),
});

export const hdr = pgTable("hdr", {
	zid: integer("zid").primaryKey().notNull().references(() => person.zid),
	degree: text("degree"),
});

export const space = pgTable("space", {
	id: text("id").primaryKey().notNull(),
	type: text("type").notNull(),
	name: text("name").notNull(),
});

export const hotdesk = pgTable("hotdesk", {
	id: text("id").primaryKey().notNull().references(() => space.id, { onDelete: "cascade" } ),
	floor: text("floor").notNull(),
	room: text("room").notNull(),
	desknumber: integer("desknumber").notNull(),
});

export const room = pgTable("room", {
	id: text("id").primaryKey().notNull().references(() => space.id, { onDelete: "cascade" } ),
	capacity: integer("capacity").notNull(),
	roomnumber: text("roomnumber").notNull(),
	usage: text("usage").notNull(),
});