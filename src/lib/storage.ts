import { InterventionTicket, InterventionStatus } from '../types';
import screenDamageImg from '../assets/images/ticket_screen_damage_1791279247267.jpg';
import dustyFanImg from '../assets/images/ticket_pc_dusty_fan_1791279260496.jpg';
import blueScreenImg from '../assets/images/ticket_blue_screen_1791279273364.jpg';

const STORAGE_KEY = 'techdepan_tickets_v1';

export const INITIAL_TICKETS: InterventionTicket[] = [
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
    photoUrl: blueScreenImg,
    status: 'en_intervention',
    priority: 'critique',
    scheduledAt: '2026-10-06T10:00',
    durationMinutes: 60,
    diagnosticNotes: 'SSD NVMe reconnu dans le BIOS mais table BCD endommagée après mise à jour système. Tentative de reconstruction EFI en cours.',
    workDone: 'Démarrage sur clé WinPE, réparation BCD bootrec /rebuildbcd, sauvegarde préventive du dossier Médical.',
    price: 89,
    isPaid: false,
    paymentMethod: 'carte',
    createdAt: '2026-10-05T16:20:00Z',
    updatedAt: '2026-10-06T10:15:00Z',
    history: [
      {
        id: 'h-1',
        timestamp: '2026-10-05T16:20:00Z',
        action: 'Demande créée',
        note: 'Reçue par téléphone. Client très inquiet pour ses logiciels médicaux.',
        user: 'Technicien'
      },
      {
        id: 'h-2',
        timestamp: '2026-10-05T16:45:00Z',
        action: 'Statut changé : Planifiée',
        note: 'Rendez-vous fixé au cabinet médical mardi à 10h00.',
        user: 'Technicien'
      },
      {
        id: 'h-3',
        timestamp: '2026-10-06T10:00:00Z',
        action: 'Statut changé : En intervention',
        note: 'Arrivée sur site.',
        user: 'Technicien'
      }
    ]
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
    photoUrl: undefined,
    status: 'planifiee',
    priority: 'urgent',
    scheduledAt: '2026-10-06T14:30',
    durationMinutes: 45,
    diagnosticNotes: 'Bourrage papier thermique récurrent + spooler Windows d\'impression bloqué en boucle.',
    workDone: '',
    price: 65,
    isPaid: false,
    createdAt: '2026-10-06T07:10:00Z',
    updatedAt: '2026-10-06T08:00:00Z',
    history: [
      {
        id: 'h-4',
        timestamp: '2026-10-06T07:10:00Z',
        action: 'Demande créée',
        note: 'Message reçu sur WhatsApp avec photo du voyant rouge clignotant.',
        user: 'Technicien'
      },
      {
        id: 'h-5',
        timestamp: '2026-10-06T08:00:00Z',
        action: 'Statut changé : Planifiée',
        note: 'Passage prévu début d\'après-midi pendant le creux de service.',
        user: 'Technicien'
      }
    ]
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
    photoUrl: dustyFanImg,
    status: 'a_contacter',
    priority: 'normal',
    scheduledAt: undefined,
    durationMinutes: 60,
    diagnosticNotes: 'Encrassement sévère du ventirad CPU et pâte thermique asséchée probable.',
    workDone: '',
    price: 75,
    isPaid: false,
    createdAt: '2026-10-06T08:45:00Z',
    updatedAt: '2026-10-06T08:45:00Z',
    history: [
      {
        id: 'h-6',
        timestamp: '2026-10-06T08:45:00Z',
        action: 'Demande créée',
        note: 'Email envoyé depuis le formulaire de contact du site.',
        user: 'Système'
      }
    ]
  },
  {
    id: 'ticket-4',
    ticketNumber: 'DEP-2026-084',
    clientName: 'Alexandre Meyer',
    clientPhone: '+33655889900',
    clientEmail: 'alex.meyer.design@outlook.com',
    clientAddress: '9 Rue Oberkampf, 75011 Paris',
    gpsUrl: 'https://www.google.com/maps/search/?api=1&query=9+Rue+Oberkampf+75011+Paris',
    source: 'whatsapp',
    equipmentType: 'portable',
    category: 'Écran / Affichage',
    issueDescription: 'Dalle écran fissurée suite à une chute du sac à dos. Lignes verticales multicolores.',
    photoUrl: screenDamageImg,
    status: 'nouvelle',
    priority: 'urgent',
    scheduledAt: undefined,
    durationMinutes: 90,
    diagnosticNotes: '',
    workDone: '',
    price: 140,
    isPaid: false,
    createdAt: '2026-10-06T09:12:00Z',
    updatedAt: '2026-10-06T09:12:00Z',
    history: [
      {
        id: 'h-7',
        timestamp: '2026-10-06T09:12:00Z',
        action: 'Demande créée',
        note: 'Demande reçue via WhatsApp avec photo de la dalle.',
        user: 'Système'
      }
    ]
  },
  {
    id: 'ticket-5',
    ticketNumber: 'DEP-2026-080',
    clientName: 'Mme Claire Vasseur',
    clientPhone: '+33677223344',
    clientEmail: 'claire.vasseur@free.fr',
    clientAddress: '42 Rue Saint-Maur, 75011 Paris',
    gpsUrl: 'https://www.google.com/maps/search/?api=1&query=42+Rue+Saint-Maur+75011+Paris',
    source: 'recommandation',
    equipmentType: 'mac',
    category: 'Virus / Optimisation',
    issueDescription: 'MacBook Pro saturé d\'adwares Safari, popups intempestifs et lenteur extrême.',
    photoUrl: undefined,
    status: 'terminee',
    priority: 'normal',
    scheduledAt: '2026-10-05T14:00',
    durationMinutes: 60,
    diagnosticNotes: 'Présence de faux nettoyeurs MacKeeper et profils de configuration malveillants Safari.',
    workDone: 'Suppression profils malveillants, nettoyage Malwarebytes, réinitialisation Safari, optimisation stockage.',
    price: 80,
    isPaid: true,
    paymentMethod: 'especes',
    createdAt: '2026-10-04T11:00:00Z',
    updatedAt: '2026-10-05T15:30:00Z',
    history: [
      {
        id: 'h-8',
        timestamp: '2026-10-04T11:00:00Z',
        action: 'Demande créée',
        note: 'Recommandée par un client régulier.',
        user: 'Technicien'
      },
      {
        id: 'h-9',
        timestamp: '2026-10-05T14:00:00Z',
        action: 'Statut changé : En intervention',
        note: 'Intervention à domicile.',
        user: 'Technicien'
      },
      {
        id: 'h-10',
        timestamp: '2026-10-05T15:30:00Z',
        action: 'Statut changé : Terminée',
        note: 'Problème résolu. Facture réglée en espèces.',
        user: 'Technicien'
      }
    ]
  }
];

export const getStoredTickets = (): InterventionTicket[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TICKETS;
  } catch (err) {
    console.error('Erreur lecture localStorage:', err);
    return INITIAL_TICKETS;
  }
};

export const fetchTicketsFromCloud = async (): Promise<InterventionTicket[]> => {
  try {
    const res = await fetch('/api/tickets');
    if (res.ok) {
      const cloudTickets: InterventionTicket[] = await res.json();
      if (Array.isArray(cloudTickets) && cloudTickets.length > 0) {
        saveTickets(cloudTickets);
        return cloudTickets;
      }
    }
  } catch (err) {
    console.warn('Could not sync tickets from Cloud SQL:', err);
  }
  return getStoredTickets();
};

export const saveTickets = (tickets: InterventionTicket[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (err) {
    console.error('Erreur écriture localStorage:', err);
  }
};

export const addTicket = (ticketData: Omit<InterventionTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'history'>): InterventionTicket => {
  const current = getStoredTickets();
  const nextNumber = current.length + 80;
  const now = new Date().toISOString();
  
  const newTicket: InterventionTicket = {
    ...ticketData,
    id: 'ticket-' + Date.now(),
    ticketNumber: `DEP-2026-${String(nextNumber).padStart(3, '0')}`,
    createdAt: now,
    updatedAt: now,
    history: [
      {
        id: 'h-' + Date.now(),
        timestamp: now,
        action: 'Demande enregistrée',
        note: `Créée via source: ${ticketData.source}`,
        user: 'Technicien'
      }
    ]
  };

  const updated = [newTicket, ...current];
  saveTickets(updated);

  // Sync to Cloud SQL in background
  fetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  })
    .then((res) => res.json())
    .then((serverTicket) => {
      if (serverTicket && serverTicket.id) {
        const fresh = getStoredTickets().map((t) => (t.id === newTicket.id ? serverTicket : t));
        saveTickets(fresh);
      }
    })
    .catch((err) => console.warn('Cloud SQL ticket sync error:', err));

  return newTicket;
};

export const updateTicket = (id: string, updates: Partial<InterventionTicket>, changeNote?: string): InterventionTicket | null => {
  const current = getStoredTickets();
  const index = current.findIndex(t => t.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const oldTicket = current[index];
  
  const updatedHistory = [...oldTicket.history];
  if (updates.status && updates.status !== oldTicket.status) {
    updatedHistory.push({
      id: 'h-' + Date.now(),
      timestamp: now,
      action: `Statut changé : ${getStatusLabel(updates.status)}`,
      note: changeNote || undefined,
      user: 'Technicien'
    });
  } else if (changeNote) {
    updatedHistory.push({
      id: 'h-' + Date.now(),
      timestamp: now,
      action: 'Mise à jour',
      note: changeNote,
      user: 'Technicien'
    });
  }

  const updatedTicket: InterventionTicket = {
    ...oldTicket,
    ...updates,
    updatedAt: now,
    history: updatedHistory
  };

  current[index] = updatedTicket;
  saveTickets(current);

  // Sync to Cloud SQL in background
  fetch(`/api/tickets/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates, changeNote }),
  }).catch((err) => console.warn('Cloud SQL update sync error:', err));

  return updatedTicket;
};

export const deleteTicket = (id: string): boolean => {
  const current = getStoredTickets();
  const filtered = current.filter(t => t.id !== id);
  if (filtered.length !== current.length) {
    saveTickets(filtered);
    fetch(`/api/tickets/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch((err) => console.warn('Cloud SQL delete sync error:', err));
    return true;
  }
  return false;
};

export const resetTicketsToDefault = (): InterventionTicket[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
  return INITIAL_TICKETS;
};

export const getStatusLabel = (status: InterventionStatus): string => {
  switch (status) {
    case 'nouvelle': return 'Nouvelle';
    case 'a_contacter': return 'À contacter';
    case 'planifiee': return 'Planifiée';
    case 'en_intervention': return 'En intervention';
    case 'terminee': return 'Terminée';
    case 'annulee': return 'Annulée';
    default: return status;
  }
};

export const getSourceLabel = (source: string): string => {
  switch (source) {
    case 'whatsapp': return 'WhatsApp';
    case 'telephone': return 'Téléphone';
    case 'email': return 'Email';
    case 'recommandation': return 'Recommandation';
    case 'site_web': return 'Site Web';
    default: return 'Autre';
  }
};

export const getEquipmentLabel = (eq: string): string => {
  switch (eq) {
    case 'portable': return 'PC Portable';
    case 'tour': return 'PC Fixe / Tour';
    case 'mac': return 'MacBook / iMac';
    case 'imprimante': return 'Imprimante / Périphérique';
    case 'reseau': return 'Box / Réseau / Wifi';
    case 'tablette': return 'Tablette / iPad';
    case 'serveur': return 'Serveur / NAS';
    default: return 'Autre matériel';
  }
};
