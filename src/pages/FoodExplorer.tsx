import { useState } from 'react';
import { Utensils, Loader2, MapPin, Search } from 'lucide-react';

export default function FoodExplorer() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/local-food', {
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
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'streetFood', label: 'Street Food' },
    { key: 'desserts', label: 'Desserts' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Food Explorer</h1>
        <p className="mt-2 text-gray-500">Discover authentic local dishes and street food.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Destination
              </label>
              <input name="destination" required placeholder="e.g. Bangkok, Thailand" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Utensils className="w-4 h-4" /> Dietary Preferences
              </label>
              <input name="dietaryPreferences" placeholder="e.g. Vegetarian, Halal, None" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
          </div>
          
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {loading ? 'Curating Food Guide...' : 'Explore Local Food'}
          </button>
        </form>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(({ key, label }) => (
            results[key] && results[key].length > 0 && (
              <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{label}</h3>
                <ul className="space-y-4">
                  {results[key].map((item: any, idx: number) => (
                    <li key={idx} className="flex flex-col">
                      <span className="font-semibold text-indigo-600">{item.name}</span>
                      <span className="text-sm text-gray-600">{item.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
