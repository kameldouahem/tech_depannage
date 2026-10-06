import { db } from './index.ts';
import { tickets } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { InterventionTicket } from '../types/index.ts';

export async function getAllTickets(): Promise<InterventionTicket[]> {
  try {
    const rows = await db.select().from(tickets).orderBy(desc(tickets.createdAt));
    return rows.map((r) => ({
      id: r.id,
      ticketNumber: r.ticketNumber,
      clientName: r.clientName,
      clientPhone: r.clientPhone,
      clientEmail: r.clientEmail || undefined,
      clientAddress: r.clientAddress,
      gpsUrl: r.gpsUrl || undefined,
      source: r.source as any,
      equipmentType: r.equipmentType as any,
      category: r.category,
      issueDescription: r.issueDescription,
      photoUrl: r.photoUrl || undefined,
      status: r.status as any,
      priority: r.priority as any,
      scheduledAt: r.scheduledAt || undefined,
      durationMinutes: r.durationMinutes || undefined,
      diagnosticNotes: r.diagnosticNotes || undefined,
      workDone: r.workDone || undefined,
      price: r.price,
      isPaid: r.isPaid,
      paymentMethod: (r.paymentMethod as any) || undefined,
      createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : new Date().toISOString(),
      history: r.history ? JSON.parse(r.history) : [],
    }));
  } catch (error) {
    console.error('Error fetching tickets from Cloud SQL:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getTicketByNumberOrPhone(query: string): Promise<InterventionTicket | null> {
  try {
    const all = await getAllTickets();
    const cleanQ = query.trim().toLowerCase();
    const found = all.find(
      (t) =>
        t.ticketNumber.toLowerCase() === cleanQ ||
        t.clientPhone.replace(/[\s.-]/g, '').includes(cleanQ.replace(/[\s.-]/g, ''))
    );
    return found || null;
  } catch (error) {
    console.error('Error finding ticket in Cloud SQL:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function createTicketInDb(ticketData: Omit<InterventionTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'history'>): Promise<InterventionTicket> {
  try {
    const all = await getAllTickets();
    const nextNumber = all.length + 80;
    const now = new Date();
    const id = 'ticket-' + Date.now();
    const ticketNumber = `DEP-2026-${String(nextNumber).padStart(3, '0')}`;

    const initialHistory = [
      {
        id: 'h-' + Date.now(),
        timestamp: now.toISOString(),
        action: 'Demande enregistrée (Cloud SQL)',
        note: `Créée via source: ${ticketData.source}`,
        user: 'Technicien',
      },
    ];

    await db.insert(tickets).values({
      id,
      ticketNumber,
      clientName: ticketData.clientName,
      clientPhone: ticketData.clientPhone,
      clientEmail: ticketData.clientEmail,
      clientAddress: ticketData.clientAddress,
      gpsUrl: ticketData.gpsUrl,
      source: ticketData.source,
      equipmentType: ticketData.equipmentType,
      category: ticketData.category,
      issueDescription: ticketData.issueDescription,
      photoUrl: ticketData.photoUrl,
      status: ticketData.status,
      priority: ticketData.priority,
      scheduledAt: ticketData.scheduledAt,
      durationMinutes: ticketData.durationMinutes,
      diagnosticNotes: ticketData.diagnosticNotes,
      workDone: ticketData.workDone,
      price: ticketData.price || 0,
      isPaid: ticketData.isPaid || false,
      paymentMethod: ticketData.paymentMethod,
      history: JSON.stringify(initialHistory),
      createdAt: now,
      updatedAt: now,
    });

    return {
      ...ticketData,
      id,
      ticketNumber,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      history: initialHistory,
    };
  } catch (error) {
    console.error('Error creating ticket in Cloud SQL:', error);
    throw new Error('Database insert failed.', { cause: error });
  }
}

export async function updateTicketInDb(id: string, updates: Partial<InterventionTicket>, changeNote?: string): Promise<InterventionTicket | null> {
  try {
    const existingRows = await db.select().from(tickets).where(eq(tickets.id, id));
    if (existingRows.length === 0) return null;

    const old = existingRows[0];
    const now = new Date();
    const currentHistory = old.history ? JSON.parse(old.history) : [];

    if (updates.status && updates.status !== old.status) {
      currentHistory.push({
        id: 'h-' + Date.now(),
        timestamp: now.toISOString(),
        action: `Statut changé : ${updates.status}`,
        note: changeNote || undefined,
        user: 'Technicien',
      });
    } else if (changeNote) {
      currentHistory.push({
        id: 'h-' + Date.now(),
        timestamp: now.toISOString(),
        action: 'Mise à jour',
        note: changeNote,
        user: 'Technicien',
      });
    }

    const { id: _id, ticketNumber: _tn, createdAt: _ca, updatedAt: _ua, history: _h, ...validUpdates } = updates as any;

    await db
      .update(tickets)
      .set({
        ...validUpdates,
        history: JSON.stringify(currentHistory),
        updatedAt: now,
      })
      .where(eq(tickets.id, id));

    const updatedRows = await db.select().from(tickets).where(eq(tickets.id, id));
    if (updatedRows.length === 0) return null;
    const r = updatedRows[0];

    return {
      id: r.id,
      ticketNumber: r.ticketNumber,
      clientName: r.clientName,
      clientPhone: r.clientPhone,
      clientEmail: r.clientEmail || undefined,
      clientAddress: r.clientAddress,
      gpsUrl: r.gpsUrl || undefined,
      source: r.source as any,
      equipmentType: r.equipmentType as any,
      category: r.category,
      issueDescription: r.issueDescription,
      photoUrl: r.photoUrl || undefined,
      status: r.status as any,
      priority: r.priority as any,
      scheduledAt: r.scheduledAt || undefined,
      durationMinutes: r.durationMinutes || undefined,
      diagnosticNotes: r.diagnosticNotes || undefined,
      workDone: r.workDone || undefined,
      price: r.price,
      isPaid: r.isPaid,
      paymentMethod: (r.paymentMethod as any) || undefined,
      createdAt: r.createdAt ? r.createdAt.toISOString() : now.toISOString(),
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : now.toISOString(),
      history: currentHistory,
    };
  } catch (error) {
    console.error('Error updating ticket in Cloud SQL:', error);
    throw new Error('Database update failed.', { cause: error });
  }
}

export async function deleteTicketInDb(id: string): Promise<boolean> {
  try {
    await db.delete(tickets).where(eq(tickets.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting ticket in Cloud SQL:', error);
    throw new Error('Database delete failed.', { cause: error });
  }
}

export async function seedInitialTicketsIfEmpty(): Promise<void> {
  try {
    const existing = await db.select().from(tickets);
    if (existing.length === 0) {
      console.log('Seeding initial tickets into Cloud SQL PostgreSQL database...');
      const seedData = [
        {
          id: 'ticket-1',
          ticketNumber: 'DEP-2026-081',
          clientName: 'Dr. Marc Laurent',
          clientPhone: '+33612345678',
          clientEmail: 'cabinet.drlaurent@gmail.com',
          clientAddress: '14 Rue de la République, 75011 Paris',
          gpsUrl: 'https://www.google.com/maps/search/?api=1&query=14+Rue+de+la+R%C3%A9publique+75011+Paris',
          source: 'telephone',
          equipmentType: 'portable',
          category: 'Système / BSOD',
          issueDescription: 'Écran bleu Windows (BSOD Inaccessible Boot Device) au démarrage du PC portable du cabinet médical.',
          status: 'en_intervention',
          priority: 'critique',
          scheduledAt: '2026-10-06T10:00',
          durationMinutes: 60,
          diagnosticNotes: 'SSD NVMe reconnu dans le BIOS mais table BCD endommagée après mise à jour. Reconstruction EFI en cours.',
          workDone: 'Démarrage WinPE, réparation BCD bootrec /rebuildbcd, sauvegarde préventive du dossier Médical.',
          price: 89,
          isPaid: false,
          paymentMethod: 'carte',
          history: JSON.stringify([
            { id: 'h-1', timestamp: '2026-10-05T16:20:00Z', action: 'Demande créée (Cloud SQL)', note: 'Reçue par téléphone.', user: 'Technicien' },
            { id: 'h-2', timestamp: '2026-10-06T10:00:00Z', action: 'En intervention', note: 'Arrivée sur site.', user: 'Technicien' }
          ]),
        },
        {
          id: 'ticket-2',
          ticketNumber: 'DEP-2026-082',
          clientName: 'Boulangerie Les Délices',
          clientPhone: '+33698765432',
          clientEmail: 'contact@boulangerie-delices.fr',
          clientAddress: '28 Avenue Jean Jaurès, 75019 Paris',
          gpsUrl: 'https://www.google.com/maps/search/?api=1&query=28+Avenue+Jean+Jaur%C3%A8s+75019+Paris',
          source: 'whatsapp',
          equipmentType: 'imprimante',
          category: 'Matériel / Impression',
          issueDescription: 'Imprimante tickets de caisse thermique bloquée + terminal tactile qui ne répond plus à l\'ouverture.',
          status: 'planifiee',
          priority: 'urgent',
          scheduledAt: '2026-10-06T14:30',
          durationMinutes: 45,
          diagnosticNotes: 'Bourrage papier thermique récurrent + spooler Windows d\'impression bloqué en boucle.',
          workDone: '',
          price: 65,
          isPaid: false,
          history: JSON.stringify([
            { id: 'h-4', timestamp: '2026-10-06T07:10:00Z', action: 'Demande créée (Cloud SQL)', note: 'Reçue via WhatsApp.', user: 'Technicien' }
          ]),
        },
        {
          id: 'ticket-3',
          ticketNumber: 'DEP-2026-083',
          clientName: 'Sophie Bernard (Cabinet Comptable)',
          clientPhone: '+33644112233',
          clientEmail: 'sophie.bernard@fiduciaire-paris.com',
          clientAddress: '5 Place de la Bastille, 75004 Paris',
          gpsUrl: 'https://www.google.com/maps/search/?api=1&query=5+Place+de+la+Bastille+75004+Paris',
          source: 'email',
          equipmentType: 'tour',
          category: 'Matériel / Surchauffe',
          issueDescription: 'Tour PC fixe s\'éteint brusquement après 15 minutes. Bruit de ventilateur assourdissant.',
          status: 'a_contacter',
          priority: 'normal',
          durationMinutes: 60,
          diagnosticNotes: 'Encrassement sévère du ventirad CPU et pâte thermique asséchée probable.',
          workDone: '',
          price: 75,
          isPaid: false,
          history: JSON.stringify([
            { id: 'h-6', timestamp: '2026-10-06T08:45:00Z', action: 'Demande créée (Cloud SQL)', note: 'Email formulaire de contact.', user: 'Système' }
          ]),
        }
      ];

      for (const item of seedData) {
        await db.insert(tickets).values({
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      console.log('Cloud SQL tickets seeded successfully.');
    }
  } catch (err) {
    console.warn('Seed warning:', err);
  }
}
