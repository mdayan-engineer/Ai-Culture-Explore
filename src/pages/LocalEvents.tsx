import { useState } from 'react';
import { Calendar as CalendarIcon, Loader2, MapPin, Search } from 'lucide-react';

export default function LocalEvents() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/local-events', {
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Local Events</h1>
        <p className="mt-2 text-gray-500">Find festivals, music, and cultural performances during your stay.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              name="city" 
              required 
              placeholder="e.g. New Orleans" 
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            />
          </div>
          <div className="flex-1 relative">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              name="dates" 
              required 
              placeholder="e.g. October 15-20" 
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            />
          </div>
          <button disabled={loading} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {loading ? 'Searching...' : 'Find Events'}
          </button>
        </form>
      </div>

      {results && (
        <div className="grid grid-cols-1 gap-6">
          {results.map((event, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
              <div className="md:w-1/4 shrink-0 border-r border-gray-100 pr-6">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2">{event.type}</span>
                <span className="font-semibold text-gray-900">{event.estimatedDates}</span>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
