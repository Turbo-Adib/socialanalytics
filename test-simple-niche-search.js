// Simple test to verify the niche search system works without OpenAI
const { NicheMapper } = require('./src/data/nicheDatabase.ts');

console.log('🧪 TESTING SIMPLE NICHE CLASSIFICATION SYSTEM\n');

const testCases = [
  // Known exact matches
  { term: 'React', expected: 'tech' },
  { term: 'Minecraft', expected: 'gaming' },
  { term: 'Bitcoin', expected: 'finance' },
  { term: 'Cooking', expected: 'food' },
  
  // Partial matches  
  { term: 'JavaScript', expected: 'tech' },
  { term: 'crypto', expected: 'finance' },
  
  // Unknown niches (should default to general)
  { term: 'Hairdresser', expected: 'general' },
  { term: 'Pottery', expected: 'general' },
  { term: 'Blacksmithing', expected: 'general' },
  { term: 'Origami', expected: 'general' }
];

testCases.forEach(({ term, expected }) => {
  try {
    const result = NicheMapper.searchNiche(term);
    const success = result.parentCategory.id === expected;
    const icon = success ? '✅' : '❌';
    
    console.log(`${icon} "${term}" → ${result.parentCategory.name}`);
    console.log(`   Match Type: ${result.matchType}`);
    console.log(`   RPM: $${result.parentCategory.longFormRpm}/1K views`);
    
    if (result.isUnknownNiche) {
      console.log(`   📝 Unknown niche - admin notification triggered`);
    }
    
    if (result.reasoning) {
      console.log(`   💭 ${result.reasoning}`);
    }
    
    console.log();
  } catch (error) {
    console.log(`❌ "${term}" → ERROR: ${error.message}\n`);
  }
});

console.log('🎯 TESTING COMPLETE');
console.log('\n✅ KEY IMPROVEMENTS:');
console.log('• Removed complex OpenAI integration');
console.log('• Simple keyword-based matching');
console.log('• Unknown niches default to General ($4/1K RPM)');
console.log('• Admin notification system for new niches');
console.log('• Much simpler and more reliable');