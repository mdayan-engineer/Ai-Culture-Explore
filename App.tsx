import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { APIProvider } from '@vis.gl/react-google-maps';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import Itinerary from './pages/Itinerary';
import LocalGuide from './pages/LocalGuide';
import FoodExplorer from './pages/FoodExplorer';
import Packing from './pages/Packing';
import CulturalStorytelling from './pages/CulturalStorytelling';
import HiddenGems from './pages/HiddenGems';
import LocalEvents from './pages/LocalEvents';
import BudgetPlanner from './pages/BudgetPlanner';
import SafetyAdvisor from './pages/SafetyAdvisor';
import TranslatorAssistant from './pages/TranslatorAssistant';
import OfflineKit from './pages/OfflineKit';
import AdminDashboard from './pages/AdminDashboard';
import Community from './pages/Community';
import TripCollaboration from './pages/TripCollaboration';
import Profile from './pages/Profile';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 font-sans">Loading...</div>;
  }

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 font-sans p-6 text-center">
        <div className="max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Google Maps API Key Required</h2>
          <div className="text-left space-y-4 text-gray-600">
            <p><strong>Step 1:</strong> <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Get an API Key</a></p>
            <p><strong>Step 2:</strong> Add your key as a secret in AI Studio:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Open <strong>Settings</strong> (⚙️ gear icon, <strong>top-right corner</strong>)</li>
              <li>Select <strong>Secrets</strong></li>
              <li>Type <code>GOOGLE_MAPS_PLATFORM_KEY</code> as the secret name, press <strong>Enter</strong></li>
              <li>Paste your API key as the value, press <strong>Enter</strong></li>
            </ul>
            <p className="mt-4 text-sm text-gray-500 italic">The app rebuilds automatically after you add the secret.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        
        {/* Protected Routes */}
        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/trips" element={<TripCollaboration />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/guide" element={<LocalGuide />} />
          <Route path="/food" element={<FoodExplorer />} />
          <Route path="/packing" element={<Packing />} />
          <Route path="/culture" element={<CulturalStorytelling />} />
          <Route path="/gems" element={<HiddenGems />} />
          <Route path="/events" element={<LocalEvents />} />
          <Route path="/budget" element={<BudgetPlanner />} />
          <Route path="/safety" element={<SafetyAdvisor />} />
          <Route path="/translator" element={<TranslatorAssistant />} />
          <Route path="/offline" element={<OfflineKit />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </APIProvider>
  );
}
