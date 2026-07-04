import { useState } from 'react';
import { Languages, Loader2, Search } from 'lucide-react';

export default function TranslatorAssistant() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/translator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI Translator</h1>
        <p className="mt-2 text-gray-500">Translate phrases with cultural context and pronunciation.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phrase</label>
              <input name="phrase" required placeholder="e.g. Can you make this vegetarian?" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Target Language / Locale</label>
              <input name="language" required placeholder="e.g. Japanese (Osaka dialect)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Languages className="w-5 h-5" />}
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
          <div className="bg-indigo-50 p-6 border-b border-indigo-100">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 block">Translation</span>
            <h2 className="text-3xl font-bold text-gray-900">{result.translated}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Pronunciation</span>
              <p className="text-lg font-mono text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 inline-block">{result.pronunciation}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Cultural Context & Usage</span>
              <p className="text-gray-700 leading-relaxed">{result.context}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
