'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FiUsers,
  FiFileText,
  FiMapPin,
  FiBookOpen,
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiClock,
} from 'react-icons/fi';

// Données fictives pour les graphiques
const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Fév', users: 1350 },
  { month: 'Mar', users: 1180 },
  { month: 'Avr', users: 1420 },
  { month: 'Mai', users: 1680 },
  { month: 'Jun', users: 1890 },
  { month: 'Jul', users: 2100 },
  { month: 'Aoû', users: 2234 },
];

const demandesData = [
  { month: 'Jan', demandes: 45 },
  { month: 'Fév', demandes: 52 },
  { month: 'Mar', demandes: 48 },
  { month: 'Avr', demandes: 61 },
  { month: 'Mai', demandes: 55 },
  { month: 'Jun', demandes: 67 },
];

const couvertureData = [
  { name: 'Passeports', value: 35, color: '#10b981' },
  { name: 'Visas', value: 28, color: '#059669' },
  { name: 'État civil', value: 20, color: '#047857' },
  { name: 'Autres', value: 17, color: '#065f46' },
];

const recentActivities = [
  {
    id: 1,
    action: 'Nouvelle demande de visa',
    user: 'Marie Dupont',
    time: '2 min ago',
    type: 'visa',
  },
  {
    id: 2,
    action: 'Document légalisé',
    user: 'Jean Martin',
    time: '15 min ago',
    type: 'legal',
  },
  {
    id: 3,
    action: 'Rendez-vous programmé',
    user: 'Sophie Leroy',
    time: '1h ago',
    type: 'appointment',
  },
  {
    id: 4,
    action: 'Couverture ajoutée',
    user: 'Pierre Durand',
    time: '2h ago',
    type: 'coverage',
  },
  {
    id: 5,
    action: 'Article publié',
    user: 'Admin',
    time: '3h ago',
    type: 'blog',
  },
];

export default function StatistiquesPage() {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Tableau de Bord
            </h1>
            <p className="text-gray-600 mt-2">{currentDate}</p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <FiActivity className="h-5 w-5" />
            <span className="text-sm font-medium">
              Mise à jour en temps réel
            </span>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Maliens récensés
                </p>
                <p className="text-3xl font-bold text-green-600">2,234</p>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <FiTrendingUp className="h-3 w-3 mr-1" />
                  +12.5% ce mois
                </p>
              </div>
              <FiUsers className="h-12 w-12 text-green-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Demandes en attente
                </p>
                <p className="text-3xl font-bold text-blue-600">387</p>
                <p className="text-xs text-blue-500 mt-1 flex items-center">
                  <FiTrendingUp className="h-3 w-3 mr-1" />
                  +8.2% ce mois
                </p>
              </div>
              <FiFileText className="h-12 w-12 text-blue-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Couvertures</p>
                <p className="text-3xl font-bold text-purple-600">89</p>
                <p className="text-xs text-purple-500 mt-1 flex items-center">
                  <FiTrendingUp className="h-3 w-3 mr-1" />
                  +5.1% ce mois
                </p>
              </div>
              <FiMapPin className="h-12 w-12 text-purple-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Articles de blog
                </p>
                <p className="text-3xl font-bold text-orange-600">6</p>
                <p className="text-xs text-orange-500 mt-1 flex items-center">
                  <FiTrendingUp className="h-3 w-3 mr-1" />
                  +15.3% ce mois
                </p>
              </div>
              <FiBookOpen className="h-12 w-12 text-orange-100" />
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique de croissance des utilisateurs */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiUsers className="h-5 w-5 mr-2 text-green-600" />
              Croissance des Utilisateurs
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique des demandes */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiFileText className="h-5 w-5 mr-2 text-blue-600" />
              Demandes par Mois
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demandes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique circulaire et activités récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Répartition des couvertures */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiMapPin className="h-5 w-5 mr-2 text-purple-600" />
              Répartition des Couvertures
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={couvertureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {couvertureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Activités récentes */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiActivity className="h-5 w-5 mr-2 text-gray-600" />
              Activités Récentes
            </h2>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'visa'
                          ? 'bg-green-100 text-green-600'
                          : activity.type === 'legal'
                            ? 'bg-blue-100 text-blue-600'
                            : activity.type === 'appointment'
                              ? 'bg-purple-100 text-purple-600'
                              : activity.type === 'coverage'
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {activity.type === 'visa' && (
                        <FiFileText className="h-5 w-5" />
                      )}
                      {activity.type === 'legal' && (
                        <FiMapPin className="h-5 w-5" />
                      )}
                      {activity.type === 'appointment' && (
                        <FiCalendar className="h-5 w-5" />
                      )}
                      {activity.type === 'coverage' && (
                        <FiBookOpen className="h-5 w-5" />
                      )}
                      {activity.type === 'blog' && (
                        <FiBookOpen className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      par {activity.user}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <FiClock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
