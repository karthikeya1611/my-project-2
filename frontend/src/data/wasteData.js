// Mock Waste Management Data for Spice Garden Restaurant

export const WASTE_REASONS = [
  "Spoilage",
  "Expired",
  "Overproduction",
  "Preparation Waste",
  "Damaged",
  "Other"
];

export const initialWasteLogs = [
  {
    id: "W-105",
    ingredient: "Fresh Tomato",
    quantity: 5.0,
    unit: "kg",
    reason: "Expired",
    date: "2026-09-15",
    cost: 175
  },
  {
    id: "W-104",
    ingredient: "Fresh Spinach (Palak)",
    quantity: 2.5,
    unit: "kg",
    reason: "Spoilage",
    date: "2026-09-15",
    cost: 875
  },
  {
    id: "W-103",
    ingredient: "Cooked Biryani Rice",
    quantity: 4.0,
    unit: "kg",
    reason: "Overproduction",
    date: "2026-09-14",
    cost: 1200
  },
  {
    id: "W-102",
    ingredient: "Milk & Cream Batch",
    quantity: 3.0,
    unit: "Liters",
    reason: "Expired",
    date: "2026-09-13",
    cost: 630
  },
  {
    id: "W-101",
    ingredient: "Sliced Tomato Trimmings",
    quantity: 2.9,
    unit: "kg",
    reason: "Preparation Waste",
    date: "2026-09-12",
    cost: 495
  },
  {
    id: "W-100",
    ingredient: "Paneer Blocks",
    quantity: 1.5,
    unit: "kg",
    reason: "Damaged",
    date: "2026-09-10",
    cost: 420
  }
];

export const MOCK_HISTORICAL_WASTE_REPORTS = [
  {
    reportId: "WR-2026-08",
    month: "August 2026",
    preparedBy: "Chef Ramesh",
    totalWasteKg: "42.5 kg",
    estimatedLoss: 16800,
    majorCauses: "Overproduction of rice dishes during weekday dinners & raw spinach wilting.",
    managerRemarks: "Kitchen prep guidelines tightened. Portion sizing updated for dinner buffet.",
    recommendations: "Order spinach in smaller daily batches from Green Valley Organics.",
    type: "Current"
  },
  {
    reportId: "WR-2026-07",
    month: "July 2026",
    preparedBy: "Chef Ramesh",
    totalWasteKg: "48.0 kg",
    estimatedLoss: 19200,
    majorCauses: "Monsoon humidity spoilage in onion and potato cold storage.",
    managerRemarks: "Dehumidifiers installed in secondary dry storage area.",
    recommendations: "Inspect root vegetable sacks on arrival for moisture.",
    type: "Previous"
  },
  {
    reportId: "WR-2026-Q2",
    month: "Q2 2026 (Apr - Jun)",
    preparedBy: "General Manager Suresh",
    totalWasteKg: "135.0 kg",
    estimatedLoss: 54000,
    majorCauses: "Summer dairy spoilage and over-prep of lunch curry gravies.",
    managerRemarks: "Cold chain audit conducted with Fresh Dairy Co.",
    recommendations: "Implement FIFO stock rotation strictly across all walk-in chillers.",
    type: "Archived"
  }
];
