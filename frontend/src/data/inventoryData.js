// Mock Inventory Data for Spice Garden Restaurant
// Contains 34 realistic raw ingredients, stock movements, and batch expiry tracking.

export const initialIngredients = [
  // Grains & Pulses
  { id: "ING001", name: "Basmati Rice", category: "Grains", currentStock: 250, unit: "kg", minimumStock: 50, maximumStock: 500, purchasePrice: 110, supplier: "Royal Agro Farms", expiryDate: "2027-01-15", batchNumber: "B-RICE-901" },
  { id: "ING002", name: "Raw Rice", category: "Grains", currentStock: 180, unit: "kg", minimumStock: 40, maximumStock: 400, purchasePrice: 65, supplier: "Royal Agro Farms", expiryDate: "2026-12-30", batchNumber: "B-RICE-880" },
  { id: "ING003", name: "Black Urad Dal", category: "Pulses", currentStock: 80, unit: "kg", minimumStock: 20, maximumStock: 200, purchasePrice: 140, supplier: "Royal Agro Farms", expiryDate: "2026-11-20", batchNumber: "B-DAL-402" },

  // Poultry & Meat
  { id: "ING004", name: "Fresh Chicken", category: "Meat & Poultry", currentStock: 45, unit: "kg", minimumStock: 25, maximumStock: 100, purchasePrice: 240, supplier: "Prime Poultry & Meats", expiryDate: "2026-09-17", batchNumber: "B-CHK-104" },
  { id: "ING005", name: "Fresh Mutton", category: "Meat & Poultry", currentStock: 18, unit: "kg", minimumStock: 20, maximumStock: 60, purchasePrice: 680, supplier: "Prime Poultry & Meats", expiryDate: "2026-09-16", batchNumber: "B-MUT-209" },

  // Dairy
  { id: "ING006", name: "Fresh Paneer", category: "Dairy", currentStock: 12, unit: "kg", minimumStock: 20, maximumStock: 50, purchasePrice: 280, supplier: "Fresh Dairy Co.", expiryDate: "2026-09-18", batchNumber: "B-PAN-302" },
  { id: "ING007", name: "Fresh Milk", category: "Dairy", currentStock: 40, unit: "Liters", minimumStock: 30, maximumStock: 100, purchasePrice: 55, supplier: "Fresh Dairy Co.", expiryDate: "2026-09-15", batchNumber: "B-MLK-501" },
  { id: "ING008", name: "Fresh Curd (Dahi)", category: "Dairy", currentStock: 25, unit: "kg", minimumStock: 15, maximumStock: 60, purchasePrice: 60, supplier: "Fresh Dairy Co.", expiryDate: "2026-09-16", batchNumber: "B-CRD-102" },
  { id: "ING009", name: "Pure Butter", category: "Dairy", currentStock: 15, unit: "kg", minimumStock: 10, maximumStock: 40, purchasePrice: 480, supplier: "Fresh Dairy Co.", expiryDate: "2026-10-10", batchNumber: "B-BUT-889" },
  { id: "ING010", name: "Processed Cheese", category: "Dairy", currentStock: 8, unit: "kg", minimumStock: 5, maximumStock: 25, purchasePrice: 420, supplier: "Fresh Dairy Co.", expiryDate: "2026-11-05", batchNumber: "B-CHS-771" },
  { id: "ING011", name: "Pure Cow Ghee", category: "Oils & Dairy", currentStock: 60, unit: "Liters", minimumStock: 15, maximumStock: 120, purchasePrice: 650, supplier: "Fresh Dairy Co.", expiryDate: "2027-03-15", batchNumber: "B-GHE-990" },

  // Vegetables & Produce
  { id: "ING012", name: "Fresh Tomato", category: "Produce", currentStock: 5, unit: "kg", minimumStock: 25, maximumStock: 100, purchasePrice: 35, supplier: "Green Valley Organics", expiryDate: "2026-09-14", batchNumber: "B-TOM-001" },
  { id: "ING013", name: "Fresh Onion", category: "Produce", currentStock: 120, unit: "kg", minimumStock: 40, maximumStock: 300, purchasePrice: 28, supplier: "Green Valley Organics", expiryDate: "2026-10-01", batchNumber: "B-ONI-002" },
  { id: "ING014", name: "Fresh Potato", category: "Produce", currentStock: 95, unit: "kg", minimumStock: 30, maximumStock: 200, purchasePrice: 22, supplier: "Green Valley Organics", expiryDate: "2026-10-15", batchNumber: "B-POT-003" },
  { id: "ING015", name: "Fresh Carrot", category: "Produce", currentStock: 18, unit: "kg", minimumStock: 10, maximumStock: 50, purchasePrice: 40, supplier: "Green Valley Organics", expiryDate: "2026-09-20", batchNumber: "B-CAR-004" },
  { id: "ING016", name: "Green Capsicum", category: "Produce", currentStock: 14, unit: "kg", minimumStock: 10, maximumStock: 40, purchasePrice: 50, supplier: "Green Valley Organics", expiryDate: "2026-09-18", batchNumber: "B-CAP-005" },
  { id: "ING017", name: "Fresh Cabbage", category: "Produce", currentStock: 12, unit: "kg", minimumStock: 8, maximumStock: 30, purchasePrice: 25, supplier: "Green Valley Organics", expiryDate: "2026-09-19", batchNumber: "B-CAB-006" },
  { id: "ING018", name: "Fresh Cauliflower", category: "Produce", currentStock: 15, unit: "kg", minimumStock: 10, maximumStock: 35, purchasePrice: 30, supplier: "Green Valley Organics", expiryDate: "2026-09-17", batchNumber: "B-CAU-007" },
  { id: "ING019", name: "Green Chilli", category: "Produce", currentStock: 4, unit: "kg", minimumStock: 5, maximumStock: 20, purchasePrice: 60, supplier: "Green Valley Organics", expiryDate: "2026-09-17", batchNumber: "B-GCH-008" },

  // Herbs & Aromatics
  { id: "ING020", name: "Fresh Ginger", category: "Herbs & Spices", currentStock: 10, unit: "kg", minimumStock: 5, maximumStock: 25, purchasePrice: 120, supplier: "Green Valley Organics", expiryDate: "2026-09-25", batchNumber: "B-GIN-009" },
  { id: "ING021", name: "Fresh Garlic", category: "Herbs & Spices", currentStock: 15, unit: "kg", minimumStock: 8, maximumStock: 30, purchasePrice: 160, supplier: "Green Valley Organics", expiryDate: "2026-10-05", batchNumber: "B-GAR-010" },
  { id: "ING022", name: "Fresh Coriander", category: "Herbs & Spices", currentStock: 2, unit: "kg", minimumStock: 5, maximumStock: 15, purchasePrice: 40, supplier: "Green Valley Organics", expiryDate: "2026-09-15", batchNumber: "B-COR-011" },
  { id: "ING023", name: "Fresh Mint", category: "Herbs & Spices", currentStock: 3, unit: "kg", minimumStock: 4, maximumStock: 12, purchasePrice: 45, supplier: "Green Valley Organics", expiryDate: "2026-09-16", batchNumber: "B-MNT-012" },

  // Oils & Flours
  { id: "ING024", name: "Refined Cooking Oil", category: "Oils", currentStock: 120, unit: "Liters", minimumStock: 40, maximumStock: 300, purchasePrice: 135, supplier: "Golden Oils Distributors", expiryDate: "2027-04-01", batchNumber: "B-OIL-550" },
  { id: "ING025", name: "Whole Wheat Flour (Atta)", category: "Flour", currentStock: 180, unit: "kg", minimumStock: 40, maximumStock: 400, purchasePrice: 42, supplier: "Royal Agro Farms", expiryDate: "2026-12-10", batchNumber: "B-ATT-332" },
  { id: "ING026", name: "Refined Maida", category: "Flour", currentStock: 90, unit: "kg", minimumStock: 30, maximumStock: 200, purchasePrice: 38, supplier: "Royal Agro Farms", expiryDate: "2026-12-15", batchNumber: "B-MAI-221" },

  // Condiments & Ground Spices
  { id: "ING027", name: "White Sugar", category: "Pantry", currentStock: 65, unit: "kg", minimumStock: 20, maximumStock: 150, purchasePrice: 45, supplier: "Royal Agro Farms", expiryDate: "2027-08-01", batchNumber: "B-SUG-110" },
  { id: "ING028", name: "Iodized Salt", category: "Pantry", currentStock: 50, unit: "kg", minimumStock: 15, maximumStock: 100, purchasePrice: 20, supplier: "Royal Agro Farms", expiryDate: "2028-01-01", batchNumber: "B-SLT-001" },
  { id: "ING029", name: "Turmeric Powder", category: "Spices", currentStock: 20, unit: "kg", minimumStock: 5, maximumStock: 40, purchasePrice: 180, supplier: "Spice Route Imports", expiryDate: "2027-05-10", batchNumber: "B-TUR-401" },
  { id: "ING030", name: "Kashmiri Chilli Powder", category: "Spices", currentStock: 25, unit: "kg", minimumStock: 5, maximumStock: 50, purchasePrice: 450, supplier: "Spice Route Imports", expiryDate: "2027-06-30", batchNumber: "B-CHL-502" },
  { id: "ING031", name: "Garam Masala Mix", category: "Spices", currentStock: 12, unit: "kg", minimumStock: 4, maximumStock: 30, purchasePrice: 520, supplier: "Spice Route Imports", expiryDate: "2027-03-20", batchNumber: "B-GAR-603" },
  { id: "ING032", name: "Cumin Seeds (Jeera)", category: "Spices", currentStock: 18, unit: "kg", minimumStock: 5, maximumStock: 40, purchasePrice: 380, supplier: "Spice Route Imports", expiryDate: "2027-04-15", batchNumber: "B-JEE-704" },
  { id: "ING033", name: "Green Cardamom (Elaichi)", category: "Spices", currentStock: 3, unit: "kg", minimumStock: 1, maximumStock: 10, purchasePrice: 2800, supplier: "Spice Route Imports", expiryDate: "2027-09-01", batchNumber: "B-ELA-805" },
  { id: "ING034", name: "Cloves (Laung)", category: "Spices", currentStock: 4, unit: "kg", minimumStock: 1, maximumStock: 10, purchasePrice: 1200, supplier: "Spice Route Imports", expiryDate: "2027-08-15", batchNumber: "B-CLO-906" }
];

export const MOCK_STOCK_MOVEMENTS = [
  { id: "MOV-101", ingredient: "Basmati Rice", type: "Purchase", quantity: "+100 kg", source: "PO #PO-9022", date: "2026-09-15 10:30 AM", user: "Admin (Suresh)" },
  { id: "MOV-102", ingredient: "Fresh Chicken", type: "Consumption", quantity: "-20 kg", source: "Kitchen Requisition", date: "2026-09-15 11:15 AM", user: "Chef Ramesh" },
  { id: "MOV-103", ingredient: "Fresh Tomato", type: "Wastage", quantity: "-3 kg", source: "Spoilage Log #W-104", date: "2026-09-14 09:00 PM", user: "Chef Ramesh" },
  { id: "MOV-104", ingredient: "Refined Cooking Oil", type: "Purchase", quantity: "+50 Liters", source: "PO #PO-9021", date: "2026-09-13 02:00 PM", user: "Store Manager" },
  { id: "MOV-105", ingredient: "Paneer", type: "Return", quantity: "-2 kg", source: "Vendor Return #RET-04", date: "2026-09-12 04:30 PM", user: "Store Manager" },
  { id: "MOV-106", ingredient: "Wheat Flour", type: "Adjustment", quantity: "+5 kg", source: "Physical Stock Audit", date: "2026-09-11 08:00 AM", user: "Admin (Suresh)" }
];

export const MOCK_EXPIRY_ITEMS = [
  // Expired
  { id: "EXP001", ingredient: "Fresh Tomato", batch: "B-TOM-001", quantity: "5 kg", expiryDate: "2026-09-14", category: "Expired" },
  // Expiring Today
  { id: "EXP002", ingredient: "Fresh Milk", batch: "B-MLK-501", quantity: "40 Liters", expiryDate: "2026-09-15", category: "Expiring Today" },
  { id: "EXP003", ingredient: "Fresh Coriander", batch: "B-COR-011", quantity: "2 kg", expiryDate: "2026-09-15", category: "Expiring Today" },
  // Expiring within 3 days
  { id: "EXP004", ingredient: "Fresh Mutton", batch: "B-MUT-209", quantity: "18 kg", expiryDate: "2026-09-16", category: "Expiring within 3 days" },
  { id: "EXP005", ingredient: "Fresh Curd (Dahi)", batch: "B-CRD-102", quantity: "25 kg", expiryDate: "2026-09-16", category: "Expiring within 3 days" },
  { id: "EXP006", ingredient: "Fresh Mint", batch: "B-MNT-012", quantity: "3 kg", expiryDate: "2026-09-16", category: "Expiring within 3 days" },
  // Expiring within 7 days
  { id: "EXP007", ingredient: "Fresh Chicken", batch: "B-CHK-104", quantity: "45 kg", expiryDate: "2026-09-17", category: "Expiring within 7 days" },
  { id: "EXP008", ingredient: "Fresh Paneer", batch: "B-PAN-302", quantity: "12 kg", expiryDate: "2026-09-18", category: "Expiring within 7 days" },
  { id: "EXP009", ingredient: "Green Capsicum", batch: "B-CAP-005", quantity: "14 kg", expiryDate: "2026-09-18", category: "Expiring within 7 days" }
];
