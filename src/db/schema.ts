import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table (linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  role: text('role').default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Company profile & settings table
export const companyProfile = pgTable('company_profile', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').notNull().default('TechDepan Express'),
  fullName: text('full_name').notNull().default('Kamel Douahem'),
  phone: text('phone').notNull().default('06 12 34 56 78'),
  whatsappNumber: text('whatsapp_number').default('06 12 34 56 78'),
  email: text('email').notNull().default('admin@depannage.fr'),
  companyAddress: text('company_address').default('14 Rue de la République, 75011 Paris'),
  siret: text('siret').default('892 145 678 00019'),
  bioDescription: text('bio_description').default('Dépannage informatique rapide à domicile & en atelier · PC, Mac, Imprimante, Réseau'),
  interventionArea: text('intervention_area').default('Paris & Île-de-France (rayon 25 km)'),
  openingHours: text('opening_hours').default('Du Lundi au Samedi : 8h30 - 19h30'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tickets table
export const tickets = pgTable('tickets', {
  id: text('id').primaryKey(),
  ticketNumber: text('ticket_number').notNull().unique(),
  clientName: text('client_name').notNull(),
  clientPhone: text('client_phone').notNull(),
  clientEmail: text('client_email'),
  clientAddress: text('client_address').notNull(),
  gpsUrl: text('gps_url'),
  source: text('source').notNull().default('telephone'),
  equipmentType: text('equipment_type').notNull().default('portable'),
  category: text('category').notNull().default('Démarrage & Système'),
  issueDescription: text('issue_description').notNull(),
  photoUrl: text('photo_url'),
  status: text('status').notNull().default('nouvelle'),
  priority: text('priority').notNull().default('normal'),
  scheduledAt: text('scheduled_at'),
  durationMinutes: integer('duration_minutes'),
  diagnosticNotes: text('diagnostic_notes'),
  workDone: text('work_done'),
  price: integer('price').notNull().default(0),
  isPaid: boolean('is_paid').notNull().default(false),
  paymentMethod: text('payment_method'),
  history: text('history').notNull().default('[]'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
