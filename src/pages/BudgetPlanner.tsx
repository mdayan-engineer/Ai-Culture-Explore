import { useState } from 'react';
import { DollarSign, Loader2, MapPin, Calendar, Users, Calculator } from 'lucide-react';

export default function BudgetPlanner() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/budget-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResults(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'accommodation', label: 'Accommodation' },
    { key: 'food', label: 'Food & Dining' },
    { key: 'transport', label: 'Transportation' },
    { key: 'activities', label: 'Activities & Tours' },
    { key: 'shopping', label: 'Shopping' },
    { key: 'emergency', label: 'Emergency Fund' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Budget Planner</h1>
        <p className="mt-2 text-gray-500">AI-optimized spending breakdown for your trip.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Destination
              </label>
              <input name="destination" required placeholder="e.g. Paris, France" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Total Budget
              </label>
              <input name="totalBudget" required placeholder="e.g. $3000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Duration
              </label>
              <input name="duration" required placeholder="e.g. 7 days" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" /> Group Type
              </label>
              <select name="groupType" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                <option value="Solo">Solo Traveler</option>
                <option value="Couple">Couple</option>
                <option value="Family">Family</option>
                <option value="Group of Friends">Group of Friends</option>
              </select>
            </div>
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
            {loading ? 'Calculating...' : 'Optimize Budget'}
          </button>
        </form>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map(({ key, label }) => (
              results[key] && (
                <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{results[key].amount}</p>
                    <p className="text-sm text-gray-600">{results[key].description}</p>
                  </div>
                </div>
              )
            ))}
          </div>
          
          {results.optimizationTips && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cost-Saving Tips</h3>
              <ul className="space-y-2">
                {results.optimizationTips.map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
