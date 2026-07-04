import { useState } from 'react';
import { ShieldAlert, Loader2, MapPin, Search } from 'lucide-react';

export default function SafetyAdvisor() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/safety-advisor', {
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
    { key: 'commonScams', label: 'Common Scams to Avoid' },
    { key: 'touristWarnings', label: 'Tourist Warnings' },
    { key: 'healthTips', label: 'Health & Medical Tips' },
    { key: 'culturalEtiquette', label: 'Cultural Etiquette & Laws' },
    { key: 'femaleTravelerSafety', label: "Women's Safety Recommendations" },
    { key: 'emergencyContacts', label: 'Emergency Contacts' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Safety Advisor</h1>
        <p className="mt-2 text-gray-500">Stay secure with AI-generated local safety tips and emergency info.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              name="destination" 
              required 
              placeholder="e.g. Rio de Janeiro, Brazil" 
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            />
          </div>
          <button disabled={loading} className="px-6 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
            {loading ? 'Analyzing...' : 'Get Safety Report'}
          </button>
        </form>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map(({ key, label }) => (
            results[key] && results[key].length > 0 && (
              <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{label}</h3>
                <ul className="space-y-3">
                  {results[key].map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-rose-500 mt-0.5">•</span>
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
