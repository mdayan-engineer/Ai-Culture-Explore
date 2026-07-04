import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { initFirebase, getFirebaseDb } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Trophy, Bookmark, MapPin, Target, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [savedDestinations, setSavedDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchSaved = async () => {
      await initFirebase();
      const db = getFirebaseDb();
      const q = query(
        collection(db, 'users', user.uid, 'savedDestinations'),
        orderBy('savedAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setSavedDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchSaved();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-6">
        <img 
          src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
          alt={user.displayName || 'User'} 
          className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-indigo-100" 
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{user.displayName}</h1>
          <p className="mt-1 text-gray-500">{user.email}</p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
             <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                <Trophy className="w-4 h-4" /> Explorer Level 1
             </span>
             <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                <Target className="w-4 h-4" /> 0 Trips Completed
             </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-600" />
          Saved Destinations
        </h2>
        
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : savedDestinations.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No saved destinations yet. Explore and save some!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map(dest => (
              <div key={dest.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{dest.name}</h3>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                    {dest.bestSeason}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-6 flex-grow">{dest.description}</p>
                <div className="pt-4 border-t border-gray-50 flex justify-between text-sm text-gray-500">
                  <span className="font-medium">{dest.estimatedBudget}</span>
                  <span className="text-xs">
                     {dest.savedAt?.toDate ? new Date(dest.savedAt.toDate()).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
