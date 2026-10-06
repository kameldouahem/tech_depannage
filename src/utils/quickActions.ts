/**
 * Quick actions for field technician:
 * - Direct phone call
 * - Direct WhatsApp with customized template message
 * - Google Maps directions/location
 * - Direct email
 */

export const cleanPhoneNumber = (phone: string): string => {
  // Removes spaces, dots, dashes, parentheses
  return phone.replace(/[\s.\-()]/g, '');
};

export const getInternationalWhatsAppNumber = (phone: string): string => {
  let cleaned = cleanPhoneNumber(phone);
  // French number standard replacement if starts with 0
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '33' + cleaned.substring(1);
  }
  // Strip leading plus
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
};

export const makePhoneCall = (phone: string) => {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return;
  window.location.href = `tel:${cleaned}`;
};

export const openWhatsApp = (phone: string, clientName: string, ticketNumber?: string) => {
  const intlNumber = getInternationalWhatsAppNumber(phone);
  const text = encodeURIComponent(
    `Bonjour ${clientName}, c'est votre technicien informatique concernant votre demande de dépannage ${ticketNumber ? `(${ticketNumber})` : ''}. Êtes-vous disponible pour échanger ?`
  );
  window.open(`https://wa.me/${intlNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
};

export const openGoogleMaps = (address: string, customGpsUrl?: string) => {
  if (customGpsUrl && customGpsUrl.startsWith('http')) {
    window.open(customGpsUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  const encoded = encodeURIComponent(address.trim());
  const url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const sendEmail = (email: string, clientName: string, ticketNumber?: string) => {
  if (!email) return;
  const subject = encodeURIComponent(`Dépannage informatique - ${ticketNumber || 'Intervention'} - ${clientName}`);
  const body = encodeURIComponent(
    `Bonjour ${clientName},\n\nSuite à votre demande de dépannage informatique, voici les informations concernant votre prise en charge.\n\nRestant à votre entière disposition,\nVotre technicien informatique.`
  );
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};
