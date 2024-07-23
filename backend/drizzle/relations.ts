import { relations } from 'drizzle-orm/relations';
import { space, hotdesk, room, person, booking } from './schema';

export const hotdeskRelations = relations(hotdesk, ({ one }) => ({
  space: one(space, {
    fields: [hotdesk.id],
    references: [space.id],
  }),
}));

export const spaceRelations = relations(space, ({ many }) => ({
  hotdesks: many(hotdesk),
  rooms: many(room),
  bookings: many(booking),
}));

export const roomRelations = relations(room, ({ one }) => ({
  space: one(space, {
    fields: [room.id],
    references: [space.id],
  }),
}));

export const bookingRelations = relations(booking, ({ one }) => ({
  person: one(person, {
    fields: [booking.zid],
    references: [person.zid],
  }),
  space: one(space, {
    fields: [booking.spaceid],
    references: [space.id],
  }),
}));

export const personRelations = relations(person, ({ many }) => ({
  bookings: many(booking),
}));
