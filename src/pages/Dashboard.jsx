import { useEffect, useState } from 'react';
import { 
  Users, 
  Briefcase, 
  IndianRupee, 
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar user={user} />
        <div className="main-content">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const caseStatusData = stats?.caseStatusStats?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count
  })) || [];

  return (
    <div className="dashboard-container">
      <Sidebar user={user} />
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="welcome-text">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats?.counts?.totalClients || 0}</h3>
              <p>Total Clients</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Briefcase size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats?.counts?.totalCases || 0}</h3>
              <p>Total Cases</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Briefcase size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats?.counts?.activeCases || 0}</h3>
              <p>Active Cases</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <IndianRupee size={24} />
            </div>
            <div className="stat-info">
              <h3>₹{(stats?.financial?.totalEarnings || 0).toLocaleString()}</h3>
              <p>Total Earnings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <IndianRupee size={24} />
            </div>
            <div className="stat-info">
              <h3>₹{(stats?.financial?.pendingPayments || 0).toLocaleString()}</h3>
              <p>Pending Payments</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon teal">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats?.financial?.successRate || 0}%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Case Status Distribution</h3>
            {caseStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={caseStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {caseStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">
                <p>No case data available</p>
                <p className="sub-text">Add cases to see distribution</p>
              </div>
            )}
          </div>

          <div className="chart-card">
            <h3>Monthly Earnings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { month: 'Jan', amount: 45000 },
                { month: 'Feb', amount: 52000 },
                { month: 'Mar', amount: 48000 },
                { month: 'Apr', amount: 61000 },
                { month: 'May', amount: 55000 },
                { month: 'Jun', amount: 67000 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="activity-card">
            <h3>
              <Calendar size={20} />
              Upcoming Hearings
            </h3>
            {stats?.upcomingHearings?.length > 0 ? (
              <div className="activity-list">
                {stats.upcomingHearings.map((hearing) => (
                  <div key={hearing._id} className="activity-item">
                    <div className="activity-date">
                      <span className="day">{new Date(hearing.hearingDate).getDate()}</span>
                      <span className="month">{new Date(hearing.hearingDate).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="activity-details">
                      <p className="activity-title">{hearing.purpose}</p>
                      <p className="activity-subtitle">{hearing.case?.title || 'Case'}</p>
                      <p className="activity-meta">
                        <Clock size={14} /> {hearing.hearingTime} | {hearing.courtName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No upcoming hearings</p>
            )}
          </div>

          <div className="activity-card">
            <h3>
              <Users size={20} />
              Recent Clients
            </h3>
            {stats?.recentClients?.length > 0 ? (
              <div className="activity-list">
                {stats.recentClients.map((client) => (
                  <div key={client._id} className="activity-item">
                    <div className="activity-avatar">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="activity-details">
                      <p className="activity-title">{client.name}</p>
                      <p className="activity-subtitle">{client.phone}</p>
                      <p className="activity-meta">
                        Added {new Date(client.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No recent clients</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
