import { useState } from 'react';
import { Briefcase, Loader2, MapPin, Calendar, Cloud, CheckSquare } from 'lucide-react';

export default function Packing() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/packing-assistant', {
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
    { key: 'clothes', label: 'Clothes' },
    { key: 'electronics', label: 'Electronics' },
    { key: 'documents', label: 'Documents' },
    { key: 'medicine', label: 'Medicine' },
    { key: 'emergencyKit', label: 'Emergency Kit' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Packing Assistant</h1>
        <p className="mt-2 text-gray-500">Never forget an essential item again.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Destination
              </label>
              <input name="destination" required placeholder="e.g. Iceland" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Duration
              </label>
              <input name="duration" required placeholder="e.g. 7 days" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Cloud className="w-4 h-4" /> Weather
              </label>
              <input name="weather" required placeholder="e.g. Cold, Rainy" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
          </div>
          
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Briefcase className="w-5 h-5" />}
            {loading ? 'Generating List...' : 'Generate Packing List'}
          </button>
        </form>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(({ key, label }) => (
            results[key] && results[key].length > 0 && (
              <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-500" /> {label}
                </h3>
                <ul className="space-y-2">
                  {results[key].map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="mt-1 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                      <span>{item}</span>
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
