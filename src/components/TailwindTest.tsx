export default function TailwindTest() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        Simple YouTube <span className="text-blue-600">Analytics</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Get clear, actionable insights about any YouTube channel's performance and growth potential.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Channel Overview</h3>
          <p className="text-gray-600 text-sm">Current stats, growth rate, and revenue estimates</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Performance</h3>
          <p className="text-gray-600 text-sm">Last 20 videos analysis and content insights</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Projections</h3>
          <p className="text-gray-600 text-sm">Realistic forecasts and milestone predictions</p>
        </div>
      </div>
    </div>
  );
}