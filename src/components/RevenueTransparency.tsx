import { useState } from 'react';
import { ValidationComparison, generateTransparencyReport } from '@/utils/validationAndComparison';
import { ChevronDown, ChevronUp, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface RevenueTransparencyProps {
  comparison: ValidationComparison;
}

export default function RevenueTransparency({ comparison }: RevenueTransparencyProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'methodology' | 'comparison' | 'sources'>('methodology');

  const { ourEstimate, socialBladeRealistic, accuracy } = comparison;

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAccuracyIcon = (accuracy: string) => {
    switch (accuracy) {
      case 'high': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Revenue Calculation Methodology</h3>
              <p className="text-sm text-gray-600">How we calculate earnings and compare to industry standards</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getAccuracyColor(accuracy.accuracy)}`}>
              {getAccuracyIcon(accuracy.accuracy)}
              {accuracy.accuracy.toUpperCase()} ACCURACY
            </div>
            {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Our Estimate</p>
              <p className="text-2xl font-bold text-blue-900">${ourEstimate.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-blue-600">Long-form + Shorts</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Social Blade Est.</p>
              <p className="text-2xl font-bold text-gray-900">${socialBladeRealistic.realisticEstimate.toFixed(2)}</p>
              <p className="text-xs text-gray-600">Industry standard</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Accuracy</p>
              <p className="text-2xl font-bold text-green-900">{(100 - accuracy.differencePct).toFixed(1)}%</p>
              <p className="text-xs text-green-600">Vs. industry methods</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'methodology', label: 'Our Methodology' },
                { id: 'comparison', label: 'Industry Comparison' },
                { id: 'sources', label: 'Data Sources' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'methodology' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How We Calculate Revenue</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 font-mono">{ourEstimate.methodology}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">✅ Our Advantages</h5>
                  <ul className="space-y-1">
                    {comparison.methodology.ourAdvantages.map((advantage, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">⚠️ Our Limitations</h5>
                  <ul className="space-y-1">
                    {comparison.methodology.ourLimitations.map((limitation, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">vs. Social Blade</h4>
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">InsightSync (Our Method)</h5>
                      <p className="text-sm text-blue-700 mb-2">
                        Long-form: ${ourEstimate.longFormRevenue.toFixed(2)} at ${ourEstimate.longFormRPM} RPM
                      </p>
                      <p className="text-sm text-blue-700 mb-2">
                        Shorts: ${ourEstimate.shortsRevenue.toFixed(2)} at $${ourEstimate.shortsRPM} RPM
                      </p>
                      <p className="font-semibold text-blue-900">Total: ${ourEstimate.totalRevenue.toFixed(2)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Social Blade Method</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        Range: ${socialBladeRealistic.conservativeEstimate.toFixed(2)} - ${socialBladeRealistic.optimisticEstimate.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        Realistic: ${socialBladeRealistic.realisticEstimate.toFixed(2)}
                      </p>
                      <p className="font-semibold text-gray-900">Generic CPM approach</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">Key Differences</h5>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-yellow-900 mb-1">Social Blade Limitations:</p>
                        <ul className="space-y-1 text-yellow-700">
                          {comparison.methodology.socialBladeLimitations.map((limitation, index) => (
                            <li key={index}>• {limitation}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-yellow-900 mb-1">Why We're More Accurate:</p>
                        <ul className="space-y-1 text-yellow-700">
                          <li>• Uses 2024 industry-verified RPM data</li>
                          <li>• Separates Shorts ($0.15 RPM) from long-form</li>
                          <li>• Niche-specific calculations</li>
                          <li>• Based on actual creator earnings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Sources & Research</h4>
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-900 mb-2">Industry Reports (2024)</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• TubeBuddy Creator Analytics and Earnings Reports</li>
                      <li>• Viralyft YouTube Monetization Analysis</li>
                      <li>• Tubular Labs CPM Benchmarks Study</li>
                      <li>• Influencer Marketing Hub Creator Economy Report</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Creator Earnings Disclosures</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Joshua Mayo (Finance): $29.30 RPM verified</li>
                      <li>• Tech review channels: $8-$25 RPM range</li>
                      <li>• Gaming creators: $3-$6 RPM documented</li>
                      <li>• Real estate channels: $30-$75 RPM reported</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium text-purple-900 mb-2">Platform Documentation</h5>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• YouTube Partner Program revenue sharing (55% to creators)</li>
                      <li>• YouTube Shorts monetization structure</li>
                      <li>• Google AdSense payout documentation</li>
                      <li>• YouTube Creator Studio analytics methodology</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Last Updated:</strong> December 2024 | 
                  <strong> Confidence Level:</strong> High (based on verified creator data) | 
                  <strong> Next Update:</strong> Monthly with fresh industry data
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}