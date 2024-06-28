import { relations } from "drizzle-orm/relations";
import { person, booking, space, staff, hdr, hotdesk, room } from "./schema";

export const bookingRelations = relations(booking, ({one}) => ({
	person: one(person, {
		fields: [booking.zid],
		references: [person.zid]
	}),
	space: one(space, {
		fields: [booking.spaceid],
		references: [space.id]
	}),
}));

export const personRelations = relations(person, ({many}) => ({
	bookings: many(booking),
	staff: many(staff),
	hdrs: many(hdr),
}));

export const spaceRelations = relations(space, ({many}) => ({
	bookings: many(booking),
	hotdesks: many(hotdesk),
	rooms: many(room),
}));

export const staffRelations = relations(staff, ({one}) => ({
	person: one(person, {
		fields: [staff.zid],
		references: [person.zid]
	}),
}));

export const hdrRelations = relations(hdr, ({one}) => ({
	person: one(person, {
		fields: [hdr.zid],
		references: [person.zid]
	}),
}));

export const hotdeskRelations = relations(hotdesk, ({one}) => ({
	space: one(space, {
		fields: [hotdesk.id],
		references: [space.id]
	}),
}));

export const roomRelations = relations(room, ({one}) => ({
	space: one(space, {
		fields: [room.id],
		references: [space.id]
	}),
}));