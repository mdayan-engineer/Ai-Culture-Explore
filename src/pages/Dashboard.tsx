import { Link } from 'react-router-dom';
import { Compass, CalendarDays, BookOpen, Map, MessageSquare, Utensils, Briefcase, ChevronRight, Gem, Music, Calculator, ShieldAlert, Languages, DownloadCloud } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    title: 'Discover Destinations',
    description: 'Find your next adventure based on your budget, interests, and style.',
    icon: Compass,
    path: '/discovery',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Smart Itinerary',
    description: 'Generate day-by-day plans optimized for travel time and local flavor.',
    icon: CalendarDays,
    path: '/itinerary',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    title: 'Budget Planner',
    description: 'AI-optimized spending breakdown for your trip.',
    icon: Calculator,
    path: '/budget',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Cultural Storytelling',
    description: 'Dive deep into the history, legends, and customs of a destination.',
    icon: BookOpen,
    path: '/culture',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Hidden Gems',
    description: 'Skip the tourist traps and find local secrets and off-path spots.',
    icon: Gem,
    path: '/gems',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    title: 'Local Events',
    description: 'Find festivals, music, and cultural performances happening during your stay.',
    icon: Music,
    path: '/events',
    color: 'bg-fuchsia-50 text-fuchsia-600',
  },
  {
    title: 'Food Explorer',
    description: 'Discover local dishes, street food, and navigate dietary restrictions.',
    icon: Utensils,
    path: '/food',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'Safety Advisor',
    description: 'Stay secure with AI-generated local safety tips and emergency info.',
    icon: ShieldAlert,
    path: '/safety',
    color: 'bg-red-50 text-red-600',
  },
  {
    title: 'Local Guide Chat',
    description: 'Ask questions about customs, etiquette, and local insights.',
    icon: MessageSquare,
    path: '/guide',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Translator Assistant',
    description: 'Translate phrases with cultural context and pronunciation.',
    icon: Languages,
    path: '/translator',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    title: 'Offline Kit',
    description: 'Generate a survival kit of phrases, maps, and info for offline use.',
    icon: DownloadCloud,
    path: '/offline',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    title: 'Packing Assistant',
    description: 'Get a custom packing list based on destination and weather.',
    icon: Briefcase,
    path: '/packing',
    color: 'bg-gray-100 text-gray-700',
  }
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back, {user?.displayName?.split(' ')[0] || 'Traveler'}
        </h1>
        <p className="mt-2 text-gray-500">
          Where would you like to explore next? Choose an AI engine below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.title}
            to={feature.path}
            className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-indigo-100"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 \${feature.color}`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {feature.description}
            </p>
            <div className="flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Try it out <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
