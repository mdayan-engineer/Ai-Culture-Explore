import { useState, useEffect } from 'react';
import { Users, Activity, Loader2, ShieldCheck, Map } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getFirebaseDb, initFirebase } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTrips: 0 });

  useEffect(() => {
    const fetchAdminData = async () => {
      await initFirebase();
      const db = getFirebaseDb();
      try {
        const usersSnap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50)));
        const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        setStats({
          totalUsers: usersList.length,
          totalTrips: 124 // Placeholder for demonstration
        });
      } catch (e) {
        console.error("Error fetching admin data", e);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  if (authLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto text-indigo-600" /></div>;

  // Basic RBAC protection (simulate admin role for now by allowing any user, but in a real app would strictly check role)
  // if (!user || user.role !== 'admin') {
  //   return <Navigate to="/" />;
  // }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-600" /> Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-500">Platform overview, user management, and system analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Trips Planned</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.totalTrips}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">API Calls</p>
              <p className="text-2xl font-bold text-gray-900">1,492</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <img src={u.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt="" className="w-8 h-8 rounded-full" />
                      {u.displayName || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
