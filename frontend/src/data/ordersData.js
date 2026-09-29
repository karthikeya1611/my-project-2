// Mock Orders & Sales Data for Spice Garden Restaurant
// Contains 32 realistic orders with complete itemization, financial breakdowns, and status details.

export const initialOrders = [
  {
    orderId: "ORD-9832",
    date: "2026-09-15",
    time: "07:45 PM",
    tableNumber: "Table 04",
    orderType: "Dine-in",
    customerName: "Amit Verma",
    waiterName: "Suresh Kumar",
    items: [
      { name: "Hyderabadi Chicken Dum Biryani", quantity: 2, price: 380 },
      { name: "Butter Chicken Special", quantity: 1, price: 390 },
      { name: "Butter Garlic Naan", quantity: 3, price: 70 }
    ],
    subtotal: 1360,
    tax: 68, // 5% GST
    discount: 50,
    total: 1378,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Preparing"
  },
  {
    orderId: "ORD-9831",
    date: "2026-09-15",
    time: "07:30 PM",
    tableNumber: "Takeaway-02",
    orderType: "Takeaway",
    customerName: "Neha Sharma",
    waiterName: "Counter Staff",
    items: [
      { name: "Paneer Tikka Smokey", quantity: 1, price: 280 },
      { name: "Dal Makhani Royal", quantity: 1, price: 290 },
      { name: "Tandoori Roti", quantity: 4, price: 35 }
    ],
    subtotal: 710,
    tax: 35.5,
    discount: 0,
    total: 745.5,
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    orderStatus: "Ready"
  },
  {
    orderId: "ORD-9830",
    date: "2026-09-15",
    time: "07:15 PM",
    tableNumber: "Delivery-Zomato",
    orderType: "Delivery",
    customerName: "Pooja Malhotra",
    waiterName: "Delivery Desk",
    items: [
      { name: "Masala Dosa", quantity: 2, price: 140 },
      { name: "Mango Lassi", quantity: 2, price: 120 }
    ],
    subtotal: 520,
    tax: 26,
    discount: 20,
    total: 526,
    paymentMethod: "Online",
    paymentStatus: "Paid",
    orderStatus: "Ready"
  },
  {
    orderId: "ORD-9829",
    date: "2026-09-15",
    time: "06:50 PM",
    tableNumber: "Table 12",
    orderType: "Dine-in",
    customerName: "Rahul Deshmukh",
    waiterName: "Ramesh Singh",
    items: [
      { name: "Mutton Rogan Josh", quantity: 1, price: 450 },
      { name: "Jeera Rice", quantity: 2, price: 180 },
      { name: "Butter Garlic Naan", quantity: 2, price: 70 }
    ],
    subtotal: 950,
    tax: 47.5,
    discount: 0,
    total: 997.5,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9828",
    date: "2026-09-15",
    time: "06:30 PM",
    tableNumber: "Table 07",
    orderType: "Dine-in",
    customerName: "Sandeep Kumar",
    waiterName: "Suresh Kumar",
    items: [
      { name: "Chicken 65", quantity: 1, price: 320 },
      { name: "Hyderabadi Chicken Dum Biryani", quantity: 1, price: 380 },
      { name: "Gulab Jamun with Ice Cream", quantity: 2, price: 150 }
    ],
    subtotal: 1000,
    tax: 50,
    discount: 50,
    total: 1000,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9827",
    date: "2026-09-15",
    time: "06:10 PM",
    tableNumber: "Table 03",
    orderType: "Dine-in",
    customerName: "Vikram Mehta",
    waiterName: "Ramesh Singh",
    items: [
      { name: "Palak Paneer", quantity: 1, price: 310 },
      { name: "Laccha Paratha", quantity: 3, price: 60 },
      { name: "Masala Chaas", quantity: 2, price: 70 }
    ],
    subtotal: 630,
    tax: 31.5,
    discount: 0,
    total: 661.5,
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9826",
    date: "2026-09-15",
    time: "05:45 PM",
    tableNumber: "Delivery-Swiggy",
    orderType: "Delivery",
    customerName: "Karan Gupta",
    waiterName: "Delivery Desk",
    items: [
      { name: "Butter Chicken Special", quantity: 2, price: 390 },
      { name: "Butter Garlic Naan", quantity: 4, price: 70 }
    ],
    subtotal: 1060,
    tax: 53,
    discount: 100,
    total: 1013,
    paymentMethod: "Online",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9825",
    date: "2026-09-15",
    time: "05:20 PM",
    tableNumber: "Takeaway-01",
    orderType: "Takeaway",
    customerName: "Ananya Roy",
    waiterName: "Counter Staff",
    items: [
      { name: "Chana Masala Amritsari", quantity: 1, price: 250 },
      { name: "Tandoori Roti", quantity: 3, price: 35 }
    ],
    subtotal: 355,
    tax: 17.75,
    discount: 0,
    total: 372.75,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9824",
    date: "2026-09-15",
    time: "04:50 PM",
    tableNumber: "Table 01",
    orderType: "Dine-in",
    customerName: "Deepak Sharma",
    waiterName: "Suresh Kumar",
    items: [
      { name: "South Indian Filter Coffee", quantity: 2, price: 60 },
      { name: "Masala Dosa", quantity: 1, price: 140 }
    ],
    subtotal: 260,
    tax: 13,
    discount: 0,
    total: 273,
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9823",
    date: "2026-09-15",
    time: "04:15 PM",
    tableNumber: "Table 09",
    orderType: "Dine-in",
    customerName: "Siddharth Rao",
    waiterName: "Ramesh Singh",
    items: [
      { name: "Tandoori Malai Murgh", quantity: 1, price: 360 },
      { name: "Fresh Lime Soda", quantity: 2, price: 80 }
    ],
    subtotal: 520,
    tax: 26,
    discount: 0,
    total: 546,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderStatus: "Cancelled"
  },
  {
    orderId: "ORD-9822",
    date: "2026-09-14",
    time: "09:30 PM",
    tableNumber: "Table 05",
    orderType: "Dine-in",
    customerName: "Meera Nair",
    waiterName: "Suresh Kumar",
    items: [
      { name: "Royal Veg Dum Biryani", quantity: 2, price: 310 },
      { name: "Paneer Tikka Smokey", quantity: 1, price: 280 }
    ],
    subtotal: 900,
    tax: 45,
    discount: 50,
    total: 895,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9821",
    date: "2026-09-14",
    time: "09:00 PM",
    tableNumber: "Delivery-Swiggy",
    orderType: "Delivery",
    customerName: "Rohan Kapoor",
    waiterName: "Delivery Desk",
    items: [
      { name: "Hyderabadi Chicken Dum Biryani", quantity: 3, price: 380 },
      { name: "Chicken Chettinad", quantity: 1, price: 370 }
    ],
    subtotal: 1510,
    tax: 75.5,
    discount: 100,
    total: 1485.5,
    paymentMethod: "Online",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9820",
    date: "2026-09-14",
    time: "08:30 PM",
    tableNumber: "Table 08",
    orderType: "Dine-in",
    customerName: "Priyanka Joshi",
    waiterName: "Ramesh Singh",
    items: [
      { name: "Malai Kofta", quantity: 1, price: 340 },
      { name: "Butter Garlic Naan", quantity: 2, price: 70 },
      { name: "Rasmalai Saffron", quantity: 2, price: 170 }
    ],
    subtotal: 820,
    tax: 41,
    discount: 0,
    total: 861,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9819",
    date: "2026-09-14",
    time: "08:00 PM",
    tableNumber: "Table 02",
    orderType: "Dine-in",
    customerName: "Tarun Bajaj",
    waiterName: "Suresh Kumar",
    items: [
      { name: "Kolkata Fish Fry", quantity: 2, price: 390 },
      { name: "Virgin Mojito", quantity: 2, price: 140 }
    ],
    subtotal: 1060,
    tax: 53,
    discount: 0,
    total: 1113,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9818",
    date: "2026-09-14",
    time: "07:30 PM",
    tableNumber: "Takeaway-03",
    orderType: "Takeaway",
    customerName: "Shweta Agarwal",
    waiterName: "Counter Staff",
    items: [
      { name: "Kadhai Paneer", quantity: 1, price: 330 },
      { name: "Jeera Rice", quantity: 1, price: 180 }
    ],
    subtotal: 510,
    tax: 25.5,
    discount: 0,
    total: 535.5,
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9817",
    date: "2026-09-14",
    time: "02:15 PM",
    tableNumber: "Table 06",
    orderType: "Dine-in",
    customerName: "Alok Saxena",
    waiterName: "Ramesh Singh",
    items: [
      { name: "Dal Makhani Royal", quantity: 1, price: 290 },
      { name: "Jeera Rice", quantity: 1, price: 180 },
      { name: "Tandoori Roti", quantity: 2, price: 35 }
    ],
    subtotal: 540,
    tax: 27,
    discount: 0,
    total: 567,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9816",
    date: "2026-09-14",
    time: "01:45 PM",
    tableNumber: "Delivery-Zomato",
    orderType: "Delivery",
    customerName: "Divya Reddy",
    waiterName: "Delivery Desk",
    items: [
      { name: "Butter Chicken Special", quantity: 1, price: 390 },
      { name: "Hyderabadi Chicken Dum Biryani", quantity: 1, price: 380 }
    ],
    subtotal: 770,
    tax: 38.5,
    discount: 50,
    total: 758.5,
    paymentMethod: "Online",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9815",
    date: "2026-09-14",
    time: "01:15 PM",
    tableNumber: "Table 10",
    orderType: "Dine-in",
    customerName: "Gaurav Sen",
    waiterName: "Suresh Kumar",
    items: [
      { name: "Paneer Tikka Smokey", quantity: 1, price: 280 },
      { name: "Palak Paneer", quantity: 1, price: 310 },
      { name: "Laccha Paratha", quantity: 4, price: 60 }
    ],
    subtotal: 830,
    tax: 41.5,
    discount: 0,
    total: 871.5,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9814",
    date: "2026-09-13",
    time: "09:15 PM",
    tableNumber: "Table 11",
    orderType: "Dine-in",
    customerName: "Manish Tiwari",
    waiterName: "Ramesh Singh",
    items: [
      { name: "Prawns Koliwada", quantity: 1, price: 460 },
      { name: "Mutton Rogan Josh", quantity: 1, price: 450 },
      { name: "Butter Garlic Naan", quantity: 3, price: 70 }
    ],
    subtotal: 1120,
    tax: 56,
    discount: 50,
    total: 1126,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9813",
    date: "2026-09-13",
    time: "08:40 PM",
    tableNumber: "Takeaway-04",
    orderType: "Takeaway",
    customerName: "Sonam Kulkarni",
    waiterName: "Counter Staff",
    items: [
      { name: "Masala Dosa", quantity: 3, price: 140 },
      { name: "Idli Sambar Platter", quantity: 2, price: 110 }
    ],
    subtotal: 640,
    tax: 32,
    discount: 0,
    total: 672,
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9812",
    date: "2026-09-13",
    time: "08:10 PM",
    tableNumber: "Delivery-Swiggy",
    orderType: "Delivery",
    customerName: "Harsh Vardhan",
    waiterName: "Delivery Desk",
    items: [
      { name: "Hyderabadi Chicken Dum Biryani", quantity: 2, price: 380 },
      { name: "Gulab Jamun with Ice Cream", quantity: 2, price: 150 }
    ],
    subtotal: 1060,
    tax: 53,
    discount: 60,
    total: 1053,
    paymentMethod: "Online",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9811",
    date: "2026-09-13",
    time: "07:45 PM",
    tableNumber: "Table 04",
    orderType: "Dine-in",
    customerName: "Deepika Padukone",
    waiterName: "Suresh Kumar",
    items: [
      { name: "Crispy Corn Pepper Fry", quantity: 1, price: 220 },
      { name: "Kadhai Paneer", quantity: 1, price: 330 },
      { name: "Butter Garlic Naan", quantity: 2, price: 70 }
    ],
    subtotal: 690,
    tax: 34.5,
    discount: 0,
    total: 724.5,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9810",
    date: "2026-09-13",
    time: "02:00 PM",
    tableNumber: "Table 03",
    orderType: "Dine-in",
    customerName: "Sunil Chhetri",
    waiterName: "Ramesh Singh",
    items: [
      { name: "Chicken Chettinad", quantity: 1, price: 370 },
      { name: "Jeera Rice", quantity: 1, price: 180 }
    ],
    subtotal: 550,
    tax: 27.5,
    discount: 0,
    total: 577.5,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9809",
    date: "2026-09-13",
    time: "01:30 PM",
    tableNumber: "Takeaway-02",
    orderType: "Takeaway",
    customerName: "Aditi Rao",
    waiterName: "Counter Staff",
    items: [
      { name: "Puri Bhaji", quantity: 2, price: 130 },
      { name: "Masala Chai", quantity: 2, price: 50 }
    ],
    subtotal: 360,
    tax: 18,
    discount: 0,
    total: 378,
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9808",
    date: "2026-09-12",
    time: "09:00 PM",
    tableNumber: "Table 07",
    orderType: "Dine-in",
    customerName: "Kishore Kumar",
    waiterName: "Suresh Kumar",
    items: [
      { name: "Butter Chicken Special", quantity: 2, price: 390 },
      { name: "Butter Garlic Naan", quantity: 4, price: 70 },
      { name: "Gajar Ka Halwa", quantity: 2, price: 160 }
    ],
    subtotal: 1380,
    tax: 69,
    discount: 100,
    total: 1349,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9807",
    date: "2026-09-12",
    time: "08:30 PM",
    tableNumber: "Delivery-Zomato",
    orderType: "Delivery",
    customerName: "Lata Mangeshkar",
    waiterName: "Delivery Desk",
    items: [
      { name: "Tomato Basil Shorba", quantity: 2, price: 140 },
      { name: "Dal Makhani Royal", quantity: 1, price: 290 }
    ],
    subtotal: 570,
    tax: 28.5,
    discount: 0,
    total: 598.5,
    paymentMethod: "Online",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9806",
    date: "2026-09-12",
    time: "07:50 PM",
    tableNumber: "Table 01",
    orderType: "Dine-in",
    customerName: "Mukesh Ambani",
    waiterName: "Ramesh Singh",
    items: [
      { name: "Royal Veg Dum Biryani", quantity: 3, price: 310 },
      { name: "Malai Kofta", quantity: 2, price: 340 }
    ],
    subtotal: 1610,
    tax: 80.5,
    discount: 100,
    total: 1590.5,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9805",
    date: "2026-09-12",
    time: "02:30 PM",
    tableNumber: "Takeaway-01",
    orderType: "Takeaway",
    customerName: "Ratan Tata",
    waiterName: "Counter Staff",
    items: [
      { name: "Masala Dosa", quantity: 2, price: 140 },
      { name: "South Indian Filter Coffee", quantity: 2, price: 60 }
    ],
    subtotal: 400,
    tax: 20,
    discount: 0,
    total: 420,
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9804",
    date: "2026-09-11",
    time: "09:40 PM",
    tableNumber: "Table 05",
    orderType: "Dine-in",
    customerName: "Aiswarya Rai",
    waiterName: "Suresh Kumar",
    items: [
      { name: "Mutton Rogan Josh", quantity: 1, price: 450 },
      { name: "Butter Garlic Naan", quantity: 2, price: 70 }
    ],
    subtotal: 590,
    tax: 29.5,
    discount: 0,
    total: 619.5,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderStatus: "Cancelled"
  },
  {
    orderId: "ORD-9803",
    date: "2026-09-11",
    time: "08:15 PM",
    tableNumber: "Delivery-Swiggy",
    orderType: "Delivery",
    customerName: "Shah Rukh Khan",
    waiterName: "Delivery Desk",
    items: [
      { name: "Hyderabadi Chicken Dum Biryani", quantity: 4, price: 380 },
      { name: "Chicken 65", quantity: 2, price: 320 }
    ],
    subtotal: 2160,
    tax: 108,
    discount: 200,
    total: 2068,
    paymentMethod: "Online",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9802",
    date: "2026-09-11",
    time: "01:20 PM",
    tableNumber: "Table 12",
    orderType: "Dine-in",
    customerName: "Virat Kohli",
    waiterName: "Ramesh Singh",
    items: [
      { name: "Palak Paneer", quantity: 1, price: 310 },
      { name: "Aloo Gobi Adraki", quantity: 1, price: 240 },
      { name: "Tandoori Roti", quantity: 4, price: 35 }
    ],
    subtotal: 690,
    tax: 34.5,
    discount: 0,
    total: 724.5,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  },
  {
    orderId: "ORD-9801",
    date: "2026-09-11",
    time: "12:45 PM",
    tableNumber: "Table 08",
    orderType: "Dine-in",
    customerName: "Sachin Tendulkar",
    waiterName: "Suresh Kumar",
    items: [
      { name: "Hyderabadi Chicken Dum Biryani", quantity: 2, price: 380 },
      { name: "Mango Lassi", quantity: 2, price: 120 }
    ],
    subtotal: 1000,
    tax: 50,
    discount: 50,
    total: 1000,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Completed"
  }
];

export const MOCK_RECENT_ORDERS = initialOrders;

