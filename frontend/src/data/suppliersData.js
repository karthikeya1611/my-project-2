// Mock Suppliers Data for Spice Garden Restaurant
// Contains 8 realistic suppliers with contact, address, lead time, and rating out of 10.

export const initialSuppliers = [
  {
    id: "SUP-01",
    name: "Royal Agro Farms",
    category: "Grains & Pulses",
    contact: { phone: "+91 98230 11223", email: "sales@royalagro.com" },
    address: "Plot 45, APMC Market Yard, Navi Mumbai, MH 400705",
    products: ["Basmati Rice", "Raw Rice", "Wheat Flour (Atta)", "Maida", "Black Urad Dal", "Sugar", "Salt"],
    leadTime: "1-2 Days",
    rating: 9.6, // out of 10
    onTimeDeliveryRate: "98%",
    activeOrders: 1,
    status: "Active"
  },
  {
    id: "SUP-02",
    name: "Fresh Dairy Co.",
    category: "Dairy & Milk Products",
    contact: { phone: "+91 97110 44556", email: "orders@freshdairy.in" },
    address: "Dairy Circle, Industrial Area, Outer Ring Road, BLR 560029",
    products: ["Paneer", "Milk", "Curd (Dahi)", "Butter", "Cheese", "Cow Ghee"],
    leadTime: "Same Day (4 Hours)",
    rating: 9.1,
    onTimeDeliveryRate: "94%",
    activeOrders: 2,
    status: "Active"
  },
  {
    id: "SUP-03",
    name: "Prime Poultry & Meats",
    category: "Fresh Meat & Poultry",
    contact: { phone: "+91 98990 77889", email: "primepoultry@gmail.com" },
    address: "Wholesale Meat Complex, Shivaji Nagar, BLR 560051",
    products: ["Fresh Boneless Chicken", "Whole Chicken", "Fresh Mutton Chunks"],
    leadTime: "Daily Morning (6:00 AM)",
    rating: 9.8,
    onTimeDeliveryRate: "99%",
    activeOrders: 1,
    status: "Active"
  },
  {
    id: "SUP-04",
    name: "Green Valley Organics",
    category: "Fresh Vegetables & Herbs",
    contact: { phone: "+91 94450 33221", email: "supplies@greenvalley.co.in" },
    address: "KR Market Vegetable Mandi, Shop 12, BLR 560002",
    products: ["Tomato", "Onion", "Potato", "Carrot", "Capsicum", "Cabbage", "Cauliflower", "Green Chilli", "Ginger", "Garlic", "Coriander", "Mint"],
    leadTime: "Daily Morning (5:00 AM)",
    rating: 9.3,
    onTimeDeliveryRate: "96%",
    activeOrders: 1,
    status: "Active"
  },
  {
    id: "SUP-05",
    name: "Spice Route Imports",
    category: "Exotic Spices & Condiments",
    contact: { phone: "+91 98100 55443", email: "info@spiceroute.com" },
    address: "Spice Bazaar, Avenue Road, BLR 560002",
    products: ["Turmeric Powder", "Kashmiri Red Chilli", "Garam Masala", "Cumin Seeds", "Cardamom", "Cloves"],
    leadTime: "2-3 Days",
    rating: 8.8,
    onTimeDeliveryRate: "91%",
    activeOrders: 0,
    status: "Active"
  },
  {
    id: "SUP-06",
    name: "Golden Oils Distributors",
    category: "Cooking Oils & Fats",
    contact: { phone: "+91 93320 88112", email: "orders@goldenoils.com" },
    address: "Oil Traders Colony, Peenya 2nd Stage, BLR 560058",
    products: ["Refined Cooking Oil", "Sunflower Oil", "Mustard Oil"],
    leadTime: "1 Day",
    rating: 9.2,
    onTimeDeliveryRate: "95%",
    activeOrders: 1,
    status: "Active"
  },
  {
    id: "SUP-07",
    name: "Coastal Catch Seafood",
    category: "Fresh Fish & Prawns",
    contact: { phone: "+91 98450 66778", email: "sales@coastalcatch.in" },
    address: "Russell Market Fish Yard, BLR 560051",
    products: ["Bhetki Fillet", "Tiger Prawns", "Kingfish Slices"],
    leadTime: "Daily Morning (6:30 AM)",
    rating: 9.5,
    onTimeDeliveryRate: "97%",
    activeOrders: 0,
    status: "Active"
  },
  {
    id: "SUP-08",
    name: "EcoPack Hospitality Solutions",
    category: "Packaging & Utensils",
    contact: { phone: "+91 99001 22334", email: "ecopack@hospitality.com" },
    address: "Bomanahalli Industrial Hub, BLR 560068",
    products: ["Bio Meal Boxes", "Food Containers", "Tissue Napkins", "Cutlery Sets"],
    leadTime: "3-4 Days",
    rating: 8.9,
    onTimeDeliveryRate: "92%",
    activeOrders: 1,
    status: "Active"
  }
];

export const MOCK_SUPPLIER_HISTORY = [
  { id: "HIS-01", supplierName: "Prime Poultry & Meats", poNumber: "PO-9023", amount: 27900, deliveryDate: "2026-09-15", status: "Delivered On-time", qualityScore: "10.0 / 10" },
  { id: "HIS-02", supplierName: "Fresh Dairy Co.", poNumber: "PO-9024", amount: 14500, deliveryDate: "2026-09-15", status: "Delivered On-time", qualityScore: "9.5 / 10" },
  { id: "HIS-03", supplierName: "Royal Agro Farms", poNumber: "PO-9022", amount: 32500, deliveryDate: "2026-09-13", status: "Delivered On-time", qualityScore: "9.8 / 10" },
  { id: "HIS-04", supplierName: "Spice Route Imports", poNumber: "PO-9021", amount: 18200, deliveryDate: "2026-09-10", status: "Delivered On-time", qualityScore: "8.8 / 10" },
  { id: "HIS-05", supplierName: "Green Valley Organics", poNumber: "PO-9019", amount: 9800, deliveryDate: "2026-09-08", status: "Delivered On-time", qualityScore: "9.3 / 10" }
];
