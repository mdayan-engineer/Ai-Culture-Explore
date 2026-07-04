import { useState, useEffect } from 'react';
import { Search, Loader2, MapPin, Calendar, DollarSign, Users, Bookmark } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { initFirebase, getFirebaseDb } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

function DestinationMarkers({ destinations }: { destinations: any[] }) {
  const placesLib = useMapsLibrary('places');
  const map = useMap();
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);

  useEffect(() => {
    if (!placesLib || !map || destinations.length === 0) return;
    
    let allPlaces: google.maps.places.Place[] = [];
    let bounds = new google.maps.LatLngBounds();
    let fetches = destinations.map(dest => 
      placesLib.Place.searchByText({
        textQuery: dest.name,
        fields: ['displayName', 'location', 'formattedAddress'],
        maxResultCount: 1,
      }).then(({ places }) => {
        if (places && places[0]) {
          allPlaces.push(places[0]);
          if(places[0].location) {
             bounds.extend(places[0].location);
          }
        }
      })
    );

    Promise.all(fetches).then(() => {
      setPlaces(allPlaces);
      if(allPlaces.length > 0) {
        map.fitBounds(bounds, 50); // 50px padding
      }
    });

  }, [placesLib, map, destinations]);

  return (
    <>
      {places.map((p, idx) => p.location ? (
        <AdvancedMarker key={p.id || idx} position={p.location} title={p.displayName}>
           <Pin background="#4F46E5" glyphColor="#fff" borderColor="#312E81" />
        </AdvancedMarker>
      ) : null)}
    </>
  );
}

export default function Discovery() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/discover-destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResults(json);
      setSaving({});
      setSaved({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveDestination = async (dest: any, idx: number) => {
    if (!user) return alert("Please log in to save destinations");
    setSaving(prev => ({ ...prev, [idx]: true }));
    try {
      await initFirebase();
      const db = getFirebaseDb();
      await addDoc(collection(db, 'users', user.uid, 'savedDestinations'), {
        ...dest,
        savedAt: serverTimestamp()
      });
      setSaved(prev => ({ ...prev, [idx]: true }));
    } catch (e) {
      console.error(e);
      alert("Failed to save.");
    } finally {
      setSaving(prev => ({ ...prev, [idx]: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Destination Discovery</h1>
        <p className="mt-2 text-gray-500">Let AI find your perfect travel match.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Country / Region
                  </label>
                  <input name="country" required placeholder="e.g. Japan, Europe" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Budget
                  </label>
                  <input name="budget" required placeholder="e.g. $2000, Mid-range" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Duration
                  </label>
                  <input name="duration" required placeholder="e.g. 10 days" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Group Type
                  </label>
                  <select name="groupType" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                    <option value="Solo">Solo Traveler</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family with kids</option>
                    <option value="Friends">Group of friends</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Interests</label>
                <input name="interests" required placeholder="e.g. History, Street Food, Architecture" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
              </div>

              <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {loading ? 'Finding Destinations...' : 'Discover Destinations'}
              </button>
            </form>
          </div>

          {results && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
              <div className="grid grid-cols-1 gap-6">
                {results.map((dest, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                          {dest.name}
                          <button
                            onClick={() => saveDestination(dest, idx)}
                            disabled={saving[idx] || saved[idx]}
                            className={`p-1.5 rounded-md transition-colors ${saved[idx] ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-50'}`}
                            title={saved[idx] ? "Saved" : "Save to Favorites"}
                          >
                            {saving[idx] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bookmark className="w-5 h-5" fill={saved[idx] ? "currentColor" : "none"} />}
                          </button>
                        </h3>
                      </div>
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2">
                        {dest.bestSeason}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">{dest.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl mb-4">
                      <div>
                        <span className="block text-gray-500 font-medium mb-1">Estimated Budget</span>
                        <span className="font-semibold text-gray-900">{dest.estimatedBudget}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500 font-medium mb-1">Safety Note</span>
                        <span className="font-semibold text-gray-900">{dest.safety}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {dest.tags?.map((tag: string) => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="h-[600px] lg:h-auto lg:min-h-[800px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 sticky top-8">
           <Map
            defaultCenter={{lat: 20, lng: 0}}
            defaultZoom={2}
            mapId="DESTINATION_DISCOVERY_MAP"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{width: '100%', height: '100%'}}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            {results && <DestinationMarkers destinations={results} />}
          </Map>
        </div>
      </div>
    </div>
  );
}
