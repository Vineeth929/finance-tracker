require('dotenv').config();
const mongoose = require('mongoose');
const GoalCategory = require('../models/GoalCategory');

const categories = [
  {
    id: 'savings',
    label: 'Savings',
    description: 'Building your financial cushion',
    icon: '💰',
    accent: 'emerald',
    mood: 'calm-growth',
    emotionalTheme: 'savings',
    order: 1,
  },
  {
    id: 'travel',
    label: 'Travel',
    description: 'Exploring the world',
    icon: '✈️',
    accent: 'cyan',
    mood: 'focused-clarity',
    emotionalTheme: 'investments',
    order: 2,
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Learning and growth',
    icon: '📚',
    accent: 'amber',
    mood: 'warm-aspiration',
    emotionalTheme: 'goals',
    order: 3,
  },
  {
    id: 'home',
    label: 'Home',
    description: 'Your dream space',
    icon: '🏠',
    accent: 'violet',
    mood: 'creative-energy',
    emotionalTheme: 'analytics',
    order: 4,
  },
  {
    id: 'vehicle',
    label: 'Vehicle',
    description: 'Wheels of freedom',
    icon: '🚗',
    accent: 'cyan',
    mood: 'focused-clarity',
    emotionalTheme: 'investments',
    order: 5,
  },
  {
    id: 'investment',
    label: 'Investment',
    description: 'Growing wealth',
    icon: '💼',
    accent: 'cyan',
    mood: 'focused-clarity',
    emotionalTheme: 'investments',
    order: 6,
  },
  {
    id: 'retirement',
    label: 'Retirement',
    description: 'Peaceful future ahead',
    icon: '🏖️',
    accent: 'emerald',
    mood: 'calm-growth',
    emotionalTheme: 'savings',
    order: 7,
  },
  {
    id: 'emergency-fund',
    label: 'Emergency Fund',
    description: 'Safety net for life',
    icon: '🚨',
    accent: 'rose',
    mood: 'alert-care',
    emotionalTheme: 'expenses',
    order: 8,
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Miscellaneous goals',
    icon: '📌',
    accent: 'violet',
    mood: 'creative-energy',
    emotionalTheme: 'analytics',
    order: 9,
  },
];

async function seedCategories() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing categories...');
    await GoalCategory.deleteMany({});

    console.log('📝 Inserting goal categories...');
    const inserted = await GoalCategory.insertMany(categories);
    console.log(`✅ Successfully seeded ${inserted.length} goal categories`);

    console.log('\n📋 Seeded Categories:');
    inserted.forEach(cat => {
      console.log(`   ✓ ${cat.icon} ${cat.label} (id: ${cat.id})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Seed complete!');
    return true;
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    return false;
  }
}

// Only run as standalone script if called directly
if (require.main === module) {
  seedCategories().then(success => {
    process.exit(success ? 0 : 1);
  });
}
