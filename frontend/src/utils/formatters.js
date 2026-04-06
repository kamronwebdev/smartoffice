export const formatPrice = (price) => {
  if (!price) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  
  // Raqamlardan boshqa hamma narsani olib tashlaymiz
  let cleaned = ('' + phone).replace(/\D/g, '');
  
  // Agar boshida 998 yozilmagan bo'lsa (faqat 9 ta raqam bo'lsa) qo'shamiz
  if (cleaned.length === 9) {
    cleaned = '998' + cleaned;
  }
  
  // +998 90 123 45 67 formatga keltirish
  if (cleaned.length === 12) {
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return '+' + match[1] + ' ' + match[2] + ' ' + match[3] + ' ' + match[4] + ' ' + match[5];
    }
  }
  
  return phone;
};