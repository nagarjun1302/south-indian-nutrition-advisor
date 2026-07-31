export const HEALTH_GOALS_LIST = [
  'Type 2 Diabetes Control',
  'Hypertension & Blood Pressure',
  'Weight Loss & Fat Loss',
  'High Cholesterol Management',
  'Heart Health',
  'Kidney Health (Low Sodium/Potassium)',
  'Gut Health & Acid Reflux Relief',
  'Muscle Building & High Protein',
  'General Fitness & Energy',
];

export const DIETARY_PREFERENCES = [
  'Vegetarian (Pure Veg)',
  'Vegan (Plant-Based)',
  'Eggetarian',
  'Non-Vegetarian',
  'Jain (No Onion / No Garlic)',
];

export const DISH_PRESETS = [
  // Breakfast
  { name: 'Masala Dosa with Potato Masala', quantity: '1 piece', mealTime: 'breakfast', emoji: '🥞', caloriesApprox: 320, carbsApprox: 45, giRating: 'High' },
  { name: 'Steamed Idli with Sambar', quantity: '2 pieces idli + 1 cup sambar', mealTime: 'breakfast', emoji: '⚪', caloriesApprox: 240, carbsApprox: 40, giRating: 'Medium' },
  { name: 'Medu Vada with Coconut Chutney', quantity: '2 pieces + 2 tbsp chutney', mealTime: 'breakfast', emoji: '🍩', caloriesApprox: 340, carbsApprox: 28, giRating: 'High' },
  { name: 'Ven Pongal with Ghee & Pepper', quantity: '1 cup (150g)', mealTime: 'breakfast', emoji: '🥣', caloriesApprox: 310, carbsApprox: 42, giRating: 'High' },
  { name: 'Pesarattu (Moong Dal Dosa)', quantity: '1 piece', mealTime: 'breakfast', emoji: '🫓', caloriesApprox: 210, carbsApprox: 26, giRating: 'Low' },
  { name: 'Rava Upma with Mixed Vegetables', quantity: '1 cup (150g)', mealTime: 'breakfast', emoji: '🍲', caloriesApprox: 250, carbsApprox: 36, giRating: 'Medium' },

  // Lunch
  { name: 'White Parboiled Rice', quantity: '1.5 cups (200g)', mealTime: 'lunch', emoji: '🍚', caloriesApprox: 260, carbsApprox: 54, giRating: 'High' },
  { name: 'Toor Dal Sambar with Drumstick', quantity: '1 cup (180g)', mealTime: 'lunch', emoji: '🍲', caloriesApprox: 160, carbsApprox: 22, giRating: 'Low' },
  { name: 'Pepper Rasam', quantity: '1 cup (150g)', mealTime: 'lunch', emoji: '🍵', caloriesApprox: 45, carbsApprox: 6, giRating: 'Low' },
  { name: 'Beans Poriyal (Sauteed with Coconut)', quantity: '1 bowl (100g)', mealTime: 'lunch', emoji: '🥗', caloriesApprox: 85, carbsApprox: 8, giRating: 'Low' },
  { name: 'Curd Rice with Mustard Tempering', quantity: '1 cup (180g)', mealTime: 'lunch', emoji: '🍚', caloriesApprox: 220, carbsApprox: 32, giRating: 'Medium' },
  { name: 'Chettinad Chicken Curry', quantity: '1 bowl (150g)', mealTime: 'lunch', emoji: '🍗', caloriesApprox: 290, carbsApprox: 8, giRating: 'Low' },

  // Dinner
  { name: 'Whole Wheat Chapati', quantity: '2 pieces', mealTime: 'dinner', emoji: '🫓', caloriesApprox: 180, carbsApprox: 30, giRating: 'Medium' },
  { name: 'Vegetable Kurma', quantity: '1 cup (150g)', mealTime: 'dinner', emoji: '🥘', caloriesApprox: 190, carbsApprox: 18, giRating: 'Medium' },
  { name: 'Foxtail Millet Dosa (Thinai Dosa)', quantity: '2 pieces', mealTime: 'dinner', emoji: '🥞', caloriesApprox: 220, carbsApprox: 32, giRating: 'Low' },
  { name: 'Steamed Idiyappam (String Hoppers)', quantity: '3 pieces', mealTime: 'dinner', emoji: '🍜', caloriesApprox: 210, carbsApprox: 44, giRating: 'High' },

  // Snacks
  { name: 'Filter Coffee (with Milk & Sugar)', quantity: '1 cup (120ml)', mealTime: 'snack', emoji: '☕', caloriesApprox: 110, carbsApprox: 14, giRating: 'High' },
  { name: 'Boiled Chana Sundal', quantity: '1 bowl (100g)', mealTime: 'snack', emoji: '🧆', caloriesApprox: 160, carbsApprox: 22, giRating: 'Low' },
  { name: 'Onion Bajji (Fritters)', quantity: '3 pieces', mealTime: 'snack', emoji: '🧅', caloriesApprox: 280, carbsApprox: 24, giRating: 'High' },
];

export const INGREDIENT_DATABASE = [
  {
    name: 'White Raw Rice (Pachai Arisi)',
    tamilName: 'பச்சை அரிசி',
    category: 'Grains & Millets',
    giIndex: 73,
    giCategory: 'High',
    healthBenefits: ['Quick energy source', 'Gentle on digestion'],
    healthyAlternatives: ['Red Matta Rice', 'Hand-pounded Brown Rice', 'Kodo Millet (Varagu)'],
  },
  {
    name: 'Ragi (Finger Millet)',
    tamilName: 'கேழ்வரகு',
    category: 'Grains & Millets',
    giIndex: 54,
    giCategory: 'Low',
    healthBenefits: ['High Calcium & Fiber', 'Prevents blood sugar spikes', 'Supports bone density'],
    healthyAlternatives: ['Foxtail Millet', 'Pearl Millet (Kambu)'],
  },
  {
    name: 'Toor Dal (Pigeon Peas)',
    tamilName: 'துவரம் பருப்பு',
    category: 'Lentils & Pulses',
    giIndex: 29,
    giCategory: 'Low',
    healthBenefits: ['High Plant Protein', 'Folic Acid & Iron', 'Lowers LDL cholesterol'],
    healthyAlternatives: ['Moong Dal (Yellow Lentils)'],
  },
  {
    name: 'Grated Coconut & Coconut Milk',
    tamilName: 'தேங்காய்',
    category: 'Oils & Fats',
    giIndex: 45,
    giCategory: 'Low',
    healthBenefits: ['MCT Fats for clean energy', 'Lauric Acid for immunity'],
    healthyAlternatives: ['Roasted Gram (Pottukadalai) Chutney', 'Peanut Chutney in moderation'],
  },
  {
    name: 'Curry Leaves & Mustard Seeds',
    tamilName: 'கறிவேப்பிலை',
    category: 'Spices',
    giIndex: 15,
    giCategory: 'Low',
    healthBenefits: ['Rich in Antioxidants', 'Supports Liver & Digestion', 'Improves Hair Health'],
  },
  {
    name: 'Drumstick (Moringa Pods)',
    tamilName: 'முருங்கைக்காய்',
    category: 'Vegetables',
    giIndex: 20,
    giCategory: 'Low',
    healthBenefits: ['High Vitamin C & Bio-available Iron', 'Anti-inflammatory', 'Regulates blood glucose'],
  },
];
