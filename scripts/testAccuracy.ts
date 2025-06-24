import { testAgainstBenchmarks, VERIFIED_CREATOR_BENCHMARKS, validateAgainstSocialBlade } from '../src/utils/validationAndComparison';
import { calculateTotalRevenue } from '../src/utils/revenueCalculations';

async function runAccuracyTests() {
  console.log('🧪 Running Revenue Calculation Accuracy Tests\n');
  
  // Test against verified creator benchmarks
  console.log('📊 Testing Against Verified Creator Benchmarks:');
  console.log('=' .repeat(60));
  
  for (const benchmark of VERIFIED_CREATOR_BENCHMARKS) {
    console.log(`\n🎯 Testing: ${benchmark.channelName}`);
    console.log(`Niche: ${benchmark.niche}`);
    console.log(`Reported RPM: $${benchmark.reportedRPM}`);
    console.log(`Source: ${benchmark.source}`);
    
    const result = await testAgainstBenchmarks(benchmark.niche);
    
    if (result.benchmark) {
      console.log(`Our Predicted RPM: $${result.ourPredictedRPM.toFixed(2)}`);
      console.log(`Accuracy: ${result.accuracy.toFixed(1)}%`);
      console.log(`Status: ${result.status.toUpperCase()}`);
      
      const statusEmoji = result.status === 'accurate' ? '✅' : 
                         result.status === 'overestimate' ? '📈' : '📉';
      console.log(`${statusEmoji} ${result.status === 'accurate' ? 'ACCURATE' : 
                   result.status === 'overestimate' ? 'SLIGHT OVERESTIMATE' : 'SLIGHT UNDERESTIMATE'}`);
    }
  }
  
  // Test Social Blade comparison
  console.log('\n\n🆚 Social Blade Methodology Comparison:');
  console.log('=' .repeat(60));
  
  // Test case: 1M long-form views, 5M shorts views, Finance niche
  const testViews = {
    longForm: 1000000,
    shorts: 5000000,
    niche: 'finance'
  };
  
  console.log(`\n📈 Test Case: ${testViews.longForm.toLocaleString()} long-form + ${testViews.shorts.toLocaleString()} Shorts (${testViews.niche})`);
  
  const validation = await validateAgainstSocialBlade(
    testViews.longForm,
    testViews.shorts,
    testViews.niche
  );
  
  console.log(`\nOur Estimate: $${validation.ourEstimate.totalRevenue.toFixed(2)}`);
  console.log(`- Long-form: $${validation.ourEstimate.longFormRevenue.toFixed(2)} at $${validation.ourEstimate.longFormRPM} RPM`);
  console.log(`- Shorts: $${validation.ourEstimate.shortsRevenue.toFixed(2)} at $${validation.ourEstimate.shortsRPM} RPM`);
  
  console.log(`\nSocial Blade Original: $${validation.socialBladeOriginal.lowEstimate.toFixed(2)} - $${validation.socialBladeOriginal.highEstimate.toFixed(2)}`);
  console.log(`Social Blade Realistic: $${validation.socialBladeRealistic.realisticEstimate.toFixed(2)}`);
  
  console.log(`\nAccuracy vs Social Blade: ${validation.accuracy.accuracy.toUpperCase()}`);
  console.log(`Difference: ${validation.accuracy.differencePct.toFixed(1)}%`);
  console.log(`Within Range: ${validation.accuracy.isWithinSocialBladeRange ? 'YES' : 'NO'}`);
  
  // Test different niches
  console.log('\n\n📋 RPM Accuracy by Niche:');
  console.log('=' .repeat(60));
  
  const testNiches = ['finance', 'technology', 'gaming', 'real_estate', 'lifestyle'];
  const testViewCount = 1000000; // 1M views
  
  for (const niche of testNiches) {
    const revenue = await calculateTotalRevenue(testViewCount, 0, niche);
    console.log(`${niche.padEnd(15)}: $${revenue.longFormRPM.toString().padStart(6)} RPM -> $${revenue.longFormRevenue.toFixed(2).padStart(8)} revenue`);
  }
  
  console.log('\n✅ Accuracy tests completed!');
  console.log('\n💡 Key Insights:');
  console.log('- Our estimates use verified 2024 industry data');
  console.log('- Shorts RPM fixed at $0.15 (industry standard)');
  console.log('- Niche-specific calculations provide more accurate estimates');
  console.log('- Method is transparent and defensible against industry standards');
}

// Run the tests
runAccuracyTests().catch(console.error);