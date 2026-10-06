import { db } from './index.ts';
import { companyProfile } from './schema.ts';
import { eq } from 'drizzle-orm';
import { UserProfile } from '../types/index.ts';

export async function getCompanyProfileFromDb(): Promise<UserProfile> {
  try {
    const rows = await db.select().from(companyProfile);
    if (rows.length > 0) {
      const r = rows[0];
      return {
        id: 'admin-1',
        email: r.email,
        fullName: r.fullName,
        role: 'admin',
        phone: r.phone,
        whatsappNumber: r.whatsappNumber || r.phone,
        companyName: r.companyName,
        companyAddress: r.companyAddress || undefined,
        siret: r.siret || undefined,
        bioDescription: r.bioDescription || undefined,
        interventionArea: r.interventionArea || undefined,
        openingHours: r.openingHours || undefined,
      };
    }

    // Default insert if empty
    const defaultData = {
      companyName: 'TechDepan Express',
      fullName: 'Kamel Douahem',
      phone: '06 12 34 56 78',
      whatsappNumber: '06 12 34 56 78',
      email: 'admin@depannage.fr',
      companyAddress: '14 Rue de la République, 75011 Paris',
      siret: '892 145 678 00019',
      bioDescription: 'Dépannage informatique rapide à domicile & en atelier · PC, Mac, Imprimante, Réseau',
      interventionArea: 'Paris & Île-de-France (rayon 25 km)',
      openingHours: 'Du Lundi au Samedi : 8h30 - 19h30',
    };

    await db.insert(companyProfile).values(defaultData);
    return {
      id: 'admin-1',
      ...defaultData,
      role: 'admin',
    };
  } catch (error) {
    console.error('Error fetching company profile from Cloud SQL:', error);
    return {
      id: 'admin-1',
      email: 'admin@depannage.fr',
      fullName: 'Kamel Douahem',
      role: 'admin',
      phone: '06 12 34 56 78',
      whatsappNumber: '06 12 34 56 78',
      companyName: 'TechDepan Express',
      companyAddress: '14 Rue de la République, 75011 Paris',
      siret: '892 145 678 00019',
      bioDescription: 'Dépannage informatique rapide à domicile & en atelier · PC, Mac, Imprimante, Réseau',
      interventionArea: 'Paris & Île-de-France (rayon 25 km)',
      openingHours: 'Du Lundi au Samedi : 8h30 - 19h30',
    };
  }
}

export async function updateCompanyProfileInDb(data: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const rows = await db.select().from(companyProfile);
    if (rows.length === 0) {
      await getCompanyProfileFromDb();
    }

    await db.update(companyProfile).set({
      companyName: data.companyName,
      fullName: data.fullName,
      phone: data.phone,
      whatsappNumber: data.whatsappNumber,
      email: data.email,
      companyAddress: data.companyAddress,
      siret: data.siret,
      bioDescription: data.bioDescription,
      interventionArea: data.interventionArea,
      openingHours: data.openingHours,
      updatedAt: new Date(),
    });

    return await getCompanyProfileFromDb();
  } catch (error) {
    console.error('Error updating company profile in Cloud SQL:', error);
    throw new Error('Database profile update failed.', { cause: error });
  }
}
