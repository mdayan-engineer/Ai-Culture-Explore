import { useState, useEffect, useRef } from 'react';
import { CalendarDays, Loader2, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

function RouteDisplay({ activities }: { activities: any[] }) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const placesLib = useMapsLibrary('places');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!routesLib || !placesLib || !map || !activities || activities.length < 2) return;
    
    // Clear previous
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    markersRef.current.forEach(m => m.map = null);
    markersRef.current = [];

    const getPlaceId = async (query: string) => {
      const res = await placesLib.Place.searchByText({
        textQuery: query,
        fields: ['id', 'location'],
        maxResultCount: 1,
      });
      return res.places[0];
    };

    const computeRoutes = async () => {
      const places = await Promise.all(activities.map(a => getPlaceId(a.name)));
      const validPlaces = places.filter(Boolean);
      
      if (validPlaces.length < 2) return;

      validPlaces.forEach((place, index) => {
         if(!place.location) return;
         const { AdvancedMarkerElement, PinElement } = google.maps.marker as any;
         if(AdvancedMarkerElement && PinElement) {
            const pin = new PinElement({
              background: '#4F46E5',
              glyphColor: '#fff',
              borderColor: '#312E81',
              glyph: String(index + 1)
            });
            const marker = new AdvancedMarkerElement({
              position: place.location,
              map,
              title: activities[index].name,
              content: pin.element
            });
            markersRef.current.push(marker);
         }
      });

      const originPlace = validPlaces[0];
      const destinationPlace = validPlaces[validPlaces.length - 1];
      const waypointsPlaces = validPlaces.slice(1, -1);

      try {
        const { routes } = await routesLib.Route.computeRoutes({
          origin: { placeId: originPlace.id },
          destination: { placeId: destinationPlace.id },
          intermediates: waypointsPlaces.map(p => ({ placeId: p.id })),
          travelMode: 'DRIVING',
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
        } as any);

        if (routes?.[0]) {
          const newPolylines = routes[0].createPolylines();
          newPolylines.forEach(p => p.setMap(map));
          polylinesRef.current = newPolylines;
          if (routes[0].viewport) map.fitBounds(routes[0].viewport);
        }
      } catch (err) {
        console.error("Route calculation failed:", err);
      }
    };

    computeRoutes();

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      markersRef.current.forEach(m => m.map = null);
    };
  }, [routesLib, placesLib, map, activities]);

  return null;
}

export default function Itinerary() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResults(json);
      setActiveDayIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeActivities = results?.[activeDayIndex]?.activities || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Smart Itinerary</h1>
        <p className="mt-2 text-gray-500">Generate a personalized day-by-day travel plan.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Destination
                  </label>
                  <input name="destination" required placeholder="e.g. Kyoto, Japan" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Duration
                  </label>
                  <input name="duration" required placeholder="e.g. 3 days" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Budget
                  </label>
                  <input name="budget" required placeholder="e.g. $500" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Interests & Pace</label>
                <input name="interests" required placeholder="e.g. Relaxed pace, lots of temples, sushi" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
              </div>

              <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CalendarDays className="w-5 h-5" />}
                {loading ? 'Generating Itinerary...' : 'Create Itinerary'}
              </button>
            </form>
          </div>

          {results && (
            <div className="space-y-8">
              {results.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden cursor-pointer transition-all ${activeDayIndex === idx ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-100'}`}
                  onClick={() => setActiveDayIndex(idx)}
                >
                  <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-indigo-900">Day {day.dayNumber}</h3>
                    <span className="text-sm font-medium text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">{day.theme}</span>
                  </div>
                  <div className="p-6">
                    <div className="relative border-l border-gray-200 ml-4 space-y-8">
                      {day.activities?.map((activity: any, actIdx: number) => (
                        <div key={actIdx} className="pl-8 relative">
                          <div className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5 ring-4 ring-white ${activeDayIndex === idx ? 'bg-indigo-600' : 'bg-gray-400'}`} />
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 block">
                            {activity.timeOfDay}
                          </span>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{activity.name}</h4>
                          <p className="text-gray-600 mb-3">{activity.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                              <Clock className="w-4 h-4" /> {activity.travelTime}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                              <DollarSign className="w-4 h-4" /> {activity.estimatedCost}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                              <MapPin className="w-4 h-4" /> {activity.transportSuggestion}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="h-[600px] xl:h-auto xl:min-h-[800px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 sticky top-8">
          <Map
            defaultCenter={{lat: 20, lng: 0}}
            defaultZoom={2}
            mapId="ITINERARY_MAP"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{width: '100%', height: '100%'}}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
             {activeActivities.length > 0 && <RouteDisplay activities={activeActivities} />}
          </Map>
        </div>
      </div>
    </div>
  );
}
