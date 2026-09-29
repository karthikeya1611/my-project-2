// Mock Expenses Data for Spice Garden Restaurant
// Contains expenses categorized across: Ingredients, Utilities, Transport, Maintenance, Salary, Other.

export const EXPENSE_CATEGORIES = [
  "All",
  "Ingredients",
  "Utilities",
  "Transport",
  "Maintenance",
  "Salary",
  "Other"
];

export const initialExpenses = [
  { id: "EXP-501", date: "2026-09-15", category: "Utilities", description: "Monthly Commercial Gas Cylinders (LPG)", amount: 28500, paymentMethod: "Bank Transfer" },
  { id: "EXP-502", date: "2026-09-14", category: "Ingredients", description: "Bulk Procurement - PO #PO-9022 (Basmati Rice & Dal)", amount: 32500, paymentMethod: "UPI" },
  { id: "EXP-503", date: "2026-09-12", category: "Maintenance", description: "Kitchen Exhaust & Chimney Deep Cleaning", amount: 7500, paymentMethod: "UPI" },
  { id: "EXP-504", date: "2026-09-10", category: "Transport", description: "Urgent Local Produce Van Transport", amount: 3200, paymentMethod: "Cash" },
  { id: "EXP-505", date: "2026-09-05", category: "Salary", description: "Kitchen Staff Monthly Salary Advance (Sept)", amount: 85000, paymentMethod: "Bank Transfer" },
  { id: "EXP-506", date: "2026-09-02", category: "Utilities", description: "Electricity Bill (August 2026)", amount: 42000, paymentMethod: "Bank Transfer" },
  { id: "EXP-507", date: "2026-09-01", category: "Other", description: "Pest Control & Sanitization Audit", amount: 4500, paymentMethod: "Cash" }
];
