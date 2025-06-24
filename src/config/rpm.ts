// Revenue Per Mille (RPM) estimates by niche in USD
export const nicheRPM = {
  // Long-form video RPM
  longForm: {
    'Finance': 15.0,
    'Tech': 12.0,
    'Education': 10.0,
    'Business': 10.0,
    'Real Estate': 9.0,
    'Health': 8.0,
    'Travel': 7.0,
    'Food': 6.0,
    'Beauty': 6.0,
    'Fitness': 5.0,
    'Gaming': 4.0,
    'Entertainment': 3.5,
    'Music': 3.0,
    'General': 4.0,
  },
  // Shorts RPM (typically lower)
  shorts: {
    'Finance': 0.10,
    'Tech': 0.08,
    'Education': 0.07,
    'Business': 0.07,
    'Real Estate': 0.06,
    'Health': 0.05,
    'Travel': 0.05,
    'Food': 0.04,
    'Beauty': 0.04,
    'Fitness': 0.03,
    'Gaming': 0.03,
    'Entertainment': 0.02,
    'Music': 0.02,
    'General': 0.03,
  }
};

export function getRPM(niche: string, isShort: boolean): number {
  const rpmTable = isShort ? nicheRPM.shorts : nicheRPM.longForm;
  return rpmTable[niche as keyof typeof rpmTable] || rpmTable['General'];
}

export function calculateRevenue(views: number, niche: string, isShort: boolean): number {
  const rpm = getRPM(niche, isShort);
  return (views / 1000) * rpm;
}