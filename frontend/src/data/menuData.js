// Mock Menu Data for Spice Garden Restaurant
// Contains 42 realistic dishes across 13 categories with ratings out of 10

export const MENU_CATEGORIES = [
  "All",
  "Breakfast",
  "Starters",
  "Soups",
  "Main Course",
  "Rice & Biryani",
  "Indian Breads",
  "Curries",
  "Vegetarian",
  "Non-Vegetarian",
  "Sides",
  "Desserts",
  "Beverages",
  "Hot Drinks"
];

export const initialMenuItems = [
  // Breakfast
  {
    id: "M001",
    name: "Masala Dosa",
    category: "Breakfast",
    description: "Crispy fermented rice & lentil crepe stuffed with spiced potato filling, served with coconut chutney & sambar.",
    price: 140,
    rating: 9.6,
    numberOfRatings: 340,
    availability: "In Stock",
    preparationTime: "15 mins",
    popularity: "High",
    ingredients: ["Rice", "Urad Dal", "Potatoes", "Mustard Seeds", "Curry Leaves"]
  },
  {
    id: "M002",
    name: "Idli Sambar Platter",
    category: "Breakfast",
    description: "Steamed rice cakes served with hot lentil soup and three varieties of artisanal chutneys.",
    price: 110,
    rating: 9.2,
    numberOfRatings: 215,
    availability: "In Stock",
    preparationTime: "10 mins",
    popularity: "High",
    ingredients: ["Rice", "Urad Dal", "Toor Dal", "Mixed Vegetables", "Coconut"]
  },
  {
    id: "M003",
    name: "Puri Bhaji",
    category: "Breakfast",
    description: "Deep-fried golden whole wheat bread served with tangy yellow potato gravy.",
    price: 130,
    rating: 8.8,
    numberOfRatings: 180,
    availability: "In Stock",
    preparationTime: "15 mins",
    popularity: "Medium",
    ingredients: ["Whole Wheat Flour", "Potatoes", "Turmeric", "Green Chillies"]
  },

  // Starters
  {
    id: "M004",
    name: "Paneer Tikka Smokey",
    category: "Starters",
    description: "Cubes of fresh cottage cheese marinated in spiced yogurt & chargrilled in clay tandoor.",
    price: 280,
    rating: 9.5,
    numberOfRatings: 410,
    availability: "In Stock",
    preparationTime: "20 mins",
    popularity: "High",
    ingredients: ["Paneer", "Yogurt", "Kashmiri Red Chilli", "Garam Masala", "Capsicum"]
  },
  {
    id: "M005",
    name: "Chicken 65",
    category: "Starters",
    description: "Spicy, deep-fried chicken bites tossed with curry leaves, garlic, and southern spices.",
    price: 320,
    rating: 9.4,
    numberOfRatings: 520,
    availability: "In Stock",
    preparationTime: "20 mins",
    popularity: "High",
    ingredients: ["Chicken", "Curry Leaves", "Garlic", "Cornstarch", "Red Chilli Paste"]
  },
  {
    id: "M006",
    name: "Crispy Corn Pepper Fry",
    category: "Starters",
    description: "Sweet corn kernels crispy fried and tossed with cracked black pepper and fresh scallions.",
    price: 220,
    rating: 8.9,
    numberOfRatings: 145,
    availability: "In Stock",
    preparationTime: "15 mins",
    popularity: "Medium",
    ingredients: ["Sweet Corn", "Black Pepper", "Spring Onion", "Capsicum"]
  },
  {
    id: "M007",
    name: "Tandoori Malai Murgh",
    category: "Starters",
    description: "Succulent chicken drumsticks marinated in cream, cashew paste, and green cardamom.",
    price: 360,
    rating: 9.7,
    numberOfRatings: 290,
    availability: "In Stock",
    preparationTime: "25 mins",
    popularity: "High",
    ingredients: ["Chicken Leg", "Heavy Cream", "Cashew Paste", "Cardamom"]
  },

  // Soups
  {
    id: "M008",
    name: "Hot & Sour Chicken Soup",
    category: "Soups",
    description: "Zesty dark broth loaded with shredded chicken, bamboo shoots, and mushrooms.",
    price: 160,
    rating: 8.7,
    numberOfRatings: 110,
    availability: "In Stock",
    preparationTime: "12 mins",
    popularity: "Medium",
    ingredients: ["Chicken Broth", "Chicken Shreds", "Egg", "Vinegar", "Soy Sauce"]
  },
  {
    id: "M009",
    name: "Tomato Basil Shorba",
    category: "Soups",
    description: "Rich Indian style roasted tomato soup infused with coriander root and fresh basil.",
    price: 140,
    rating: 9.0,
    numberOfRatings: 130,
    availability: "In Stock",
    preparationTime: "12 mins",
    popularity: "Medium",
    ingredients: ["Ripe Tomatoes", "Fresh Basil", "Coriander Stem", "Cumin"]
  },

  // Main Course
  {
    id: "M010",
    name: "Butter Chicken Special",
    category: "Main Course",
    description: "Tandoori chicken simmered in a velvety smooth tomato, butter, and cashew cream sauce.",
    price: 390,
    rating: 9.8,
    numberOfRatings: 850,
    availability: "In Stock",
    preparationTime: "25 mins",
    popularity: "High",
    ingredients: ["Chicken", "Butter", "Fresh Cream", "Tomatoes", "Cashew"]
  },
  {
    id: "M011",
    name: "Dal Makhani Royal",
    category: "Main Course",
    description: "Black lentils slow-cooked overnight with white butter, cream, and aromatic spices.",
    price: 290,
    rating: 9.7,
    numberOfRatings: 670,
    availability: "In Stock",
    preparationTime: "20 mins",
    popularity: "High",
    ingredients: ["Black Urad Dal", "Rajma", "Butter", "Cream", "Kasturi Methi"]
  },
  {
    id: "M012",
    name: "Kadhai Paneer",
    category: "Main Course",
    description: "Paneer cubes tossed with bell peppers, onions, and coarse hand-ground kadhai spices.",
    price: 330,
    rating: 9.3,
    numberOfRatings: 410,
    availability: "In Stock",
    preparationTime: "20 mins",
    popularity: "High",
    ingredients: ["Paneer", "Bell Peppers", "Onion", "Kadhai Spice Mix", "Tomatoes"]
  },

  // Rice & Biryani
  {
    id: "M013",
    name: "Hyderabadi Chicken Dum Biryani",
    category: "Rice & Biryani",
    description: "Long-grain basmati rice layered with marinated chicken, saffron, and caramelized onions, dum cooked.",
    price: 380,
    rating: 9.9,
    numberOfRatings: 1120,
    availability: "In Stock",
    preparationTime: "25 mins",
    popularity: "High",
    ingredients: ["Basmati Rice", "Chicken", "Saffron", "Fried Onions", "Mint", "Ghee"]
  },
  {
    id: "M014",
    name: "Royal Veg Dum Biryani",
    category: "Rice & Biryani",
    description: "Fragrant basmati rice layered with garden fresh vegetables, cottage cheese, and rose water.",
    price: 310,
    rating: 9.1,
    numberOfRatings: 380,
    availability: "In Stock",
    preparationTime: "20 mins",
    popularity: "Medium",
    ingredients: ["Basmati Rice", "Paneer", "Carrots", "Beans", "Peas", "Saffron"]
  },
  {
    id: "M015",
    name: "Jeera Rice",
    category: "Rice & Biryani",
    description: "Aromatic basmati rice tempered with toasted cumin seeds and fresh coriander.",
    price: 180,
    rating: 8.9,
    numberOfRatings: 230,
    availability: "In Stock",
    preparationTime: "12 mins",
    popularity: "Medium",
    ingredients: ["Basmati Rice", "Cumin Seeds", "Ghee", "Coriander"]
  },

  // Indian Breads
  {
    id: "M016",
    name: "Butter Garlic Naan",
    category: "Indian Breads",
    description: "Leavened flatbread brushed with minced garlic, fresh cilantro, and melted butter.",
    price: 70,
    rating: 9.6,
    numberOfRatings: 790,
    availability: "In Stock",
    preparationTime: "8 mins",
    popularity: "High",
    ingredients: ["Refined Flour", "Garlic", "Butter", "Coriander"]
  },
  {
    id: "M017",
    name: "Tandoori Roti",
    category: "Indian Breads",
    description: "Whole wheat flatbread baked fresh in traditional clay oven.",
    price: 35,
    rating: 8.8,
    numberOfRatings: 610,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "High",
    ingredients: ["Whole Wheat Flour", "Water"]
  },
  {
    id: "M018",
    name: "Laccha Paratha",
    category: "Indian Breads",
    description: "Multi-layered flaky wheat bread brushed with clarified butter.",
    price: 60,
    rating: 9.2,
    numberOfRatings: 340,
    availability: "In Stock",
    preparationTime: "8 mins",
    popularity: "Medium",
    ingredients: ["Whole Wheat Flour", "Ghee"]
  },

  // Curries
  {
    id: "M019",
    name: "Mutton Rogan Josh",
    category: "Curries",
    description: "Tender lamb chunks braised in rich gravy infused with Kashmiri red chillies and alkanet root.",
    price: 450,
    rating: 9.7,
    numberOfRatings: 430,
    availability: "In Stock",
    preparationTime: "30 mins",
    popularity: "High",
    ingredients: ["Mutton", "Kashmiri Chilli", "Fennel Powder", "Yogurt", "Mustard Oil"]
  },
  {
    id: "M020",
    name: "Goan Fish Curry",
    category: "Curries",
    description: "Fresh coastal fish simmered in tangy coconut, tamarind, and Kashmiri red spice curry.",
    price: 420,
    rating: 9.4,
    numberOfRatings: 280,
    availability: "Out of Stock",
    preparationTime: "25 mins",
    popularity: "Medium",
    ingredients: ["Kingfish", "Coconut Milk", "Tamarind", "Kokum", "Curry Leaves"]
  },

  // Vegetarian
  {
    id: "M021",
    name: "Palak Paneer",
    category: "Vegetarian",
    description: "Cottage cheese cubes cooked in spiced creamy spinach puree.",
    price: 310,
    rating: 9.2,
    numberOfRatings: 390,
    availability: "In Stock",
    preparationTime: "18 mins",
    popularity: "High",
    ingredients: ["Paneer", "Fresh Spinach", "Garlic", "Cream", "Butter"]
  },
  {
    id: "M022",
    name: "Malai Kofta",
    category: "Vegetarian",
    description: "Fried cottage cheese & potato dumplings served in a rich cashew saffron gravy.",
    price: 340,
    rating: 9.5,
    numberOfRatings: 310,
    availability: "In Stock",
    preparationTime: "22 mins",
    popularity: "High",
    ingredients: ["Paneer", "Potatoes", "Cashew Gravy", "Saffron", "Cream"]
  },
  {
    id: "M023",
    name: "Aloo Gobi Adraki",
    category: "Vegetarian",
    description: "Potatoes and cauliflower florets sautéed with ginger juliennes and whole spices.",
    price: 240,
    rating: 8.5,
    numberOfRatings: 170,
    availability: "In Stock",
    preparationTime: "15 mins",
    popularity: "Low",
    ingredients: ["Potatoes", "Cauliflower", "Ginger", "Turmeric", "Cumin"]
  },
  {
    id: "M024",
    name: "Chana Masala Amritsari",
    category: "Vegetarian",
    description: "Spicy chickpea curry cooked with roasted pomegranates and North Indian dry spices.",
    price: 250,
    rating: 9.0,
    numberOfRatings: 240,
    availability: "In Stock",
    preparationTime: "18 mins",
    popularity: "Medium",
    ingredients: ["Kabuli Chana", "Tea Leaves Extract", "Anardana", "Onion Tomato Gravy"]
  },

  // Non-Vegetarian
  {
    id: "M025",
    name: "Chicken Chettinad",
    category: "Non-Vegetarian",
    description: "Fiery South Indian chicken curry cooked with freshly roasted black pepper and coconut.",
    price: 370,
    rating: 9.3,
    numberOfRatings: 360,
    availability: "In Stock",
    preparationTime: "25 mins",
    popularity: "High",
    ingredients: ["Chicken", "Black Pepper", "Dry Coconut", "Curry Leaves", "Star Anise"]
  },
  {
    id: "M026",
    name: "Kolkata Fish Fry",
    category: "Non-Vegetarian",
    description: "Bhetki fish fillet marinated in green herbs, breaded, and deep-fried golden brown.",
    price: 390,
    rating: 9.5,
    numberOfRatings: 290,
    availability: "In Stock",
    preparationTime: "20 mins",
    popularity: "High",
    ingredients: ["Bhetki Fillet", "Coriander Mint Paste", "Breadcrumbs", "Mustard Paste"]
  },
  {
    id: "M027",
    name: "Prawns Koliwada",
    category: "Non-Vegetarian",
    description: "Crispy spiced prawns battered in carom seed batter and deep fried.",
    price: 460,
    rating: 9.6,
    numberOfRatings: 210,
    availability: "In Stock",
    preparationTime: "20 mins",
    popularity: "High",
    ingredients: ["Tiger Prawns", "Ajwain", "Gram Flour", "Red Chilli"]
  },

  // Sides
  {
    id: "M028",
    name: "Boonde Raita",
    category: "Sides",
    description: "Chilled whipped yogurt mixed with crispy chickpea pearls and roasted cumin.",
    price: 90,
    rating: 8.9,
    numberOfRatings: 180,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "Medium",
    ingredients: ["Yogurt", "Boondi", "Roasted Cumin", "Black Salt"]
  },
  {
    id: "M029",
    name: "Masala Roasted Papad",
    category: "Sides",
    description: "Crispy lentil wafer topped with chopped onions, tomatoes, green chillies, and chaat masala.",
    price: 50,
    rating: 8.6,
    numberOfRatings: 260,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "High",
    ingredients: ["Urad Papad", "Onions", "Tomatoes", "Chaat Masala"]
  },
  {
    id: "M030",
    name: "Green Garden Salad",
    category: "Sides",
    description: "Sliced cucumbers, tomatoes, carrots, radishes, and onions served with lemon wedge.",
    price: 80,
    rating: 8.4,
    numberOfRatings: 140,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "Low",
    ingredients: ["Cucumber", "Tomato", "Carrot", "Onion", "Lemon"]
  },

  // Desserts
  {
    id: "M031",
    name: "Gulab Jamun with Ice Cream",
    category: "Desserts",
    description: "Warm fried milk dumplings soaked in cardamom sugar syrup, paired with vanilla bean ice cream.",
    price: 150,
    rating: 9.8,
    numberOfRatings: 680,
    availability: "In Stock",
    preparationTime: "8 mins",
    popularity: "High",
    ingredients: ["Khoya", "Sugar Syrup", "Cardamom", "Vanilla Ice Cream"]
  },
  {
    id: "M032",
    name: "Rasmalai Saffron",
    category: "Desserts",
    description: "Soft cottage cheese discs soaked in sweetened saffron and pistachio infused milk.",
    price: 170,
    rating: 9.7,
    numberOfRatings: 490,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "High",
    ingredients: ["Chenna", "Milk", "Saffron", "Pistachios", "Almonds"]
  },
  {
    id: "M033",
    name: "Gajar Ka Halwa",
    category: "Desserts",
    description: "Traditional winter carrot pudding cooked with pure ghee, milk, and silvered nuts.",
    price: 160,
    rating: 9.5,
    numberOfRatings: 320,
    availability: "In Stock",
    preparationTime: "10 mins",
    popularity: "Medium",
    ingredients: ["Red Carrots", "Ghee", "Condensed Milk", "Cashews", "Raisins"]
  },
  {
    id: "M034",
    name: "Kulfi Falooda",
    category: "Desserts",
    description: "Traditional dense pistachio ice cream served with falooda noodles and rose syrup.",
    price: 180,
    rating: 9.3,
    numberOfRatings: 270,
    availability: "Out of Stock",
    preparationTime: "8 mins",
    popularity: "Medium",
    ingredients: ["Kulfi", "Cornstarch Vermicelli", "Rose Syrup", "Basil Seeds"]
  },

  // Beverages
  {
    id: "M035",
    name: "Mango Lassi",
    category: "Beverages",
    description: "Thick, creamy yogurt smoothie blended with ripe Alphonso mango pulp.",
    price: 120,
    rating: 9.7,
    numberOfRatings: 540,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "High",
    ingredients: ["Yogurt", "Mango Pulp", "Sugar", "Cardamom"]
  },
  {
    id: "M036",
    name: "Fresh Lime Soda",
    category: "Beverages",
    description: "Refreshing sparkling soda with fresh squeezed lime, served sweet or salted.",
    price: 80,
    rating: 8.9,
    numberOfRatings: 310,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "High",
    ingredients: ["Soda Water", "Fresh Lime", "Sugar Syrup", "Black Salt"]
  },
  {
    id: "M037",
    name: "Masala Chaas",
    category: "Beverages",
    description: "Chilled spiced buttermilk blended with mint, coriander, and green chillies.",
    price: 70,
    rating: 9.1,
    numberOfRatings: 280,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "Medium",
    ingredients: ["Buttermilk", "Mint", "Coriander", "Green Chilli", "Roasted Cumin"]
  },
  {
    id: "M038",
    name: "Virgin Mojito",
    category: "Beverages",
    description: "Classic muddled mint leaves, lime wedges, simple syrup topped with fizzy club soda.",
    price: 140,
    rating: 9.0,
    numberOfRatings: 210,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "Medium",
    ingredients: ["Fresh Mint", "Lime", "Sugar Syrup", "Sprite", "Soda"]
  },

  // Hot Drinks
  {
    id: "M039",
    name: "Masala Chai",
    category: "Hot Drinks",
    description: "Traditional Indian tea brewed with ginger, crushed cardamom, cloves, and whole milk.",
    price: 50,
    rating: 9.8,
    numberOfRatings: 920,
    availability: "In Stock",
    preparationTime: "8 mins",
    popularity: "High",
    ingredients: ["Assam Tea Leaves", "Milk", "Fresh Ginger", "Cardamom", "Cloves"]
  },
  {
    id: "M040",
    name: "South Indian Filter Coffee",
    category: "Hot Drinks",
    description: "Strong decoction brewed in traditional brass filter, frothed with hot boiled milk.",
    price: 60,
    rating: 9.7,
    numberOfRatings: 610,
    availability: "In Stock",
    preparationTime: "8 mins",
    popularity: "High",
    ingredients: ["Chicory Blended Coffee Powder", "Milk", "Sugar"]
  },
  {
    id: "M041",
    name: "Hot Green Tea Honey",
    category: "Hot Drinks",
    description: "Organic Darjeeling green tea steeped with raw wildflower honey and lemon slice.",
    price: 75,
    rating: 8.7,
    numberOfRatings: 150,
    availability: "In Stock",
    preparationTime: "5 mins",
    popularity: "Low",
    ingredients: ["Green Tea Leaves", "Organic Honey", "Lemon Slice"]
  },
  {
    id: "M042",
    name: "Hot Chocolate Supreme",
    category: "Hot Drinks",
    description: "Rich dark Dutch cocoa whisked with steamed whole milk, topped with mini marshmallows.",
    price: 130,
    rating: 9.4,
    numberOfRatings: 190,
    availability: "In Stock",
    preparationTime: "8 mins",
    popularity: "Medium",
    ingredients: ["Cocoa Powder", "Dark Chocolate", "Milk", "Marshmallows"]
  }
];

// Mock Customer Reviews data (all out of 10)
export const MOCK_REVIEWS = [
  {
    id: "REV101",
    dishName: "Hyderabadi Chicken Dum Biryani",
    customer: "Rajesh Sharma",
    rating: 10.0,
    date: "2026-09-14",
    comment: "Best biryani in town! The chicken was extremely tender and the rice was perfectly aromatic.",
    sentiment: "Positive"
  },
  {
    id: "REV102",
    dishName: "Butter Chicken Special",
    customer: "Ananya Roy",
    rating: 9.5,
    date: "2026-09-14",
    comment: "Creamy texture and great balance of sweet and tangy flavors. Loved the garlic naan pairing.",
    sentiment: "Positive"
  },
  {
    id: "REV103",
    dishName: "Dal Makhani Royal",
    customer: "Vikram Patel",
    rating: 9.8,
    date: "2026-09-13",
    comment: "Slow cooked perfection. You can taste the authenticity in every single bite.",
    sentiment: "Positive"
  },
  {
    id: "REV104",
    dishName: "Goan Fish Curry",
    customer: "Siddharth Rao",
    rating: 7.5,
    date: "2026-09-12",
    comment: "Good taste, but fish portion was slightly smaller than expected given the price.",
    sentiment: "Neutral"
  },
  {
    id: "REV105",
    dishName: "Masala Chai",
    customer: "Priya Mehta",
    rating: 10.0,
    date: "2026-09-12",
    comment: "Authentic ginger cardamom kick. Perfect way to start any meeting!",
    sentiment: "Positive"
  },
  {
    id: "REV106",
    dishName: "Paneer Tikka Smokey",
    customer: "Karan Gupta",
    rating: 9.0,
    date: "2026-09-11",
    comment: "Super fresh paneer, charred just right in the tandoor.",
    sentiment: "Positive"
  }
];
