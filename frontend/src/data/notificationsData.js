// Mock Notifications Data for Spice Garden Restaurant

export const initialNotifications = [
  {
    id: "NOT-01",
    type: "Low Stock",
    title: "Low Stock Warning",
    message: "Fresh Cottage Cheese (Paneer) stock is down to 12kg (Threshold: 20kg).",
    time: "15 mins ago",
    isRead: false
  },
  {
    id: "NOT-02",
    type: "Expiry",
    title: "Batch Expiry Alert",
    message: "Batch B-TOM-001 of Fresh Tomato has expired today (5 kg).",
    time: "1 hour ago",
    isRead: false
  },
  {
    id: "NOT-03",
    type: "Supplier Delivery",
    title: "Delivery In-Transit",
    message: "PO #PO-9023 from Prime Poultry is in transit, expected at 4:00 PM.",
    time: "2 hours ago",
    isRead: false
  },
  {
    id: "NOT-04",
    type: "Purchase Order",
    title: "PO Approval Requisition",
    message: "PO #PO-9026 for Green Valley Organics requires manager sign-off.",
    time: "3 hours ago",
    isRead: true
  },
  {
    id: "NOT-05",
    type: "Waste Alert",
    title: "High Waste Recorded",
    message: "Chef Ramesh logged 4.0 kg Cooked Biryani Rice surplus (₹1,200 loss).",
    time: "Yesterday",
    isRead: true
  },
  {
    id: "NOT-06",
    type: "System",
    title: "Monthly Audit Ready",
    message: "August 2026 Executive Business Report has been generated successfully.",
    time: "2 days ago",
    isRead: true
  }
];
