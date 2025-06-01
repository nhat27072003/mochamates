export const formatPrice = (price) => {
  return Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
export const formatDate = (dateInput) => {
  try {
    // Handle string input by appending 'Z' to treat as UTC
    let date;
    if (typeof dateInput === 'string') {
      // Ensure the string is in a parseable format
      date = new Date(dateInput.endsWith('Z') ? dateInput : `${dateInput}Z`);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      throw new Error('Invalid input type');
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    // Format to DD/MM/YYYY for vi-VN locale
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Invalid date format:', dateInput);
    return 'N/A';
  }
};