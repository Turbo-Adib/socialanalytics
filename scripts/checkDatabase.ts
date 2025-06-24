import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking Database RPM Rates:\n');
  
  try {
    const rates = await prisma.nicheRpmRate.findMany({
      orderBy: { averageRpmUsd: 'desc' }
    });
    
    console.log('Database RPM Rates:');
    console.log('='.repeat(50));
    
    rates.forEach(rate => {
      console.log(`${rate.displayName.padEnd(25)}: $${rate.averageRpmUsd.toString().padStart(6)} RPM (${rate.niche})`);
    });
    
    console.log(`\nTotal records: ${rates.length}`);
    
    // Test specific lookups
    console.log('\n🔍 Testing Specific Lookups:');
    console.log('='.repeat(50));
    
    const testNiches = ['real_estate', 'finance', 'gaming'];
    
    for (const niche of testNiches) {
      const rate = await prisma.nicheRpmRate.findUnique({
        where: { niche }
      });
      
      if (rate) {
        console.log(`✅ ${niche}: $${rate.averageRpmUsd} RPM`);
      } else {
        console.log(`❌ ${niche}: NOT FOUND`);
      }
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();