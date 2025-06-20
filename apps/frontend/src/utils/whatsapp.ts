
export interface WhatsAppMessageData {
  productName: string;
  price: number;
  customerName: string;
  vendorBusinessName: string;
  productUrl?: string;
}

export const buildWhatsAppUrl = (phoneNumber: string, data: WhatsAppMessageData): string => {
  const message = `Hi ${data.vendorBusinessName}! 

I'm interested in your product: *${data.productName}* (${data.price})

My name is: ${data.customerName}

${data.productUrl ? `Product link: ${data.productUrl}` : ''}

Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
  
  return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
};

export const sanitizePhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/[^0-9]/g, '');
  
  // Add country code if missing (assuming international format)
  if (cleaned.length === 10) {
    return `1${cleaned}`; // Assuming US/Canada if 10 digits
  }
  
  return cleaned;
};
