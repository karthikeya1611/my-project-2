// Mock Procurement & Purchase Orders Data for Spice Garden Restaurant
// Contains purchase orders covering all 7 required statuses: Draft, Pending, Approved, Ordered, Shipped, Delivered, Cancelled.

export const PO_STATUSES = [
  "All",
  "Draft",
  "Pending",
  "Approved",
  "Ordered",
  "Shipped",
  "Delivered",
  "Cancelled"
];

export const initialPurchaseOrders = [
  {
    poNumber: "PO-9027",
    supplier: "Fresh Dairy Co.",
    date: "2026-09-15",
    items: [
      { name: "Fresh Paneer", quantity: "30 kg", price: 280 },
      { name: "Heavy Cream", quantity: "20 Liters", price: 210 }
    ],
    quantity: "50 Units",
    amount: 12600,
    expectedDelivery: "2026-09-17",
    status: "Draft"
  },
  {
    poNumber: "PO-9026",
    supplier: "Green Valley Organics",
    date: "2026-09-15",
    items: [
      { name: "Fresh Tomato", quantity: "50 kg", price: 35 },
      { name: "Fresh Onion", quantity: "100 kg", price: 28 },
      { name: "Green Chilli", quantity: "10 kg", price: 60 }
    ],
    quantity: "160 kg",
    amount: 5150,
    expectedDelivery: "2026-09-16",
    status: "Pending"
  },
  {
    poNumber: "PO-9025",
    supplier: "Royal Agro Farms",
    date: "2026-09-14",
    items: [
      { name: "Basmati Rice", quantity: "200 kg", price: 110 },
      { name: "Atta", quantity: "100 kg", price: 42 }
    ],
    quantity: "300 kg",
    amount: 26200,
    expectedDelivery: "2026-09-17",
    status: "Approved"
  },
  {
    poNumber: "PO-9024",
    supplier: "Golden Oils Distributors",
    date: "2026-09-14",
    items: [
      { name: "Refined Cooking Oil", quantity: "100 Liters", price: 135 }
    ],
    quantity: "100 Liters",
    amount: 13500,
    expectedDelivery: "2026-09-16",
    status: "Ordered"
  },
  {
    poNumber: "PO-9023",
    supplier: "Prime Poultry & Meats",
    date: "2026-09-14",
    items: [
      { name: "Fresh Boneless Chicken", quantity: "60 kg", price: 240 },
      { name: "Fresh Mutton", quantity: "20 kg", price: 680 }
    ],
    quantity: "80 kg",
    amount: 28000,
    expectedDelivery: "2026-09-15 (Today)",
    status: "Shipped"
  },
  {
    poNumber: "PO-9022",
    supplier: "Royal Agro Farms",
    date: "2026-09-12",
    items: [
      { name: "Basmati Rice", quantity: "250 kg", price: 110 },
      { name: "Black Urad Dal", quantity: "50 kg", price: 140 }
    ],
    quantity: "300 kg",
    amount: 34500,
    expectedDelivery: "2026-09-13",
    status: "Delivered"
  },
  {
    poNumber: "PO-9021",
    supplier: "Spice Route Imports",
    date: "2026-09-10",
    items: [
      { name: "Kashmiri Chilli Powder", quantity: "20 kg", price: 450 },
      { name: "Saffron", quantity: "100 Grams", price: 9200 }
    ],
    quantity: "20.1 kg",
    amount: 18200,
    expectedDelivery: "2026-09-12",
    status: "Delivered"
  },
  {
    poNumber: "PO-9020",
    supplier: "EcoPack Hospitality Solutions",
    date: "2026-09-08",
    items: [
      { name: "Bio Containers", quantity: "500 Pcs", price: 12 }
    ],
    quantity: "500 Pcs",
    amount: 6000,
    expectedDelivery: "2026-09-11",
    status: "Cancelled"
  }
];

export const MOCK_PENDING_DELIVERIES = [
  { poNumber: "PO-9023", supplier: "Prime Poultry & Meats", eta: "Today, 4:00 PM", driver: "Ramesh (+91 99880 12345)", status: "Shipped - On Schedule" },
  { poNumber: "PO-9024", supplier: "Golden Oils Distributors", eta: "Tomorrow, 9:00 AM", driver: "Unassigned", status: "Ordered - Confirmed" },
  { poNumber: "PO-9026", supplier: "Green Valley Organics", eta: "Tomorrow, 6:00 AM", driver: "Mandi Delivery", status: "Pending Manager Approval" }
];
