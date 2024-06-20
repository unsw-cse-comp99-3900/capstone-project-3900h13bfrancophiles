import { relations } from "drizzle-orm/relations";
import { space, hotdesk, room, person, staff, hdr, booking } from "./schema";

export const hotdeskRelations = relations(hotdesk, ({one}) => ({
	space: one(space, {
		fields: [hotdesk.id],
		references: [space.id]
	}),
}));

export const spaceRelations = relations(space, ({many}) => ({
	hotdesks: many(hotdesk),
	rooms: many(room),
}));

export const roomRelations = relations(room, ({one}) => ({
	space: one(space, {
		fields: [room.id],
		references: [space.id]
	}),
}));

export const staffRelations = relations(staff, ({one}) => ({
	person: one(person, {
		fields: [staff.zid],
		references: [person.zid]
	}),
}));

export const personRelations = relations(person, ({many}) => ({
	staff: many(staff),
	hdrs: many(hdr),
	bookings: many(booking),
}));

export const hdrRelations = relations(hdr, ({one}) => ({
	person: one(person, {
		fields: [hdr.zid],
		references: [person.zid]
	}),
}));

export const bookingRelations = relations(booking, ({one}) => ({
	person: one(person, {
		fields: [booking.zid],
		references: [person.zid]
	}),
}));