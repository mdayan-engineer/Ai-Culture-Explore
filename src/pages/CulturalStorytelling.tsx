import { useState } from 'react';
import { BookOpen, Loader2, MapPin, Search } from 'lucide-react';

export default function CulturalStorytelling() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/cultural-storytelling', {
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

  const sections = [
    { key: 'historicalBackground', label: 'Historical Background' },
    { key: 'culturalSignificance', label: 'Cultural Significance' },
    { key: 'localLegends', label: 'Local Legends' },
    { key: 'architecture', label: 'Architecture' },
    { key: 'traditionalCustoms', label: 'Traditional Customs' },
    { key: 'localEtiquette', label: 'Local Etiquette' },
    { key: 'photographyTips', label: 'Photography Tips' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cultural Storytelling</h1>
        <p className="mt-2 text-gray-500">Dive deep into the soul of your destination.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              name="destination" 
              required 
              placeholder="e.g. Kyoto, Japan or The Colosseum" 
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            />
          </div>
          <button disabled={loading} className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
            {loading ? 'Discovering...' : 'Learn'}
          </button>
        </form>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map(({ key, label }) => (
            results[key] && (
              <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-indigo-600">{label}</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{results[key]}</p>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
