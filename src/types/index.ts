export type InterventionStatus =
  | 'nouvelle'
  | 'a_contacter'
  | 'planifiee'
  | 'en_intervention'
  | 'terminee'
  | 'annulee';

export type RequestSource =
  | 'whatsapp'
  | 'telephone'
  | 'email'
  | 'recommandation'
  | 'site_web'
  | 'autre';

export type EquipmentType =
  | 'portable'
  | 'tour'
  | 'mac'
  | 'imprimante'
  | 'reseau'
  | 'tablette'
  | 'serveur'
  | 'autre';

export type Priority = 'normal' | 'urgent' | 'critique';

export interface TicketHistoryItem {
  id: string;
  timestamp: string;
  action: string;
  note?: string;
  user: string;
}

export interface InterventionTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientAddress: string;
  gpsUrl?: string;
  source: RequestSource;
  equipmentType: EquipmentType;
  category: string;
  issueDescription: string;
  photoUrl?: string;
  status: InterventionStatus;
  priority: Priority;
  scheduledAt?: string; // YYYY-MM-DDTHH:mm
  durationMinutes?: number;
  diagnosticNotes?: string;
  workDone?: string;
  price: number;
  isPaid: boolean;
  paymentMethod?: 'especes' | 'carte' | 'virement' | 'cheque';
  createdAt: string;
  updatedAt: string;
  history: TicketHistoryItem[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'technicien';
  phone: string;
  whatsappNumber?: string;
  companyName: string;
  companyAddress?: string;
  siret?: string;
  bioDescription?: string;
  interventionArea?: string;
  openingHours?: string;
  websiteUrl?: string;
  avatarUrl?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
