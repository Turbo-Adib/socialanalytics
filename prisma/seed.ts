import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nicheRpmData = [
  {
    niche: 'real_estate',
    displayName: 'Real Estate',
    minRpmUsd: 30.0,
    maxRpmUsd: 75.0,
    averageRpmUsd: 52.5,
    shortsRpmUsd: 0.15,
    confidence: 'high',
    dataSource: 'Industry Reports 2024 - Viralyft, TubeB uddy',
    sampleSize: '50+ channels analyzed',
    notes: 'Highest RPM niche, CPC ranges $4-$84. US-based channels perform best.'
  },
  {
    niche: 'finance',
    displayName: 'Finance & Investing',
    minRpmUsd: 15.0,
    maxRpmUsd: 30.0,
    averageRpmUsd: 22.5,
    shortsRpmUsd: 0.15,
    confidence: 'high',
    dataSource: 'Tubular Labs 2024, Creator earnings reports',
    sampleSize: '100+ finance channels',
    notes: 'Joshua Mayo RPM example: $29.30. High advertiser demand for financial content.'
  },
  {
    niche: 'business',
    displayName: 'Business & Online Marketing',
    minRpmUsd: 15.0,
    maxRpmUsd: 25.0,
    averageRpmUsd: 20.0,
    shortsRpmUsd: 0.15,
    confidence: 'high',
    dataSource: 'Industry Reports 2024, Creator case studies',
    sampleSize: '75+ business channels',
    notes: 'Making money online content CPM: $13.52. B2B advertisers pay premium rates.'
  },
  {
    niche: 'technology',
    displayName: 'Technology & Reviews',
    minRpmUsd: 8.0,
    maxRpmUsd: 25.0,
    averageRpmUsd: 16.5,
    shortsRpmUsd: 0.15,
    confidence: 'high',
    dataSource: 'TubeBuddy analysis, Review channel data',
    sampleSize: '200+ tech channels',
    notes: 'Gadget reviews CPM $4-$10. Product review content performs well with advertisers.'
  },
  {
    niche: 'education',
    displayName: 'Education & Tutorials',
    minRpmUsd: 5.0,
    maxRpmUsd: 15.0,
    averageRpmUsd: 9.89,
    shortsRpmUsd: 0.15,
    confidence: 'high',
    dataSource: 'YouTube Creator Analytics 2024',
    sampleSize: '500+ educational channels',
    notes: 'Broad range includes tutorials, courses, lectures. Stable advertiser interest.'
  },
  {
    niche: 'health_fitness',
    displayName: 'Health & Fitness',
    minRpmUsd: 4.0,
    maxRpmUsd: 12.0,
    averageRpmUsd: 8.0,
    shortsRpmUsd: 0.15,
    confidence: 'medium',
    dataSource: 'Industry reports, Creator surveys',
    sampleSize: '150+ health channels',
    notes: 'Wellness content has growing advertiser interest. Varies by specific sub-niche.'
  },
  {
    niche: 'lifestyle',
    displayName: 'Lifestyle & Vlogs',
    minRpmUsd: 2.0,
    maxRpmUsd: 6.0,
    averageRpmUsd: 3.47,
    shortsRpmUsd: 0.15,
    confidence: 'medium',
    dataSource: 'Creator economy reports 2024',
    sampleSize: '300+ lifestyle channels',
    notes: 'Broad audience appeal but lower advertiser CPMs. High volume potential.'
  },
  {
    niche: 'gaming',
    displayName: 'Gaming & Entertainment',
    minRpmUsd: 2.0,
    maxRpmUsd: 6.0,
    averageRpmUsd: 4.0,
    shortsRpmUsd: 0.15,
    confidence: 'high',
    dataSource: 'MrBeast analytics, Gaming channel reports',
    sampleSize: '1000+ gaming channels',
    notes: 'MrBeast RPM $4-$6. High views but lower RPM. Gaming advertisers pay less per view.'
  },
  {
    niche: 'digital_marketing',
    displayName: 'Digital Marketing',
    minRpmUsd: 5.0,
    maxRpmUsd: 15.0,
    averageRpmUsd: 10.0,
    shortsRpmUsd: 0.15,
    confidence: 'medium',
    dataSource: 'Marketing agency reports, Creator case studies',
    sampleSize: '50+ marketing channels',
    notes: 'Practical tips and case studies monetize well. B2B audience valuable to advertisers.'
  },
  {
    niche: 'food_cooking',
    displayName: 'Food & Cooking',
    minRpmUsd: 2.0,
    maxRpmUsd: 8.0,
    averageRpmUsd: 5.0,
    shortsRpmUsd: 0.15,
    confidence: 'medium',
    dataSource: 'Creator economy data, Food channel analysis',
    sampleSize: '200+ food channels',
    notes: 'Recipe and cooking content. Food brand advertisers, seasonal variations.'
  },
  {
    niche: 'travel',
    displayName: 'Travel & Adventure',
    minRpmUsd: 3.0,
    maxRpmUsd: 10.0,
    averageRpmUsd: 6.5,
    shortsRpmUsd: 0.15,
    confidence: 'medium',
    dataSource: 'Travel creator reports, Tourism advertiser data',
    sampleSize: '100+ travel channels',
    notes: 'Tourism and travel advertisers. Seasonal fluctuations, geographic targeting important.'
  },
  {
    niche: 'entertainment',
    displayName: 'Entertainment & Comedy',
    minRpmUsd: 1.5,
    maxRpmUsd: 5.0,
    averageRpmUsd: 3.0,
    shortsRpmUsd: 0.15,
    confidence: 'medium',
    dataSource: 'Entertainment industry reports',
    sampleSize: '500+ entertainment channels',
    notes: 'High volume, lower RPM. Broad audience appeal but less targeted advertising.'
  },
  {
    niche: 'music',
    displayName: 'Music & Artists',
    minRpmUsd: 1.0,
    maxRpmUsd: 4.0,
    averageRpmUsd: 2.5,
    shortsRpmUsd: 0.15,
    confidence: 'medium',
    dataSource: 'Music industry analytics, Artist channel data',
    sampleSize: '300+ music channels',
    notes: 'Music advertisers, streaming service promotions. Copyright issues affect monetization.'
  },
  {
    niche: 'beauty_fashion',
    displayName: 'Beauty & Fashion',
    minRpmUsd: 3.0,
    maxRpmUsd: 12.0,
    averageRpmUsd: 7.5,
    shortsRpmUsd: 0.15,
    confidence: 'medium',
    dataSource: 'Beauty brand advertising reports, Influencer marketing data',
    sampleSize: '200+ beauty channels',
    notes: 'Beauty and fashion brand advertisers pay well. Female demographic valuable.'
  },
  {
    niche: 'automotive',
    displayName: 'Automotive & Cars',
    minRpmUsd: 4.0,
    maxRpmUsd: 15.0,
    averageRpmUsd: 9.5,
    shortsRpmUsd: 0.15,
    confidence: 'medium',
    dataSource: 'Automotive advertising data, Car channel analytics',
    sampleSize: '100+ automotive channels',
    notes: 'Car manufacturers and automotive advertisers. High-value purchases drive higher CPMs.'
  }
];

async function main() {
  console.log('Seeding niche RPM rates...');
  
  for (const data of nicheRpmData) {
    const nicheRate = await prisma.nicheRpmRate.upsert({
      where: { niche: data.niche },
      update: data,
      create: data,
    });
    console.log(`✓ ${nicheRate.displayName}: $${nicheRate.averageRpmUsd} RPM`);
  }
  
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });