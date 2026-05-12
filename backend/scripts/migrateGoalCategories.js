require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Goal = require('../models/Goal');

async function migrateGoals() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all goals with old "general" category
    const generalGoals = await Goal.find({ category: 'general' });
    console.log(`📋 Found ${generalGoals.length} goals with category "general"`);

    if (generalGoals.length === 0) {
      console.log('✅ No goals to migrate - all categories already updated');
      await mongoose.connection.close();
      process.exit(0);
      return;
    }

    // Update all to "other"
    const result = await Goal.updateMany(
      { category: 'general' },
      { category: 'other' }
    );

    console.log(`✅ Successfully migrated ${result.modifiedCount} goals`);
    console.log(`   Changed: "general" → "other"`);

    // Verify
    const remaining = await Goal.find({ category: 'general' });
    console.log(`✅ Verification: ${remaining.length} goals still have "general"`);

    const migratedGoals = await Goal.find({ category: 'other' });
    console.log(`✅ Total goals now in "other" category: ${migratedGoals.length}`);

    await mongoose.connection.close();
    console.log('✅ Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrateGoals();
