// Comprehensive Niche Database with Keyword Mappings
// Maps 100+ specific search terms to main RPM categories

import { IntelligentCategoryMapper } from '@/utils/intelligentCategoryMapper';

export interface NicheData {
  id: string;
  displayName: string;
  parentCategory: string;
  longFormRpm: number;
  shortsRpm: number; // Always $0.15 globally
  description: string;
  keywords: string[];
  aliases: string[];
}

export interface ParentCategory {
  id: string;
  name: string;
  longFormRpm: number;
  shortsRpm: number;
  description: string;
  color: string;
}

// Main parent categories with updated 2024-2025 RPM rates based on industry research
export const parentCategories: ParentCategory[] = [
  { id: 'finance', name: 'Finance & Investment', longFormRpm: 22.0, shortsRpm: 0.15, description: 'Personal finance, investing, crypto, wealth building', color: 'green' },
  { id: 'business', name: 'Business & Entrepreneurship', longFormRpm: 18.0, shortsRpm: 0.15, description: 'Make money online, dropshipping, digital marketing, startups', color: 'indigo' },
  { id: 'tech', name: 'Technology & Software', longFormRpm: 15.0, shortsRpm: 0.15, description: 'Programming, AI, software reviews, tech tutorials', color: 'blue' },
  { id: 'education', name: 'Education & Learning', longFormRpm: 12.0, shortsRpm: 0.15, description: 'Online courses, tutorials, skill development', color: 'purple' },
  { id: 'health', name: 'Health & Wellness', longFormRpm: 10.0, shortsRpm: 0.15, description: 'Fitness, nutrition, mental health, medical advice', color: 'teal' },
  { id: 'science', name: 'Science & Research', longFormRpm: 9.0, shortsRpm: 0.15, description: 'Scientific content, research, experiments', color: 'emerald' },
  { id: 'automotive', name: 'Automotive & Transportation', longFormRpm: 8.0, shortsRpm: 0.15, description: 'Car reviews, automotive repair, transportation', color: 'gray' },
  { id: 'travel', name: 'Travel & Adventure', longFormRpm: 7.0, shortsRpm: 0.15, description: 'Travel vlogs, destinations, adventure content', color: 'cyan' },
  { id: 'lifestyle', name: 'Lifestyle & Personal', longFormRpm: 6.0, shortsRpm: 0.15, description: 'Personal development, relationships, daily life', color: 'pink' },
  { id: 'sports', name: 'Sports & Fitness', longFormRpm: 5.5, shortsRpm: 0.15, description: 'Sports content, athletics, fitness routines', color: 'lime' },
  { id: 'creative', name: 'Creative & Arts', longFormRpm: 5.0, shortsRpm: 0.15, description: 'Art, design, music production, photography', color: 'orange' },
  { id: 'gaming', name: 'Gaming & Esports', longFormRpm: 4.0, shortsRpm: 0.15, description: 'Video games, streaming, esports, game reviews', color: 'red' },
  { id: 'entertainment', name: 'Entertainment & Comedy', longFormRpm: 3.5, shortsRpm: 0.15, description: 'Movies, TV, comedy, celebrities, pop culture', color: 'yellow' },
  { id: 'food', name: 'Food & Cooking', longFormRpm: 3.0, shortsRpm: 0.15, description: 'Recipes, cooking tutorials, food reviews', color: 'amber' },
  { id: 'general', name: 'General Content', longFormRpm: 4.0, shortsRpm: 0.15, description: 'Mixed content, vlogging, general topics', color: 'slate' }
];

// Comprehensive niche database with keyword mappings
export const nicheDatabase: NicheData[] = [
  // TECHNOLOGY & SOFTWARE
  {
    id: 'web-development',
    displayName: 'Web Development',
    parentCategory: 'tech',
    longFormRpm: 12.0,
    shortsRpm: 0.15,
    description: 'HTML, CSS, JavaScript, React, Vue, Angular',
    keywords: ['javascript', 'react', 'vue', 'angular', 'html', 'css', 'typescript', 'nodejs', 'web development', 'frontend', 'backend', 'fullstack'],
    aliases: ['js', 'reactjs', 'vuejs', 'web dev', 'frontend dev', 'backend dev']
  },
  {
    id: 'mobile-development',
    displayName: 'Mobile Development',
    parentCategory: 'tech',
    longFormRpm: 12.0,
    shortsRpm: 0.15,
    description: 'iOS, Android, React Native, Flutter',
    keywords: ['ios', 'android', 'swift', 'kotlin', 'react native', 'flutter', 'mobile app', 'app development', 'xamarin'],
    aliases: ['mobile dev', 'app dev', 'ios dev', 'android dev']
  },
  {
    id: 'data-science',
    displayName: 'Data Science & AI',
    parentCategory: 'tech',
    longFormRpm: 12.0,
    shortsRpm: 0.15,
    description: 'Python, machine learning, AI, data analysis',
    keywords: ['python', 'machine learning', 'artificial intelligence', 'data science', 'pandas', 'tensorflow', 'pytorch', 'jupyter', 'kaggle', 'ai'],
    aliases: ['ml', 'data analysis', 'deep learning', 'neural networks']
  },
  {
    id: 'cybersecurity',
    displayName: 'Cybersecurity',
    parentCategory: 'tech',
    longFormRpm: 12.0,
    shortsRpm: 0.15,
    description: 'Security, hacking, penetration testing',
    keywords: ['cybersecurity', 'hacking', 'penetration testing', 'security', 'ethical hacking', 'kali linux', 'networking', 'malware'],
    aliases: ['infosec', 'cyber security', 'pen testing', 'white hat']
  },
  {
    id: 'cloud-computing',
    displayName: 'Cloud Computing',
    parentCategory: 'tech',
    longFormRpm: 12.0,
    shortsRpm: 0.15,
    description: 'AWS, Azure, Google Cloud, DevOps',
    keywords: ['aws', 'azure', 'google cloud', 'cloud computing', 'devops', 'kubernetes', 'docker', 'serverless'],
    aliases: ['gcp', 'amazon web services', 'microsoft azure']
  },

  // GAMING & ESPORTS
  {
    id: 'minecraft',
    displayName: 'Minecraft',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'Minecraft gameplay, tutorials, builds',
    keywords: ['minecraft', 'creeper', 'redstone', 'building', 'survival', 'creative mode', 'nether', 'ender dragon'],
    aliases: ['mc', 'craft']
  },
  {
    id: 'roblox',
    displayName: 'Roblox',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'Roblox games, scripting, development',
    keywords: ['roblox', 'robux', 'lua scripting', 'roblox studio', 'obby', 'tycoon'],
    aliases: ['rblx']
  },
  {
    id: 'fortnite',
    displayName: 'Fortnite',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'Fortnite gameplay, tips, tricks',
    keywords: ['fortnite', 'battle royale', 'epic games', 'building', 'victory royale', 'skins'],
    aliases: ['fn']
  },
  {
    id: 'fps-games',
    displayName: 'FPS Games',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'First-person shooters, tactics, gameplay',
    keywords: ['call of duty', 'valorant', 'counter strike', 'apex legends', 'fps', 'shooting games', 'cod', 'csgo'],
    aliases: ['first person shooter', 'shooter games']
  },
  {
    id: 'retro-gaming',
    displayName: 'Retro Gaming',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'Classic games, nostalgia, vintage consoles',
    keywords: ['retro gaming', 'nintendo', 'sega', 'atari', 'classic games', 'vintage', 'arcade'],
    aliases: ['old games', 'classic gaming', 'vintage gaming']
  },

  // FINANCE & INVESTMENT
  {
    id: 'cryptocurrency',
    displayName: 'Cryptocurrency',
    parentCategory: 'finance',
    longFormRpm: 15.0,
    shortsRpm: 0.15,
    description: 'Bitcoin, Ethereum, trading, blockchain',
    keywords: ['bitcoin', 'ethereum', 'cryptocurrency', 'crypto', 'blockchain', 'defi', 'nft', 'trading', 'altcoins'],
    aliases: ['btc', 'eth', 'crypto trading', 'digital currency']
  },
  {
    id: 'stock-market',
    displayName: 'Stock Market',
    parentCategory: 'finance',
    longFormRpm: 15.0,
    shortsRpm: 0.15,
    description: 'Stock trading, investing, market analysis',
    keywords: ['stocks', 'stock market', 'investing', 'trading', 'nasdaq', 'sp500', 'dow jones', 'portfolio'],
    aliases: ['stock trading', 'equity trading', 'shares']
  },
  {
    id: 'real-estate',
    displayName: 'Real Estate',
    parentCategory: 'finance',
    longFormRpm: 15.0,
    shortsRpm: 0.15,
    description: 'Property investment, real estate tips',
    keywords: ['real estate', 'property', 'investment property', 'rental', 'house flipping', 'mortgage', 'landlord'],
    aliases: ['property investment', 'real estate investing']
  },
  {
    id: 'personal-finance',
    displayName: 'Personal Finance',
    parentCategory: 'finance',
    longFormRpm: 15.0,
    shortsRpm: 0.15,
    description: 'Budgeting, saving, debt management',
    keywords: ['budgeting', 'saving money', 'debt', 'credit score', 'financial planning', 'retirement', 'emergency fund'],
    aliases: ['money management', 'financial advice']
  },

  // HEALTH & WELLNESS
  {
    id: 'fitness',
    displayName: 'Fitness & Exercise',
    parentCategory: 'health',
    longFormRpm: 8.0,
    shortsRpm: 0.15,
    description: 'Workouts, exercise routines, fitness tips',
    keywords: ['fitness', 'workout', 'exercise', 'gym', 'bodybuilding', 'weightlifting', 'cardio', 'strength training'],
    aliases: ['training', 'working out', 'fitness training']
  },
  {
    id: 'nutrition',
    displayName: 'Nutrition & Diet',
    parentCategory: 'health',
    longFormRpm: 8.0,
    shortsRpm: 0.15,
    description: 'Diet, nutrition, healthy eating',
    keywords: ['nutrition', 'diet', 'healthy eating', 'weight loss', 'keto', 'vegan', 'protein', 'vitamins'],
    aliases: ['healthy diet', 'eating healthy', 'meal planning']
  },
  {
    id: 'mental-health',
    displayName: 'Mental Health',
    parentCategory: 'health',
    longFormRpm: 8.0,
    shortsRpm: 0.15,
    description: 'Mental wellness, psychology, therapy',
    keywords: ['mental health', 'psychology', 'therapy', 'anxiety', 'depression', 'mindfulness', 'meditation'],
    aliases: ['mental wellness', 'psychological health']
  },

  // EDUCATION & LEARNING
  {
    id: 'math',
    displayName: 'Mathematics',
    parentCategory: 'education',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'Math tutorials, problem solving',
    keywords: ['mathematics', 'math', 'algebra', 'calculus', 'geometry', 'statistics', 'trigonometry'],
    aliases: ['maths', 'mathematical']
  },
  {
    id: 'science-education',
    displayName: 'Science Education',
    parentCategory: 'education',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'Physics, chemistry, biology tutorials',
    keywords: ['physics', 'chemistry', 'biology', 'science', 'experiments', 'laboratory', 'research'],
    aliases: ['scientific education', 'science learning']
  },
  {
    id: 'language-learning',
    displayName: 'Language Learning',
    parentCategory: 'education',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'Foreign languages, linguistics',
    keywords: ['spanish', 'french', 'german', 'japanese', 'chinese', 'language learning', 'linguistics', 'grammar'],
    aliases: ['foreign language', 'second language']
  },

  // BUSINESS & ENTREPRENEURSHIP
  {
    id: 'digital-marketing',
    displayName: 'Digital Marketing',
    parentCategory: 'business',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'SEO, social media, online marketing',
    keywords: ['digital marketing', 'seo', 'social media marketing', 'google ads', 'facebook ads', 'content marketing'],
    aliases: ['online marketing', 'internet marketing']
  },
  {
    id: 'ecommerce',
    displayName: 'E-commerce',
    parentCategory: 'business',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'Online selling, dropshipping, Amazon FBA',
    keywords: ['ecommerce', 'dropshipping', 'amazon fba', 'shopify', 'online store', 'selling online'],
    aliases: ['e-commerce', 'online business', 'internet business']
  },
  {
    id: 'startup',
    displayName: 'Startups',
    parentCategory: 'business',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'Entrepreneurship, startup advice, funding',
    keywords: ['startup', 'entrepreneur', 'business plan', 'venture capital', 'funding', 'pitch deck'],
    aliases: ['entrepreneurship', 'business startup']
  },

  // CREATIVE & ARTS
  {
    id: 'photography',
    displayName: 'Photography',
    parentCategory: 'creative',
    longFormRpm: 4.5,
    shortsRpm: 0.15,
    description: 'Camera techniques, photo editing, composition',
    keywords: ['photography', 'camera', 'lightroom', 'photoshop', 'portrait', 'landscape', 'editing'],
    aliases: ['photo', 'photographer', 'picture taking']
  },
  {
    id: 'graphic-design',
    displayName: 'Graphic Design',
    parentCategory: 'creative',
    longFormRpm: 4.5,
    shortsRpm: 0.15,
    description: 'Design software, logos, branding',
    keywords: ['graphic design', 'photoshop', 'illustrator', 'logo design', 'branding', 'typography'],
    aliases: ['design', 'visual design', 'graphics']
  },
  {
    id: 'music-production',
    displayName: 'Music Production',
    parentCategory: 'creative',
    longFormRpm: 4.5,
    shortsRpm: 0.15,
    description: 'Music creation, audio engineering, DAWs',
    keywords: ['music production', 'audio engineering', 'mixing', 'mastering', 'fl studio', 'ableton', 'pro tools'],
    aliases: ['music making', 'audio production', 'beat making']
  },

  // FOOD & COOKING
  {
    id: 'cooking',
    displayName: 'Cooking & Recipes',
    parentCategory: 'food',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Recipes, cooking techniques, kitchen tips',
    keywords: ['cooking', 'recipe', 'baking', 'kitchen', 'chef', 'culinary', 'food preparation'],
    aliases: ['recipes', 'cooking tips', 'food']
  },
  {
    id: 'baking',
    displayName: 'Baking & Pastry',
    parentCategory: 'food',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Bread, cakes, pastries, desserts',
    keywords: ['baking', 'bread', 'cake', 'pastry', 'dessert', 'cookies', 'sourdough'],
    aliases: ['bakery', 'pastries', 'desserts']
  },

  // LIFESTYLE & PERSONAL
  {
    id: 'beauty',
    displayName: 'Beauty & Cosmetics',
    parentCategory: 'lifestyle',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Makeup, skincare, beauty tutorials',
    keywords: ['makeup', 'beauty', 'skincare', 'cosmetics', 'foundation', 'lipstick', 'eyeshadow'],
    aliases: ['beauty tips', 'makeup tutorial', 'cosmetic']
  },
  {
    id: 'fashion',
    displayName: 'Fashion & Style',
    parentCategory: 'lifestyle',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Clothing, style, fashion trends',
    keywords: ['fashion', 'style', 'clothing', 'outfit', 'trend', 'designer', 'wardrobe'],
    aliases: ['fashion tips', 'style guide', 'clothing']
  },
  {
    id: 'parenting',
    displayName: 'Parenting & Family',
    parentCategory: 'lifestyle',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Child care, family life, parenting tips',
    keywords: ['parenting', 'kids', 'children', 'family', 'baby', 'toddler', 'pregnancy'],
    aliases: ['child care', 'family life', 'raising kids']
  },

  // TRAVEL & ADVENTURE
  {
    id: 'travel-vlog',
    displayName: 'Travel Vlogs',
    parentCategory: 'travel',
    longFormRpm: 7.0,
    shortsRpm: 0.15,
    description: 'Travel experiences, destinations, culture',
    keywords: ['travel', 'vacation', 'destination', 'tourism', 'backpacking', 'adventure', 'culture'],
    aliases: ['traveling', 'trip', 'journey']
  },

  // AUTOMOTIVE
  {
    id: 'car-reviews',
    displayName: 'Car Reviews',
    parentCategory: 'automotive',
    longFormRpm: 6.5,
    shortsRpm: 0.15,
    description: 'Vehicle reviews, car comparisons',
    keywords: ['car', 'vehicle', 'automobile', 'car review', 'driving', 'automotive', 'truck', 'suv'],
    aliases: ['auto', 'cars', 'vehicles']
  },

  // ENTERTAINMENT
  {
    id: 'movies-tv',
    displayName: 'Movies & TV',
    parentCategory: 'entertainment',
    longFormRpm: 3.5,
    shortsRpm: 0.15,
    description: 'Movie reviews, TV shows, entertainment news',
    keywords: ['movie', 'film', 'tv show', 'television', 'netflix', 'cinema', 'actor', 'actress'],
    aliases: ['movies', 'films', 'tv shows']
  },
  {
    id: 'comedy',
    displayName: 'Comedy & Humor',
    parentCategory: 'entertainment',
    longFormRpm: 3.5,
    shortsRpm: 0.15,
    description: 'Comedy skits, humor, funny content',
    keywords: ['comedy', 'funny', 'humor', 'joke', 'skit', 'stand up', 'meme'],
    aliases: ['funny videos', 'jokes', 'humor']
  },

  // SCIENCE & RESEARCH
  {
    id: 'space',
    displayName: 'Space & Astronomy',
    parentCategory: 'science',
    longFormRpm: 9.0,
    shortsRpm: 0.15,
    description: 'Space exploration, astronomy, universe',
    keywords: ['space', 'astronomy', 'nasa', 'planet', 'star', 'galaxy', 'universe', 'spacex'],
    aliases: ['outer space', 'cosmos', 'celestial']
  },

  // SPORTS & FITNESS
  {
    id: 'football',
    displayName: 'Football/Soccer',
    parentCategory: 'sports',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Football/soccer content, matches, players',
    keywords: ['football', 'soccer', 'fifa', 'world cup', 'premier league', 'champions league'],
    aliases: ['soccer', 'football match']
  },
  {
    id: 'basketball',
    displayName: 'Basketball',
    parentCategory: 'sports',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Basketball content, NBA, gameplay',
    keywords: ['basketball', 'nba', 'lebron james', 'michael jordan', 'dunk', 'three pointer'],
    aliases: ['nba', 'basketball game']
  },

  // ADDITIONAL POPULAR FINANCE & INVESTMENT NICHES
  {
    id: 'dropshipping',
    displayName: 'Dropshipping',
    parentCategory: 'business',
    longFormRpm: 18.0,
    shortsRpm: 0.15,
    description: 'Dropshipping business, e-commerce, online selling',
    keywords: ['dropshipping', 'shopify dropshipping', 'aliexpress', 'oberlo', 'spocket', 'ecommerce business', 'online store'],
    aliases: ['drop shipping', 'online selling', 'ecom', 'e-commerce']
  },
  {
    id: 'affiliate-marketing',
    displayName: 'Affiliate Marketing',
    parentCategory: 'business',
    longFormRpm: 18.0,
    shortsRpm: 0.15,
    description: 'Affiliate marketing strategies, passive income',
    keywords: ['affiliate marketing', 'clickbank', 'commission junction', 'amazon associates', 'passive income', 'affiliate links'],
    aliases: ['affiliate income', 'referral marketing', 'commission marketing']
  },
  {
    id: 'social-media-marketing',
    displayName: 'Social Media Marketing',
    parentCategory: 'business',
    longFormRpm: 18.0,
    shortsRpm: 0.15,
    description: 'Instagram marketing, TikTok growth, social media strategy',
    keywords: ['social media marketing', 'instagram marketing', 'tiktok marketing', 'facebook ads', 'social media growth', 'influencer marketing'],
    aliases: ['smm', 'instagram growth', 'social marketing', 'social media strategy']
  },
  {
    id: 'make-money-online',
    displayName: 'Make Money Online',
    parentCategory: 'business',
    longFormRpm: 18.0,
    shortsRpm: 0.15,
    description: 'Online income strategies, side hustles, remote work',
    keywords: ['make money online', 'side hustle', 'work from home', 'online income', 'freelancing', 'gig economy'],
    aliases: ['online money', 'side income', 'remote income', 'internet money']
  },
  {
    id: 'forex-trading',
    displayName: 'Forex Trading',
    parentCategory: 'finance',
    longFormRpm: 22.0,
    shortsRpm: 0.15,
    description: 'Foreign exchange trading, currency markets',
    keywords: ['forex', 'fx trading', 'currency trading', 'foreign exchange', 'forex signals', 'metatrader'],
    aliases: ['fx', 'currency market', 'forex market', 'foreign exchange trading']
  },
  {
    id: 'day-trading',
    displayName: 'Day Trading',
    parentCategory: 'finance',
    longFormRpm: 22.0,
    shortsRpm: 0.15,
    description: 'Day trading strategies, swing trading, options',
    keywords: ['day trading', 'swing trading', 'options trading', 'scalping', 'trading strategies', 'stock charts'],
    aliases: ['active trading', 'short term trading', 'intraday trading']
  },
  {
    id: 'credit-repair',
    displayName: 'Credit Repair',
    parentCategory: 'finance',
    longFormRpm: 22.0,
    shortsRpm: 0.15,
    description: 'Credit score improvement, debt management',
    keywords: ['credit repair', 'credit score', 'fico score', 'credit report', 'debt consolidation', 'credit cards'],
    aliases: ['credit improvement', 'credit restoration', 'credit building']
  },
  {
    id: 'insurance',
    displayName: 'Insurance',
    parentCategory: 'finance',
    longFormRpm: 22.0,
    shortsRpm: 0.15,
    description: 'Life insurance, health insurance, auto insurance',
    keywords: ['life insurance', 'health insurance', 'auto insurance', 'homeowners insurance', 'insurance quotes'],
    aliases: ['insurance coverage', 'insurance plans', 'insurance advice']
  },

  // POPULAR TECH NICHES
  {
    id: 'artificial-intelligence',
    displayName: 'Artificial Intelligence',
    parentCategory: 'tech',
    longFormRpm: 15.0,
    shortsRpm: 0.15,
    description: 'AI tools, ChatGPT, machine learning tutorials',
    keywords: ['artificial intelligence', 'chatgpt', 'openai', 'ai tools', 'gpt', 'claude', 'midjourney', 'stable diffusion'],
    aliases: ['ai', 'machine intelligence', 'ai technology', 'generative ai']
  },
  {
    id: 'productivity-apps',
    displayName: 'Productivity Apps',
    parentCategory: 'tech',
    longFormRpm: 15.0,
    shortsRpm: 0.15,
    description: 'Notion, productivity software, automation tools',
    keywords: ['notion', 'obsidian', 'todoist', 'productivity apps', 'zapier', 'automation', 'workflow'],
    aliases: ['productivity tools', 'organization apps', 'workflow tools']
  },
  {
    id: 'app-reviews',
    displayName: 'App Reviews',
    parentCategory: 'tech',
    longFormRpm: 15.0,
    shortsRpm: 0.15,
    description: 'Mobile app reviews, software comparisons',
    keywords: ['app review', 'software review', 'app comparison', 'best apps', 'mobile apps', 'productivity software'],
    aliases: ['software comparison', 'app recommendations', 'tech reviews']
  },
  {
    id: 'wordpress',
    displayName: 'WordPress',
    parentCategory: 'tech',
    longFormRpm: 15.0,
    shortsRpm: 0.15,
    description: 'WordPress tutorials, website building, plugins',
    keywords: ['wordpress', 'elementor', 'gutenberg', 'wp plugins', 'website building', 'cms'],
    aliases: ['wp', 'wordpress development', 'wordpress design']
  },

  // POPULAR HEALTH & FITNESS NICHES  
  {
    id: 'weight-loss',
    displayName: 'Weight Loss',
    parentCategory: 'health',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'Weight loss tips, diet plans, transformation',
    keywords: ['weight loss', 'lose weight', 'diet plan', 'fat loss', 'transformation', 'slimming', 'weight management'],
    aliases: ['losing weight', 'fat burning', 'weight reduction', 'slim down']
  },
  {
    id: 'yoga',
    displayName: 'Yoga',
    parentCategory: 'health',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'Yoga poses, meditation, mindfulness',
    keywords: ['yoga', 'yoga poses', 'yoga flow', 'vinyasa', 'hatha yoga', 'yin yoga', 'power yoga'],
    aliases: ['yoga practice', 'yoga workout', 'yoga routine']
  },
  {
    id: 'bodybuilding',
    displayName: 'Bodybuilding',
    parentCategory: 'health',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'Muscle building, strength training, supplements',
    keywords: ['bodybuilding', 'muscle building', 'strength training', 'powerlifting', 'protein', 'supplements', 'bulking'],
    aliases: ['muscle gain', 'strength building', 'mass building']
  },
  {
    id: 'keto-diet',
    displayName: 'Keto Diet',
    parentCategory: 'health',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'Ketogenic diet, low carb recipes, keto lifestyle',
    keywords: ['keto', 'ketogenic diet', 'low carb', 'keto recipes', 'ketosis', 'keto meal prep'],
    aliases: ['ketogenic', 'low carb diet', 'keto lifestyle']
  },

  // POPULAR LIFESTYLE NICHES
  {
    id: 'minimalism',
    displayName: 'Minimalism',
    parentCategory: 'lifestyle',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Minimalist lifestyle, decluttering, simple living',
    keywords: ['minimalism', 'minimalist', 'decluttering', 'simple living', 'marie kondo', 'konmari'],
    aliases: ['minimal living', 'simple life', 'declutter']
  },
  {
    id: 'productivity',
    displayName: 'Productivity',
    parentCategory: 'lifestyle',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Productivity tips, time management, habits',
    keywords: ['productivity', 'time management', 'habits', 'morning routine', 'goal setting', 'self improvement'],
    aliases: ['time management', 'efficiency', 'life optimization']
  },
  {
    id: 'relationships',
    displayName: 'Relationships',
    parentCategory: 'lifestyle',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Dating advice, relationships, love and romance',
    keywords: ['dating', 'relationships', 'dating advice', 'love', 'romance', 'dating tips', 'relationship goals'],
    aliases: ['dating tips', 'relationship advice', 'love advice']
  },
  {
    id: 'self-improvement',
    displayName: 'Self Improvement',
    parentCategory: 'lifestyle',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Personal development, self help, motivation',
    keywords: ['self improvement', 'personal development', 'self help', 'motivation', 'confidence', 'success'],
    aliases: ['personal growth', 'self development', 'life improvement']
  },

  // POPULAR CREATIVE NICHES
  {
    id: 'digital-art',
    displayName: 'Digital Art',
    parentCategory: 'creative',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Digital painting, procreate, art tutorials',
    keywords: ['digital art', 'procreate', 'digital painting', 'ipad art', 'photoshop art', 'digital drawing'],
    aliases: ['digital drawing', 'digital illustration', 'ipad drawing']
  },
  {
    id: 'video-editing',
    displayName: 'Video Editing',
    parentCategory: 'creative',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Video editing tutorials, premiere pro, after effects',
    keywords: ['video editing', 'premiere pro', 'after effects', 'davinci resolve', 'final cut pro', 'filmmaking'],
    aliases: ['video production', 'film editing', 'video creation']
  },
  {
    id: 'logo-design',
    displayName: 'Logo Design',
    parentCategory: 'creative',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Logo design process, branding, graphic design',
    keywords: ['logo design', 'branding', 'brand identity', 'graphic design', 'illustrator tutorials'],
    aliases: ['brand design', 'identity design', 'logo creation']
  },

  // POPULAR GAMING NICHES
  {
    id: 'among-us',
    displayName: 'Among Us',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'Among Us gameplay, strategies, funny moments',
    keywords: ['among us', 'impostor', 'crewmate', 'sus', 'emergency meeting'],
    aliases: ['among us game', 'impostor game']
  },
  {
    id: 'fall-guys',
    displayName: 'Fall Guys',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'Fall Guys gameplay, tips, funny fails',
    keywords: ['fall guys', 'bean guys', 'battle royale', 'party game'],
    aliases: ['fall guys ultimate knockout', 'bean game']
  },
  {
    id: 'genshin-impact',
    displayName: 'Genshin Impact',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'Genshin Impact guides, character builds, gacha',
    keywords: ['genshin impact', 'gacha', 'primogems', 'mihoyo', 'character builds', 'artifacts'],
    aliases: ['genshin', 'gi']
  },
  {
    id: 'pokemon',
    displayName: 'Pokemon',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'Pokemon games, cards, theories, nostalgia',
    keywords: ['pokemon', 'pikachu', 'nintendo', 'pokemon go', 'pokemon cards', 'gamefreak'],
    aliases: ['pokémon', 'pocket monsters']
  },

  // POPULAR FOOD NICHES
  {
    id: 'meal-prep',
    displayName: 'Meal Prep',
    parentCategory: 'food',
    longFormRpm: 3.0,
    shortsRpm: 0.15,
    description: 'Meal preparation, healthy meal prep, food planning',
    keywords: ['meal prep', 'meal planning', 'food prep', 'healthy meal prep', 'weekly meal prep'],
    aliases: ['food preparation', 'meal planning', 'prep cooking']
  },
  {
    id: 'vegan-cooking',
    displayName: 'Vegan Cooking',
    parentCategory: 'food',
    longFormRpm: 3.0,
    shortsRpm: 0.15,
    description: 'Vegan recipes, plant-based cooking, vegan lifestyle',
    keywords: ['vegan', 'plant based', 'vegan recipes', 'vegan cooking', 'plant based diet'],
    aliases: ['plant based cooking', 'vegan food', 'plant based recipes']
  },
  {
    id: 'desserts',
    displayName: 'Desserts',
    parentCategory: 'food',
    longFormRpm: 3.0,
    shortsRpm: 0.15,
    description: 'Dessert recipes, cake decorating, sweet treats',
    keywords: ['desserts', 'cake', 'cupcakes', 'cookies', 'sweet treats', 'cake decorating'],
    aliases: ['sweets', 'sweet recipes', 'dessert making']
  },

  // POPULAR TRAVEL NICHES
  {
    id: 'budget-travel',
    displayName: 'Budget Travel',
    parentCategory: 'travel',
    longFormRpm: 7.0,
    shortsRpm: 0.15,
    description: 'Budget travel tips, cheap flights, backpacking',
    keywords: ['budget travel', 'cheap travel', 'backpacking', 'travel hacks', 'cheap flights'],
    aliases: ['affordable travel', 'low cost travel', 'travel deals']
  },
  {
    id: 'solo-travel',
    displayName: 'Solo Travel',
    parentCategory: 'travel',
    longFormRpm: 7.0,
    shortsRpm: 0.15,
    description: 'Solo travel guides, safety tips, solo adventures',
    keywords: ['solo travel', 'traveling alone', 'solo female travel', 'solo trip', 'independent travel'],
    aliases: ['solo adventure', 'traveling solo', 'independent travel']
  },
  {
    id: 'van-life',
    displayName: 'Van Life',
    parentCategory: 'travel',
    longFormRpm: 7.0,
    shortsRpm: 0.15,
    description: 'Van life adventures, RV living, nomadic lifestyle',
    keywords: ['van life', 'rv life', 'nomad life', 'van conversion', 'mobile living', 'tiny house on wheels'],
    aliases: ['vanlife', 'rv living', 'nomadic life']
  },

  // POPULAR ENTERTAINMENT NICHES
  {
    id: 'movie-reviews',
    displayName: 'Movie Reviews',
    parentCategory: 'entertainment',
    longFormRpm: 3.5,
    shortsRpm: 0.15,
    description: 'Movie reviews, film analysis, cinema critique',
    keywords: ['movie review', 'film review', 'cinema', 'movie analysis', 'film critique'],
    aliases: ['film reviews', 'movie criticism', 'cinema reviews']
  },
  {
    id: 'celebrity-news',
    displayName: 'Celebrity News',
    parentCategory: 'entertainment',
    longFormRpm: 3.5,
    shortsRpm: 0.15,
    description: 'Celebrity gossip, entertainment news, pop culture',
    keywords: ['celebrity', 'celebrity news', 'hollywood', 'entertainment news', 'pop culture', 'gossip'],
    aliases: ['celebrity gossip', 'entertainment gossip', 'star news']
  },
  {
    id: 'reaction-videos',
    displayName: 'Reaction Videos',
    parentCategory: 'entertainment',
    longFormRpm: 3.5,
    shortsRpm: 0.15,
    description: 'Reaction content, first time watching, commentary',
    keywords: ['reaction', 'react', 'first time watching', 'reaction video', 'commentary'],
    aliases: ['reactions', 'react video', 'response video']
  },

  // POPULAR EDUCATIONAL NICHES
  {
    id: 'history',
    displayName: 'History',
    parentCategory: 'education',
    longFormRpm: 12.0,
    shortsRpm: 0.15,
    description: 'Historical documentaries, world history, ancient civilizations',
    keywords: ['history', 'world history', 'ancient history', 'historical facts', 'documentary'],
    aliases: ['historical content', 'history lessons', 'past events']
  },
  {
    id: 'philosophy',
    displayName: 'Philosophy',
    parentCategory: 'education',
    longFormRpm: 12.0,
    shortsRpm: 0.15,
    description: 'Philosophy explained, stoicism, ethics, critical thinking',
    keywords: ['philosophy', 'stoicism', 'ethics', 'critical thinking', 'philosophical concepts'],
    aliases: ['philosophical', 'philosophy lessons', 'thinking']
  },
  {
    id: 'study-tips',
    displayName: 'Study Tips',
    parentCategory: 'education',
    longFormRpm: 12.0,
    shortsRpm: 0.15,
    description: 'Study techniques, exam preparation, learning methods',
    keywords: ['study tips', 'study methods', 'exam prep', 'learning techniques', 'study habits'],
    aliases: ['studying', 'study techniques', 'exam preparation']
  },

  // ADDITIONAL POPULAR NICHES
  {
    id: 'astrology',
    displayName: 'Astrology',
    parentCategory: 'lifestyle',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Astrology readings, zodiac signs, horoscopes',
    keywords: ['astrology', 'zodiac', 'horoscope', 'tarot', 'spirituality', 'zodiac signs'],
    aliases: ['zodiac signs', 'horoscopes', 'spiritual']
  },
  {
    id: 'home-decor',
    displayName: 'Home Decor',
    parentCategory: 'lifestyle',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Interior design, home decoration, DIY home projects',
    keywords: ['home decor', 'interior design', 'home design', 'decorating', 'home improvement'],
    aliases: ['interior decorating', 'home decoration', 'house design']
  },
  {
    id: 'skincare',
    displayName: 'Skincare',
    parentCategory: 'lifestyle',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Skincare routines, anti-aging, acne treatment',
    keywords: ['skincare', 'skin care', 'anti aging', 'acne', 'skincare routine', 'skincare tips'],
    aliases: ['skin care', 'facial care', 'skincare advice']
  },
  {
    id: 'hairdressing',
    displayName: 'Hairdressing',
    parentCategory: 'lifestyle',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'Hair styling, hairdressing techniques, hair care',
    keywords: ['hairdresser', 'hair styling', 'hair care', 'hair tutorial', 'hair cutting', 'hair color'],
    aliases: ['hair stylist', 'hair dresser', 'hair salon', 'barber']
  },
  {
    id: 'pottery',
    displayName: 'Pottery',
    parentCategory: 'creative',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Pottery making, ceramics, clay work',
    keywords: ['pottery', 'ceramics', 'clay', 'pottery wheel', 'ceramic art'],
    aliases: ['ceramic making', 'clay work', 'pottery art']
  },
  {
    id: 'origami',
    displayName: 'Origami',
    parentCategory: 'creative',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Paper folding, origami tutorials, paper crafts',
    keywords: ['origami', 'paper folding', 'paper crafts', 'origami tutorial'],
    aliases: ['paper art', 'paper folding art', 'japanese paper folding']
  },
  {
    id: 'blacksmithing',
    displayName: 'Blacksmithing',
    parentCategory: 'creative',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'Metalworking, forging, traditional crafts',
    keywords: ['blacksmithing', 'forging', 'metalwork', 'blacksmith', 'anvil', 'hammer'],
    aliases: ['metalworking', 'forge work', 'metal crafting']
  },

  // PARENT CATEGORY GENERAL NICHES (so users can search for broad categories)
  {
    id: 'finance-general',
    displayName: 'Finance & Investment',
    parentCategory: 'finance',
    longFormRpm: 22.0,
    shortsRpm: 0.15,
    description: 'General finance content, personal finance, investing, crypto, wealth building',
    keywords: ['finance', 'finance and investment', 'financial', 'money', 'investing general'],
    aliases: ['finance category', 'financial content', 'money content']
  },
  {
    id: 'business-general',
    displayName: 'Business & Entrepreneurship',
    parentCategory: 'business',
    longFormRpm: 18.0,
    shortsRpm: 0.15,
    description: 'General business content, make money online, digital marketing, startups',
    keywords: ['business', 'business and entrepreneurship', 'entrepreneurship', 'business general'],
    aliases: ['business category', 'entrepreneur content', 'business content']
  },
  {
    id: 'tech-general',
    displayName: 'Technology & Software',
    parentCategory: 'tech',
    longFormRpm: 15.0,
    shortsRpm: 0.15,
    description: 'General technology content, programming, AI, software reviews, tech tutorials',
    keywords: ['technology', 'technology and software', 'tech', 'software', 'tech general'],
    aliases: ['technology category', 'tech content', 'software content']
  },
  {
    id: 'education-general',
    displayName: 'Education & Learning',
    parentCategory: 'education',
    longFormRpm: 12.0,
    shortsRpm: 0.15,
    description: 'General educational content, online courses, tutorials, skill development',
    keywords: ['education', 'education and learning', 'learning', 'educational', 'education general'],
    aliases: ['education category', 'learning content', 'educational content']
  },
  {
    id: 'health-general',
    displayName: 'Health & Wellness',
    parentCategory: 'health',
    longFormRpm: 10.0,
    shortsRpm: 0.15,
    description: 'General health content, fitness, nutrition, mental health, medical advice',
    keywords: ['health', 'health and wellness', 'wellness', 'health general'],
    aliases: ['health category', 'wellness content', 'health content']
  },
  {
    id: 'science-general',
    displayName: 'Science & Research',
    parentCategory: 'science',
    longFormRpm: 9.0,
    shortsRpm: 0.15,
    description: 'General science content, scientific research, experiments',
    keywords: ['science', 'science and research', 'scientific', 'science general'],
    aliases: ['science category', 'scientific content', 'research content']
  },
  {
    id: 'automotive-general',
    displayName: 'Automotive & Transportation',
    parentCategory: 'automotive',
    longFormRpm: 8.0,
    shortsRpm: 0.15,
    description: 'General automotive content, car reviews, automotive repair, transportation',
    keywords: ['automotive', 'automotive and transportation', 'cars general', 'automotive general'],
    aliases: ['automotive category', 'car content', 'auto content']
  },
  {
    id: 'travel-general',
    displayName: 'Travel & Adventure',
    parentCategory: 'travel',
    longFormRpm: 7.0,
    shortsRpm: 0.15,
    description: 'General travel content, travel vlogs, destinations, adventure content',
    keywords: ['travel', 'travel and adventure', 'adventure', 'travel general'],
    aliases: ['travel category', 'adventure content', 'travel content']
  },
  {
    id: 'lifestyle-general',
    displayName: 'Lifestyle & Personal',
    parentCategory: 'lifestyle',
    longFormRpm: 6.0,
    shortsRpm: 0.15,
    description: 'General lifestyle content, personal development, relationships, daily life',
    keywords: ['lifestyle', 'lifestyle and personal', 'personal', 'lifestyle general'],
    aliases: ['lifestyle category', 'personal content', 'lifestyle content']
  },
  {
    id: 'sports-general',
    displayName: 'Sports & Fitness',
    parentCategory: 'sports',
    longFormRpm: 5.5,
    shortsRpm: 0.15,
    description: 'General sports content, athletics, fitness routines',
    keywords: ['sports', 'sports and fitness', 'athletics', 'sports general'],
    aliases: ['sports category', 'athletic content', 'sports content']
  },
  {
    id: 'creative-general',
    displayName: 'Creative & Arts',
    parentCategory: 'creative',
    longFormRpm: 5.0,
    shortsRpm: 0.15,
    description: 'General creative content, art, design, music production, photography',
    keywords: ['creative', 'creative and arts', 'arts', 'creative general'],
    aliases: ['creative category', 'art content', 'creative content']
  },
  {
    id: 'gaming-general',
    displayName: 'Gaming & Esports',
    parentCategory: 'gaming',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'General gaming content, video games, streaming, esports, game reviews',
    keywords: ['gaming', 'gaming and esports', 'esports', 'games', 'gaming general'],
    aliases: ['gaming category', 'game content', 'esports content']
  },
  {
    id: 'entertainment-general',
    displayName: 'Entertainment & Comedy',
    parentCategory: 'entertainment',
    longFormRpm: 3.5,
    shortsRpm: 0.15,
    description: 'General entertainment content, movies, TV, comedy, celebrities, pop culture',
    keywords: ['entertainment', 'entertainment and comedy', 'comedy general', 'entertainment general'],
    aliases: ['entertainment category', 'comedy content', 'entertainment content']
  },
  {
    id: 'food-general',
    displayName: 'Food & Cooking',
    parentCategory: 'food',
    longFormRpm: 3.0,
    shortsRpm: 0.15,
    description: 'General food content, recipes, cooking tutorials, food reviews',
    keywords: ['food', 'food and cooking', 'cooking general', 'food general'],
    aliases: ['food category', 'cooking content', 'food content']
  },

  // GENERAL CONTENT
  {
    id: 'general',
    displayName: 'General Content',
    parentCategory: 'general',
    longFormRpm: 4.0,
    shortsRpm: 0.15,
    description: 'Mixed content, vlogging, general topics',
    keywords: ['general', 'vlog', 'misc', 'other', 'mixed content', 'daily life', 'personal'],
    aliases: ['misc', 'other', 'mixed', 'vlogging', 'lifestyle vlog']
  }
];

// Search and mapping functions
export class NicheMapper {
  private static normalizeSearchTerm(term: string): string {
    return term.toLowerCase().trim().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ');
  }

  /**
   * Find exact keyword match
   */
  private static findExactMatch(searchTerm: string): NicheData | null {
    const normalized = this.normalizeSearchTerm(searchTerm);
    
    for (const niche of nicheDatabase) {
      // Check keywords
      if (niche.keywords.some(keyword => 
        this.normalizeSearchTerm(keyword) === normalized
      )) {
        return niche;
      }
      
      // Check aliases
      if (niche.aliases.some(alias => 
        this.normalizeSearchTerm(alias) === normalized
      )) {
        return niche;
      }
      
      // Check display name
      if (this.normalizeSearchTerm(niche.displayName) === normalized) {
        return niche;
      }
    }
    
    return null;
  }

  /**
   * Find partial match (contains search term)
   */
  private static findPartialMatch(searchTerm: string): NicheData | null {
    const normalized = this.normalizeSearchTerm(searchTerm);
    
    for (const niche of nicheDatabase) {
      // Check if any keyword contains the search term
      if (niche.keywords.some(keyword => 
        this.normalizeSearchTerm(keyword).includes(normalized)
      )) {
        return niche;
      }
      
      // Check aliases
      if (niche.aliases.some(alias => 
        this.normalizeSearchTerm(alias).includes(normalized)
      )) {
        return niche;
      }
      
      // Check display name
      if (this.normalizeSearchTerm(niche.displayName).includes(normalized)) {
        return niche;
      }
    }
    
    return null;
  }

  /**
   * Calculate Levenshtein distance for fuzzy matching
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Find fuzzy match for typos and similar terms
   */
  private static findFuzzyMatch(searchTerm: string): NicheData | null {
    const normalized = this.normalizeSearchTerm(searchTerm);
    let bestMatch: NicheData | null = null;
    let bestDistance = Infinity;
    const maxDistance = Math.min(3, Math.floor(normalized.length * 0.3)); // Max 30% character difference
    
    for (const niche of nicheDatabase) {
      // Check keywords
      for (const keyword of niche.keywords) {
        const keywordNormalized = this.normalizeSearchTerm(keyword);
        const distance = this.levenshteinDistance(normalized, keywordNormalized);
        
        if (distance <= maxDistance && distance < bestDistance) {
          bestDistance = distance;
          bestMatch = niche;
        }
      }
      
      // Check aliases
      for (const alias of niche.aliases) {
        const aliasNormalized = this.normalizeSearchTerm(alias);
        const distance = this.levenshteinDistance(normalized, aliasNormalized);
        
        if (distance <= maxDistance && distance < bestDistance) {
          bestDistance = distance;
          bestMatch = niche;
        }
      }
    }
    
    return bestMatch;
  }

  /**
   * Get default "General" category
   */
  private static getDefaultCategory(): NicheData {
    return nicheDatabase.find(niche => niche.id === 'general') || {
      id: 'general',
      displayName: 'General Content',
      parentCategory: 'general',
      longFormRpm: 4.0,
      shortsRpm: 0.15,
      description: 'Mixed content, vlogging, general topics',
      keywords: ['general', 'vlog', 'misc', 'other'],
      aliases: ['misc', 'other', 'mixed']
    };
  }

  /**
   * Main search function with intelligent matching
   */
  public static searchNiche(searchTerm: string): {
    niche: NicheData;
    parentCategory: ParentCategory;
    matchType: 'exact' | 'partial' | 'fuzzy' | 'intelligent' | 'default';
    matchedKeyword?: string;
    confidence?: number;
    reasoning?: string;
    suggestions?: string[];
    isUnknownNiche?: boolean;
  } {
    if (!searchTerm || searchTerm.trim().length === 0) {
      const defaultNiche = this.getDefaultCategory();
      const parentCat = parentCategories.find(cat => cat.id === defaultNiche.parentCategory)!;
      return {
        niche: defaultNiche,
        parentCategory: parentCat,
        matchType: 'default'
      };
    }

    // 1. Try exact match first
    let matchedNiche = this.findExactMatch(searchTerm);
    if (matchedNiche) {
      const parentCat = parentCategories.find(cat => cat.id === matchedNiche!.parentCategory)!;
      return {
        niche: matchedNiche,
        parentCategory: parentCat,
        matchType: 'exact',
        matchedKeyword: searchTerm
      };
    }

    // 2. Try partial match
    matchedNiche = this.findPartialMatch(searchTerm);
    if (matchedNiche) {
      const parentCat = parentCategories.find(cat => cat.id === matchedNiche!.parentCategory)!;
      return {
        niche: matchedNiche,
        parentCategory: parentCat,
        matchType: 'partial',
        matchedKeyword: searchTerm
      };
    }

    // 3. Try fuzzy match for typos
    matchedNiche = this.findFuzzyMatch(searchTerm);
    if (matchedNiche) {
      const parentCat = parentCategories.find(cat => cat.id === matchedNiche!.parentCategory)!;
      return {
        niche: matchedNiche,
        parentCategory: parentCat,
        matchType: 'fuzzy',
        matchedKeyword: searchTerm
      };
    }

    // 4. Try intelligent semantic matching
    const intelligentResult = IntelligentCategoryMapper.enhancedSearch(searchTerm);
    if (intelligentResult.matchType === 'intelligent' && intelligentResult.confidence > 0.3) {
      // Create a virtual niche for the intelligent match
      const virtualNiche: NicheData = {
        id: `intelligent-${intelligentResult.category.id}`,
        displayName: `${searchTerm} (${intelligentResult.category.name})`,
        parentCategory: intelligentResult.category.id,
        longFormRpm: intelligentResult.category.longFormRpm,
        shortsRpm: 0.15,
        description: intelligentResult.category.description,
        keywords: [searchTerm.toLowerCase()],
        aliases: []
      };

      return {
        niche: virtualNiche,
        parentCategory: intelligentResult.category,
        matchType: 'intelligent',
        matchedKeyword: searchTerm,
        confidence: intelligentResult.confidence,
        reasoning: intelligentResult.reasoning,
        suggestions: intelligentResult.suggestions
      };
    }

    // 5. Default to General category and mark as unknown niche
    const defaultNiche = this.getDefaultCategory();
    const parentCat = parentCategories.find(cat => cat.id === defaultNiche.parentCategory)!;
    return {
      niche: defaultNiche,
      parentCategory: parentCat,
      matchType: 'default',
      reasoning: `No relevant category found for "${searchTerm}". Using general content category ($4/1K RPM). We've notified admins to review this niche for potential addition to our database.`,
      isUnknownNiche: true
    };
  }

  /**
   * Get all niches for a specific parent category
   */
  public static getNichesByCategory(categoryId: string): NicheData[] {
    return nicheDatabase.filter(niche => niche.parentCategory === categoryId);
  }

  /**
   * Get suggestions based on partial search
   */
  public static getSuggestions(searchTerm: string, limit: number = 5): NicheData[] {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    const normalized = this.normalizeSearchTerm(searchTerm);
    const suggestions: { niche: NicheData; score: number }[] = [];

    for (const niche of nicheDatabase) {
      let bestScore = 0;

      // Check keywords for partial matches
      for (const keyword of niche.keywords) {
        const keywordNormalized = this.normalizeSearchTerm(keyword);
        if (keywordNormalized.includes(normalized)) {
          bestScore = Math.max(bestScore, normalized.length / keywordNormalized.length);
        }
      }

      // Check aliases
      for (const alias of niche.aliases) {
        const aliasNormalized = this.normalizeSearchTerm(alias);
        if (aliasNormalized.includes(normalized)) {
          bestScore = Math.max(bestScore, normalized.length / aliasNormalized.length);
        }
      }

      // Check display name
      const displayNameNormalized = this.normalizeSearchTerm(niche.displayName);
      if (displayNameNormalized.includes(normalized)) {
        bestScore = Math.max(bestScore, normalized.length / displayNameNormalized.length);
      }

      if (bestScore > 0) {
        suggestions.push({ niche, score: bestScore });
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.niche);
  }
}