import { pgTable, pgEnum, text, foreignKey, numeric, integer, serial, timestamp, varchar } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const bookingstatusenum = pgEnum("bookingstatusenum", ['pending', 'confirmed', 'declined', 'checkedin', 'completed', 'deleted'])
export const usergroupenum = pgEnum("usergroupenum", ['other', 'hdr', 'csestaff', 'admin'])


export const config = pgTable("config", {
	key: text("key").primaryKey().notNull(),
	value: text("value").notNull(),
	description: text("description").notNull(),
});

export const space = pgTable("space", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	minreqgrp: usergroupenum("minreqgrp").notNull(),
	minbookgrp: usergroupenum("minbookgrp").notNull(),
});

export const hotdesk = pgTable("hotdesk", {
	id: text("id").primaryKey().notNull().references(() => space.id, { onDelete: "cascade" } ),
	floor: text("floor").notNull(),
	xcoord: numeric("xcoord").notNull(),
	ycoord: numeric("ycoord").notNull(),
});

export const room = pgTable("room", {
	id: text("id").primaryKey().notNull().references(() => space.id, { onDelete: "cascade" } ),
	capacity: integer("capacity").notNull(),
	roomnumber: text("roomnumber").notNull(),
	type: text("type").notNull(),
});

export const person = pgTable("person", {
	zid: integer("zid").primaryKey().notNull(),
	email: text("email").notNull(),
	fullname: text("fullname").notNull(),
	title: text("title"),
	school: text("school").notNull(),
	faculty: text("faculty").notNull(),
	role: text("role"),
	usergrp: usergroupenum("usergrp").notNull(),
	image: text("image"),
});

export const booking = pgTable("booking", {
	id: serial("id").primaryKey().notNull(),
	zid: integer("zid").notNull().references(() => person.zid),
	starttime: timestamp("starttime", { mode: 'string' }).notNull(),
	endtime: timestamp("endtime", { mode: 'string' }).notNull(),
	spaceid: text("spaceid").notNull().references(() => space.id),
	currentstatus: bookingstatusenum("currentstatus").notNull(),
	description: varchar("description", { length: 255 }).notNull(),
	checkintime: timestamp("checkintime", { mode: 'string' }),
	checkouttime: timestamp("checkouttime", { mode: 'string' }),
});