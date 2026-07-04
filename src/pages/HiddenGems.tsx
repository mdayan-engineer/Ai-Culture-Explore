import { useState } from 'react';
import { Gem, Loader2, MapPin, Search } from 'lucide-react';

export default function HiddenGems() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/hidden-gems', {
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hidden Gems</h1>
        <p className="mt-2 text-gray-500">Skip the tourist traps and find local secrets.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              name="destination" 
              required 
              placeholder="e.g. Barcelona, Spain" 
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            />
          </div>
          <button disabled={loading} className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gem className="w-5 h-5" />}
            {loading ? 'Finding Gems...' : 'Find Gems'}
          </button>
        </form>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((gem, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{gem.name}</h3>
                <span className="bg-rose-50 text-rose-600 text-xs font-semibold px-2 py-1 rounded-md">
                  {gem.category}
                </span>
              </div>
              <p className="text-gray-700 mb-4 text-sm">{gem.description}</p>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Why It's Special</span>
                <p className="text-sm text-gray-800">{gem.whyItsSpecial}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
