// Simple utility functions for formatting numbers, currency and dates

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatRating(rating) {
  if (rating === undefined || rating === null) return "N/A";
  const num = Number(rating);
  return `${num.toFixed(1)} / 10`;
}
