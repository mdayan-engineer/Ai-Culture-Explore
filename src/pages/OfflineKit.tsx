import { useState } from 'react';
import { DownloadCloud, Loader2, MapPin } from 'lucide-react';

export default function OfflineKit() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/offline-kit', {
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Offline Travel Kit</h1>
        <p className="mt-2 text-gray-500">Generate a survival kit of phrases, maps, and info for when you have no signal.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              name="destination" 
              required 
              placeholder="e.g. Marrakesh, Morocco" 
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            />
          </div>
          <button disabled={loading} className="px-6 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <DownloadCloud className="w-5 h-5" />}
            {loading ? 'Generating...' : 'Generate Kit'}
          </button>
        </form>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Phrases */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Emergency & Basic Phrases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.emergencyPhrases?.map((p: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">{p.phrase}</p>
                    <p className="text-lg font-bold text-teal-700 mb-1">{p.translation}</p>
                    <p className="text-sm font-mono text-gray-600">{p.pronunciation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Currency Info</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-teal-600">{results.currencyInfo?.symbol}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{results.currencyInfo?.name}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{results.currencyInfo?.conversionTip}</p>
            </div>

            {/* Maps & Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Areas to Download Maps</h3>
              <ul className="space-y-2 mb-6">
                {results.keyAreasToDownloadMap?.map((area: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-500 mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">Embassy / Emergency Info</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{results.embassyInfo}</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
