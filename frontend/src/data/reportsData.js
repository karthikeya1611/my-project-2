// Mock Manager Reports & Financial Data for Spice Garden Restaurant

export const MOCK_SALES_7_DAYS = [
  { day: "Mon", sales: 42000, orders: 110 },
  { day: "Tue", sales: 45500, orders: 124 },
  { day: "Wed", sales: 38900, orders: 98 },
  { day: "Thu", sales: 48200, orders: 135 },
  { day: "Fri", sales: 62500, orders: 178 },
  { day: "Sat", sales: 78000, orders: 215 },
  { day: "Sun", sales: 71400, orders: 194 }
];

export const MOCK_CATEGORY_SALES = [
  { name: "Rice & Biryani", value: 38 },
  { name: "Main Course", value: 24 },
  { name: "Starters", value: 16 },
  { name: "Beverages", value: 12 },
  { name: "Desserts", value: 10 }
];

export const MOCK_MANAGER_REPORTS = [
  {
    id: "MGR-REP-2026-W37",
    managerName: "Ramesh Sharma (General Manager)",
    reportDate: "2026-09-14",
    reportPeriod: "Sept 07 - Sept 13, 2026",
    revenue: 386500,
    orders: 1054,
    foodWaste: 14200,
    topDish: "Hyderabadi Chicken Dum Biryani",
    lowestPerformingDish: "Aloo Gobi Adraki",
    majorIssues: "Peak weekend wait times reached 35 mins due to tandoori station bottleneck.",
    recommendations: "Add a second tandoor chef during Friday-Sunday dinner shifts.",
    remarks: "Overall customer rating reached 9.4/10. Kitchen efficiency up 8%.",
    type: "Current"
  },
  {
    id: "MGR-REP-2026-W36",
    managerName: "Ramesh Sharma (General Manager)",
    reportDate: "2026-09-07",
    reportPeriod: "Aug 31 - Sept 06, 2026",
    revenue: 362000,
    orders: 980,
    foodWaste: 16500,
    topDish: "Butter Chicken Special",
    lowestPerformingDish: "Hot Green Tea Honey",
    majorIssues: "Spinach spoilage during heavy monsoon rains.",
    recommendations: "Shift to daily produce deliveries with Green Valley Organics.",
    remarks: "Supplier lead times were respected 98% of the time.",
    type: "Current"
  },
  {
    id: "MGR-REP-2026-Q2",
    managerName: "Suresh Kumar (Former Manager)",
    reportDate: "2026-07-01",
    reportPeriod: "Q2 2026 (Apr - Jun)",
    revenue: 4520000,
    orders: 12400,
    foodWaste: 185000,
    topDish: "Hyderabadi Chicken Dum Biryani",
    lowestPerformingDish: "Green Garden Salad",
    majorIssues: "High summer electricity utility costs for walk-in freezers.",
    recommendations: "Service all compressor units before peak summer months.",
    remarks: "Quarterly net profit margin maintained at 24.5%.",
    type: "Archived"
  },
  {
    id: "MGR-REP-2026-Q1",
    managerName: "Suresh Kumar (Former Manager)",
    reportDate: "2026-04-01",
    reportPeriod: "Q1 2026 (Jan - Mar)",
    revenue: 4180000,
    orders: 11200,
    foodWaste: 172000,
    topDish: "Butter Chicken Special",
    lowestPerformingDish: "Hot Chocolate Supreme",
    majorIssues: "Shortage of export-grade Basmati rice in local market.",
    recommendations: "Enter 6-month contract with Royal Agro Farms for fixed pricing.",
    remarks: "Contract finalized saving ₹12,000 monthly.",
    type: "Archived"
  }
];
