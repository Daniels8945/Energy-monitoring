import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Zap, AlertTriangle, TrendingUp, Power, MapPin } from 'lucide-react';

const PowerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeeder, setSelectedFeeder] = useState(null);
  const [feederHistory, setFeederHistory] = useState(null);

  const API_BASE = 'http://31.220.87.246/v1/metrics';

  // Mock data for demo
  const MOCK_DATA = {
    snapshot_time: "2026-01-08T12:25:00",
    Zone: [
      {
        zone: "Bauchi",
        trading_points: [
          {
            name: "GRA/PALACE",
            feeders: [
              { feeder_id: 765, name: "GRA/PALACE", consumption_kwh: 7956, uptime_hours: 3.5, voltage_class: "33Kv Feeder", station: "BAUCHI TS", status: 1 }
            ]
          },
          {
            name: "GUBI",
            feeders: [
              { feeder_id: 770, name: "GUBI 33kV", consumption_kwh: 7354, uptime_hours: 3.2, voltage_class: "33Kv Feeder", station: "BAUCHI TS", status: 1 },
              { feeder_id: 773, name: "TEACHING HOSPITAL", consumption_kwh: 596, uptime_hours: 3.6, voltage_class: "11Kv Feeder", station: "NIPP BAUCHI ISS", status: 1 },
              { feeder_id: 774, name: "WUNTI ROAD", consumption_kwh: 1947, uptime_hours: 3.6, voltage_class: "11Kv Feeder", station: "NIPP BAUCHI ISS", status: 1 }
            ]
          }
        ]
      },
      {
        zone: "Gombe",
        trading_points: [
          {
            name: "ASHAKA",
            feeders: [
              { feeder_id: 747, name: "ASHAKA I", consumption_kwh: 11783, uptime_hours: 2.8, voltage_class: "11Kv Feeder", station: "ASHAKA ISS", status: 1 },
              { feeder_id: 748, name: "ASHAKA II", consumption_kwh: 9665, uptime_hours: 1.9, voltage_class: "11Kv Feeder", station: "ASHAKA ISS", status: 1 }
            ]
          },
          {
            name: "SHONGO",
            feeders: [
              { feeder_id: 751, name: "GOVT. HOUSE GOMBE", consumption_kwh: 2929, uptime_hours: 3.6, voltage_class: "11Kv Feeder", station: "SHONGO ISS", status: 1 },
              { feeder_id: 743, name: "TUNFURE", consumption_kwh: 4516, uptime_hours: 3.6, voltage_class: "11Kv Feeder", station: "SHONGO ISS", status: 1 }
            ]
          }
        ]
      },
      {
        zone: "Makari Jos",
        trading_points: [
          {
            name: "MAKERI",
            feeders: [
              { feeder_id: 733, name: "MAKERI", consumption_kwh: 8338, uptime_hours: 3.6, voltage_class: "33Kv Feeder", station: "MAKERI TS", status: 1 },
              { feeder_id: 806, name: "INDUSTRIAL JOS", consumption_kwh: 0, uptime_hours: 0, voltage_class: "11Kv Feeder", station: "MAKERI ISS", status: 0 },
              { feeder_id: 807, name: "COCA COLA", consumption_kwh: 0, uptime_hours: 0, voltage_class: "11Kv Feeder", station: "MAKERI ISS", status: 0 }
            ]
          },
          {
            name: "BUKURU",
            feeders: [
              { feeder_id: 728, name: "BUKURU", consumption_kwh: 17431, uptime_hours: 3.6, voltage_class: "33Kv Feeder", station: "MAKERI TS", status: 1 }
            ]
          }
        ]
      },
      {
        zone: "Zaria Road Jos",
        trading_points: [
          {
            name: "ANGLO JOS",
            feeders: [
              { feeder_id: 816, name: "WEST OF MINES", consumption_kwh: 4417, uptime_hours: 12.6, voltage_class: "11Kv Feeder", station: "WEST OF MINES ISS", status: 1 }
            ]
          },
          {
            name: "DOGON DUTSE",
            feeders: [
              { feeder_id: 826, name: "UNIJOS", consumption_kwh: 0, uptime_hours: 0, voltage_class: "11Kv Feeder", station: "UNIJOS ISS", status: 0 }
            ]
          }
        ]
      }
    ]
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${API_BASE}/snapshot`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      setDashboardData(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data, using mock data:', error);
      // Use mock data if API fails
      setDashboardData(MOCK_DATA);
      setLoading(false);
    }
  };

  const fetchFeederHistory = async (feederId, fromDate = null, toDate = null) => {
    try {
      let url = `${API_BASE}/${feederId}/history`;
      const params = new URLSearchParams();
      
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      setFeederHistory(data.data);
    } catch (error) {
      console.error('Error fetching feeder history:', error);
      // Mock history data if API fails
      setFeederHistory([
        { snapshot_time: "2026-01-07T08:00:00", consumption_kwh: 5200, uptime_hours: 2.5, status: 1 },
        { snapshot_time: "2026-01-07T12:00:00", consumption_kwh: 8100, uptime_hours: 6.5, status: 1 },
        { snapshot_time: "2026-01-07T18:00:00", consumption_kwh: 12400, uptime_hours: 12.3, status: 1 },
        { snapshot_time: "2026-01-08T00:00:00", consumption_kwh: 15800, uptime_hours: 18.2, status: 1 },
        { snapshot_time: "2026-01-08T06:00:00", consumption_kwh: 18900, uptime_hours: 24.0, status: 1 }
      ]);
    }
  };

  const calculateStats = () => {
    if (!dashboardData) return null;

    let totalConsumption = 0;
    let totalFeeders = 0;
    let activeFeeders = 0;
    let totalUptime = 0;
    const alerts = [];

    dashboardData.Zone.forEach(zone => {
      zone.trading_points.forEach(tp => {
        tp.feeders.forEach(feeder => {
          totalFeeders++;
          totalConsumption += feeder.consumption_kwh;
          totalUptime += feeder.uptime_hours;
          if (feeder.status === 1) activeFeeders++;
          if (feeder.status === 0 || feeder.uptime_hours < 2) {
            alerts.push({ ...feeder, zone: zone.zone, trading_point: tp.name });
          }
        });
      });
    });

    return {
      totalConsumption,
      totalFeeders,
      activeFeeders,
      avgUptime: (totalUptime / totalFeeders).toFixed(1),
      alerts,
      zones: dashboardData.Zone.length
    };
  };

  const getZoneData = () => {
    if (!dashboardData) return [];
    
    return dashboardData.Zone.map(zone => {
      let consumption = 0;
      let feeders = 0;
      let active = 0;

      zone.trading_points.forEach(tp => {
        tp.feeders.forEach(f => {
          consumption += f.consumption_kwh;
          feeders++;
          if (f.status === 1) active++;
        });
      });

      return {
        name: zone.zone,
        consumption,
        feeders,
        active,
        status: (active / feeders * 100).toFixed(0)
      };
    });
  };

  const getVoltageClassData = () => {
    if (!dashboardData) return [];

    const voltageClasses = {};
    dashboardData.Zone.forEach(zone => {
      zone.trading_points.forEach(tp => {
        tp.feeders.forEach(f => {
          if (!voltageClasses[f.voltage_class]) {
            voltageClasses[f.voltage_class] = { count: 0, consumption: 0 };
          }
          voltageClasses[f.voltage_class].count++;
          voltageClasses[f.voltage_class].consumption += f.consumption_kwh;
        });
      });
    });

    return Object.keys(voltageClasses).map(key => ({
      name: key,
      value: voltageClasses[key].count,
      consumption: voltageClasses[key].consumption
    }));
  };

  const getTopConsumers = () => {
    if (!dashboardData) return [];

    const allFeeders = [];
    dashboardData.Zone.forEach(zone => {
      zone.trading_points.forEach(tp => {
        tp.feeders.forEach(f => {
          allFeeders.push({ ...f, zone: zone.zone });
        });
      });
    });

    return allFeeders
      .sort((a, b) => b.consumption_kwh - a.consumption_kwh)
      .slice(0, 5);
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const zoneData = getZoneData();
  const voltageData = getVoltageClassData();
  const topConsumers = getTopConsumers();

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Energy Monitoring Dashboard</h1>
              <p className="text-sm text-gray-600">Real-time Grid Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Last updated: {dashboardData?.snapshot_time}</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {['overview', 'zones', 'feeders', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 capitalize font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                icon={<Zap className="w-6 h-6" />}
                title="Total Consumption"
                value={`${(stats.totalConsumption / 1000).toFixed(1)}k`}
                unit="kWh"
                color="blue"
              />
              <MetricCard
                icon={<Activity className="w-6 h-6" />}
                title="Active Feeders"
                value={`${stats.activeFeeders}/${stats.totalFeeders}`}
                subtitle={`${((stats.activeFeeders / stats.totalFeeders) * 100).toFixed(0)}% online`}
                color="green"
              />
              <MetricCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Avg Uptime"
                value={stats.avgUptime}
                unit="hours"
                color="purple"
              />
              <MetricCard
                icon={<MapPin className="w-6 h-6" />}
                title="Active Zones"
                value={stats.zones}
                subtitle={`${dashboardData.Zone.length} total zones`}
                color="orange"
              />
            </div>

            {/* Alerts */}
            {stats.alerts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-600">Active Alerts ({stats.alerts.length})</h3>
                </div>
                <div className="space-y-2">
                  {stats.alerts.slice(0, 5).map((alert, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded p-3 border border-red-100">
                      <div>
                        <p className="font-medium text-gray-900">{alert.name}</p>
                        <p className="text-sm text-gray-600">{alert.zone} - {alert.trading_point}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-600 font-medium">
                          {alert.status === 0 ? 'OFFLINE' : `Low Uptime: ${alert.uptime_hours}h`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Zone Consumption */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Consumption by Zone</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zoneData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                      labelStyle={{ color: '#000' }}
                    />
                    <Bar dataKey="consumption" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Voltage Class Distribution */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Voltage Class Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={voltageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {voltageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Consumers */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Top 5 Consumers</h3>
              <div className="space-y-3">
                {topConsumers.map((feeder, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded p-4 border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-400">#{idx + 1}</div>
                      <div>
                        <p className="font-medium text-gray-900">{feeder.name}</p>
                        <p className="text-sm text-gray-600">{feeder.zone} - {feeder.station}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">{feeder.consumption_kwh.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">kWh</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'zones' && (
          <ZonesView data={dashboardData} />
        )}

        {activeTab === 'feeders' && (
          <FeedersView
            data={dashboardData}
            onSelectFeeder={(feeder) => {
              setSelectedFeeder(feeder);
              // Default to last 7 days
              const today = new Date();
              const lastWeek = new Date(today);
              lastWeek.setDate(today.getDate() - 7);
              fetchFeederHistory(
                feeder.feeder_id,
                lastWeek.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
              );
            }}
            selectedFeeder={selectedFeeder}
            feederHistory={feederHistory}
            fetchFeederHistory={fetchFeederHistory}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView data={dashboardData} zoneData={zoneData} />
        )}
      </main>
    </div>
  );
};

const MetricCard = ({ icon, title, value, unit, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`${colorClasses[color].split(' ')[2]}`}>{icon}</div>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {unit && <span className="text-gray-600">{unit}</span>}
      </div>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
};

const ZonesView = ({ data }) => {
  const [expandedZone, setExpandedZone] = useState(null);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Zone Management</h2>
      {data.Zone.map((zone, idx) => (
        <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <button
            onClick={() => setExpandedZone(expandedZone === idx ? null : idx)}
            className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{zone.zone}</h3>
                <p className="text-gray-600 text-sm">{zone.trading_points.length} Trading Points</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {zone.trading_points.reduce((sum, tp) =>
                    sum + tp.feeders.reduce((s, f) => s + f.consumption_kwh, 0), 0
                  ).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">kWh</p>
              </div>
            </div>
          </button>

          {expandedZone === idx && (
            <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
              {zone.trading_points.map((tp, tpIdx) => (
                <div key={tpIdx} className="bg-white rounded p-4 border border-gray-200">
                  <h4 className="font-semibold mb-3 text-lg text-gray-900">{tp.name}</h4>
                  <div className="grid gap-2">
                    {tp.feeders.map((feeder, fIdx) => (
                      <div key={fIdx} className="flex items-center justify-between bg-gray-50 rounded p-3 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${feeder.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{feeder.name}</p>
                            <p className="text-xs text-gray-600">{feeder.voltage_class} - {feeder.station}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{feeder.consumption_kwh.toLocaleString()} kWh</p>
                          <p className="text-xs text-gray-600">{feeder.uptime_hours}h uptime</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const FeedersView = ({ data, onSelectFeeder, selectedFeeder, feederHistory, fetchFeederHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Set default dates when modal opens
  useEffect(() => {
    if (selectedFeeder) {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      
      setToDate(today.toISOString().split('T')[0]);
      setFromDate(lastWeek.toISOString().split('T')[0]);
    }
  }, [selectedFeeder]);

  const handleDateRangeChange = () => {
    if (selectedFeeder && fromDate && toDate) {
      fetchFeederHistory(selectedFeeder.feeder_id, fromDate, toDate);
    }
  };

  const allFeeders = [];
  data.Zone.forEach(zone => {
    zone.trading_points.forEach(tp => {
      tp.feeders.forEach(f => {
        allFeeders.push({
          ...f,
          zone: zone.zone,
          trading_point: tp.name
        });
      });
    });
  });

  const filteredFeeders = allFeeders.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && f.status === 1) ||
      (filterStatus === 'inactive' && f.status === 0);
    return matchesSearch && matchesStatus;
  });

  // Calculate total consumption from history
  const totalConsumption = feederHistory 
    ? feederHistory.reduce((sum, record) => sum + record.consumption_kwh, 0)
    : 0;

  const avgUptime = feederHistory && feederHistory.length > 0
    ? (feederHistory.reduce((sum, record) => sum + record.uptime_hours, 0) / feederHistory.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search feeders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFeeders.map((feeder, idx) => (
          <div
            key={idx}
            onClick={() => onSelectFeeder(feeder)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${feeder.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feeder.name}</h3>
                  <p className="text-xs text-gray-600">{feeder.zone} - {feeder.trading_point}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${feeder.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {feeder.status === 1 ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Consumption</p>
                <p className="font-semibold text-gray-900">{feeder.consumption_kwh} kWh</p>
              </div>
              <div>
                <p className="text-gray-600">Uptime</p>
                <p className="font-semibold text-gray-900">{feeder.uptime_hours}h</p>
              </div>
              <div>
                <p className="text-gray-600">Voltage</p>
                <p className="font-semibold text-gray-900">{feeder.voltage_class}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedFeeder && feederHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedFeeder.name}</h3>
                <p className="text-sm text-gray-600">{selectedFeeder.zone} - {selectedFeeder.station}</p>
              </div>
              <button
                onClick={() => {
                  onSelectFeeder(null);
                  setFromDate('');
                  setToDate('');
                }}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Date Range Selector */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Select Date Range</h4>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleDateRangeChange}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Consumption</p>
                <p className="text-2xl font-bold text-gray-900">{totalConsumption.toLocaleString()}</p>
                <p className="text-xs text-gray-600">kWh</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Average Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{avgUptime}</p>
                <p className="text-xs text-gray-600">hours</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Data Points</p>
                <p className="text-2xl font-bold text-gray-900">{feederHistory.length}</p>
                <p className="text-xs text-gray-600">snapshots</p>
              </div>
            </div>

            {/* Chart */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Consumption & Uptime Trend</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={feederHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="snapshot_time" 
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                    }}
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleString();
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="consumption_kwh" stroke="#3b82f6" name="Consumption (kWh)" strokeWidth={2} />
                  <Line type="monotone" dataKey="uptime_hours" stroke="#10b981" name="Uptime (hours)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Data Table */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Detailed Records</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Time</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Consumption (kWh)</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Uptime (hours)</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {feederHistory.map((record, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">
                          {new Date(record.snapshot_time).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">
                          {record.consumption_kwh.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900">
                          {record.uptime_hours}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${record.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {record.status === 1 ? 'ONLINE' : 'OFFLINE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AnalyticsView = ({ data, zoneData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Analytics & Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Zone Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Bar dataKey="active" fill="#10b981" name="Active Feeders" />
              <Bar dataKey="feeders" fill="#9ca3af" name="Total Feeders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Operational Efficiency</h3>
          <div className="space-y-4">
            {zoneData.map((zone, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{zone.name}</span>
                  <span className="text-sm text-gray-600">{zone.status}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${zone.status}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerDashboard;