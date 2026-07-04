import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { initFirebase, getFirebaseDb } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Plane, Users, MapPin, Plus, Loader2 } from 'lucide-react';

export default function TripCollaboration() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchTrips = async () => {
      await initFirebase();
      const db = getFirebaseDb();
      // Only fetch trips created by the user for now to keep it simple, 
      // or we can query where user is a member if we set up the member subcollection.
      const q = query(collection(db, 'trips'), where('ownerId', '==', user.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setTrips(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchTrips();
  }, [user]);

  const handleCreateTrip = async (e: any) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const destination = formData.get('destination') as string;
    
    try {
      await initFirebase();
      const db = getFirebaseDb();
      const tripRef = await addDoc(collection(db, 'trips'), {
        name,
        destination,
        ownerId: user.uid,
        status: 'planning',
        createdAt: serverTimestamp()
      });

      // Add owner as a member
      await addDoc(collection(db, 'trips', tripRef.id, 'members'), {
        userId: user.uid,
        role: 'owner',
        joinedAt: serverTimestamp()
      });

      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      alert("Failed to create trip.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Trip Collaboration</h1>
        <p className="mt-2 text-gray-500">Plan your travels together with friends.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create a New Trip</h2>
        <form onSubmit={handleCreateTrip} className="flex flex-col sm:flex-row gap-4">
          <input 
            name="name" 
            required 
            placeholder="Trip Name (e.g. Summer in Tokyo)" 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
          />
          <input 
            name="destination" 
            required 
            placeholder="Destination" 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
          />
          <button 
            disabled={creating} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Create
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Trips</h2>
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : trips.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
            <Plane className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No trips planned yet. Create one above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <div key={trip.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{trip.name}</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-medium capitalize">{trip.status}</span>
                </div>
                <div className="space-y-3 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    Only you
                  </div>
                </div>
                <button className="mt-6 w-full py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                  Open Trip Planner
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
