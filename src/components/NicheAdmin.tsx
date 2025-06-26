import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Search, Trash2, Save, X, Database, TrendingUp } from 'lucide-react';
import { nicheDatabase, parentCategories, NicheMapper, type NicheData, type ParentCategory } from '@/data/nicheDatabase';

interface NicheAdminProps {
  onClose?: () => void;
}

const NicheAdmin: React.FC<NicheAdminProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNiche, setEditingNiche] = useState<NicheData | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchAnalytics, setSearchAnalytics] = useState<Record<string, number>>({});

  // Simulate search analytics
  useEffect(() => {
    const mockAnalytics: Record<string, number> = {
      'javascript': 1250,
      'react': 980,
      'python': 1500,
      'minecraft': 2200,
      'roblox': 1800,
      'bitcoin': 890,
      'cooking': 650,
      'makeup': 720,
      'fitness': 540,
      'photography': 430,
      'cars': 380,
      'travel': 310
    };
    setSearchAnalytics(mockAnalytics);
  }, []);

  const handleSaveNiche = () => {
    if (editingNiche) {
      // In a real app, this would save to database
      console.log('Saving niche:', editingNiche);
      setEditingNiche(null);
    }
  };

  const handleAddKeyword = (nicheId: string) => {
    if (newKeyword.trim()) {
      const niche = nicheDatabase.find(n => n.id === nicheId);
      if (niche) {
        niche.keywords.push(newKeyword.trim().toLowerCase());
        setNewKeyword('');
      }
    }
  };

  const handleRemoveKeyword = (nicheId: string, keyword: string) => {
    const niche = nicheDatabase.find(n => n.id === nicheId);
    if (niche) {
      niche.keywords = niche.keywords.filter(k => k !== keyword);
    }
  };

  const filteredNiches = nicheDatabase.filter(niche => {
    const matchesSearch = !searchTerm || 
      niche.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      niche.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || niche.parentCategory === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              Niche Admin Panel
            </h1>
            <p className="text-gray-600 mt-2">Manage keywords, categories, and search analytics</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Database },
                { id: 'keywords', label: 'Keyword Management', icon: Edit3 },
                { id: 'analytics', label: 'Search Analytics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Categories</h3>
                    <p className="text-3xl font-bold text-blue-600">{parentCategories.length}</p>
                    <p className="text-sm text-blue-700 mt-1">Main RPM categories</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Total Niches</h3>
                    <p className="text-3xl font-bold text-green-600">{nicheDatabase.length}</p>
                    <p className="text-sm text-green-700 mt-1">Specific sub-niches</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Total Keywords</h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {nicheDatabase.reduce((sum, niche) => sum + niche.keywords.length + niche.aliases.length, 0)}
                    </p>
                    <p className="text-sm text-purple-700 mt-1">Searchable terms</p>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {parentCategories.map((category) => {
                      const nicheCount = nicheDatabase.filter(n => n.parentCategory === category.id).length;
                      const keywordCount = nicheDatabase
                        .filter(n => n.parentCategory === category.id)
                        .reduce((sum, niche) => sum + niche.keywords.length + niche.aliases.length, 0);
                      
                      return (
                        <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <div>RPM: ${category.longFormRpm}/1K views</div>
                            <div>{nicheCount} sub-niches</div>
                            <div>{keywordCount} keywords</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Keywords Management Tab */}
            {activeTab === 'keywords' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search niches or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {parentCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Niches List */}
                <div className="space-y-4">
                  {filteredNiches.map((niche) => {
                    const parentCategory = parentCategories.find(c => c.id === niche.parentCategory);
                    const isEditing = editingNiche?.id === niche.id;
                    
                    return (
                      <div key={niche.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">{niche.displayName}</h4>
                              <span className={`px-2 py-1 text-xs rounded bg-${parentCategory?.color || 'gray'}-100 text-${parentCategory?.color || 'gray'}-700`}>
                                {parentCategory?.name}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{niche.description}</p>
                            
                            {/* Keywords */}
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Keywords:</h5>
                              <div className="flex flex-wrap gap-1">
                                {niche.keywords.map((keyword) => (
                                  <span
                                    key={keyword}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                  >
                                    {keyword}
                                    <button
                                      onClick={() => handleRemoveKeyword(niche.id, keyword)}
                                      className="hover:text-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Aliases */}
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Aliases:</h5>
                              <div className="flex flex-wrap gap-1">
                                {niche.aliases.map((alias) => (
                                  <span
                                    key={alias}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                  >
                                    {alias}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Add New Keyword */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add new keyword..."
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddKeyword(niche.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleAddKeyword(niche.id)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => setEditingNiche(isEditing ? null : niche)}
                            className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Analytics (Last 30 Days)</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Search Term
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Searches
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mapped Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Match Type
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(searchAnalytics)
                          .sort(([,a], [,b]) => b - a)
                          .map(([term, count]) => {
                            // For the admin panel, we'll show simulated results
                            // In a real implementation, you'd cache results or use a different approach
                            const mockResult = {
                              parentCategory: { name: term.includes('script') ? 'Technology' : 
                                                    term.includes('cyber') ? 'Gaming' : 
                                                    term.includes('coin') ? 'Finance' : 
                                                    term.includes('cook') ? 'Food' : 'General' },
                              matchType: term.includes('script') ? 'exact' : 
                                        term.includes('cyber') ? 'ai_semantic' : 
                                        'partial'
                            } as { parentCategory: { name: string }, matchType: 'exact' | 'partial' | 'fuzzy' | 'ai_semantic' };
                            
                            return (
                              <tr key={term}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {term}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {count.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {mockResult.parentCategory.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    mockResult.matchType === 'exact' ? 'bg-green-100 text-green-800' :
                                    mockResult.matchType === 'partial' ? 'bg-blue-100 text-blue-800' :
                                    mockResult.matchType === 'fuzzy' ? 'bg-yellow-100 text-yellow-800' :
                                    mockResult.matchType === 'ai_semantic' ? 'bg-indigo-100 text-indigo-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {mockResult.matchType}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicheAdmin;