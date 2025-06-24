// Quick test script to demonstrate intelligent category mapping
// Run with: node test-intelligent-mapping.js

const { IntelligentCategoryMapper } = require('./src/utils/intelligentCategoryMapper');

console.log('🧠 TESTING INTELLIGENT CATEGORY MAPPING SYSTEM\n');

const testTerms = [
  // Known terms (should get exact matches from existing database)
  'React',
  'Minecraft', 
  'Bitcoin',
  
  // Unknown terms that should be intelligently mapped
  'TensorFlow',      // Should → Tech
  'Cyberpunk 2077',  // Should → Gaming  
  'DogeCoin',        // Should → Finance
  'Sourdough',       // Should → Food
  'Machine Learning', // Should → Tech
  'Adobe Photoshop',  // Should → Creative
  'Tesla Model 3',    // Should → Automotive
  'Yoga',            // Should → Health
  'SpaceX',          // Should → Science
  'Instagram',       // Should → Business/Lifestyle
  'Ethereum',        // Should → Finance
  'Blender 3D',      // Should → Creative
  'Electric Guitar', // Should → Creative/Music
  'Meditation',      // Should → Health/Lifestyle
  'Dropshipping',    // Should → Business
  
  // Edge cases
  'Random Term That Should Not Match Anything',
  'XYZ123',
  ''
];

console.log('Testing intelligent category suggestions for unknown terms:\n');

testTerms.forEach(term => {
  if (!term) {
    console.log(`❌ Empty term → Skipped\n`);
    return;
  }
  
  try {
    const result = IntelligentCategoryMapper.suggestCategory(term);
    
    const confidenceBar = '█'.repeat(Math.floor(result.confidence * 10)) + 
                          '░'.repeat(10 - Math.floor(result.confidence * 10));
    
    console.log(`🔍 "${term}"`);
    console.log(`   → ${result.category.name} ($${result.category.longFormRpm}/1K)`);
    console.log(`   📊 Confidence: ${Math.round(result.confidence * 100)}% [${confidenceBar}]`);
    console.log(`   💡 ${result.reasoning}`);
    
    if (result.suggestions && result.suggestions.length > 0) {
      console.log(`   🔗 Related: ${result.suggestions.slice(0, 3).join(', ')}`);
    }
    console.log();
  } catch (error) {
    console.log(`❌ Error testing "${term}": ${error.message}\n`);
  }
});

console.log('✅ Intelligent mapping test complete!');
console.log('\n📝 How it works:');
console.log('1. Exact keyword match (highest priority)');
console.log('2. Partial keyword match');  
console.log('3. Fuzzy matching for typos');
console.log('4. 🧠 AI semantic analysis for unknown terms');
console.log('5. Fallback to General category');

console.log('\n🎯 Benefits:');
console.log('• Users can search ANY term and get relevant category');
console.log('• Confidence scoring shows mapping reliability');
console.log('• Human-readable reasoning explains the choice');
console.log('• Related suggestions help users discover more keywords');
console.log('• No more "General" category for tech terms like "TensorFlow"');