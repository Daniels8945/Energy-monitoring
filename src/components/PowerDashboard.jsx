import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Zap, AlertTriangle, TrendingUp, MapPin, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import Logo from "../assets/image/Onction-logo.png";


const PowerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeeder, setSelectedFeeder] = useState(null);
  const [feederHistory, setFeederHistory] = useState(null);

  const API_BASE = 'http://31.220.87.246/api/v1/metrics';


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
            <img src={Logo} className="w-10"/>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Energy Monitoring Dashboard</h1>
              <p className="text-sm text-gray-600">Real-time Grid Analytics</p>
            </div>
          </div>


          <div className="flex items-center gap-2 text-sm">
            <div>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Last updated: {dashboardData?.snapshot_time}</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {['overview', 'zones', 'feeders', 'reports', 'analytics'].map(tab => (
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

        {activeTab === 'reports' && (
          <ReportsView data={dashboardData} />
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
  const [viewMode, setViewMode] = useState('all'); // 'all', 'online', 'offline'

  
  // Set default dates when modal opens
  // useEffect(() => {
  //   if (selectedFeeder) {
  //     const today = new Date();
  //     const lastWeek = new Date(today);
  //     lastWeek.setDate(today.getDate() - 7);
      
  //     setToDate(today.toISOString().split('T')[0]);
  //     setFromDate(lastWeek.toISOString().split('T')[0]);
  //   }
  // }, [selectedFeeder]);

  // Calculate default dates
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleDateRangeChange = () => {
    if (selectedFeeder && fromDate && toDate) {
      fetchFeederHistory(selectedFeeder.feeder_id, fromDate, toDate);
    }
  };


  // Handel export to CSV, pdf and Word

  const exportToCSV = () => {
    if (!selectedFeeder || !feederHistory) return;

    const headers = ['Timestamp', 'Consumption (kWh)', 'Uptime (hours)', 'Status', 'Station', 'Zone'];
    const rows = feederHistory.map(record => [
      new Date(record.snapshot_time).toLocaleString(),
      record.consumption_kwh,
      record.uptime_hours,
      record.status === 1 ? 'ONLINE' : 'OFFLINE',
      record.station,
      record.zone
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFeeder.name}_${fromDate}_to_${toDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (!selectedFeeder || !feederHistory) return;

    const content = `
      FEEDER CONSUMPTION REPORT
      
      Feeder Name: ${selectedFeeder.name}
      Zone: ${selectedFeeder.zone}
      Station: ${selectedFeeder.station}
      Voltage Class: ${selectedFeeder.voltage_class}
      Trading Point: ${selectedFeeder.trading_point}
      
      Report Period: ${fromDate} to ${toDate}
      
      SUMMARY STATISTICS
      Total Consumption: ${totalConsumption.toLocaleString()} kWh
      Average Uptime: ${avgUptime} hours
      Total Data Points: ${feederHistory.length}
      
      DETAILED RECORDS
      
      ${feederHistory.map((record, idx) => `
      ${idx + 1}. ${new Date(record.snapshot_time).toLocaleString()}
         Consumption: ${record.consumption_kwh.toLocaleString()} kWh
         Uptime: ${record.uptime_hours} hours
         Status: ${record.status === 1 ? 'ONLINE' : 'OFFLINE'}
      `).join('\n')}
      
      ---
      Report Generated: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFeeder.name}_report_${fromDate}_to_${toDate}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToWord = () => {
    if (!selectedFeeder || !feederHistory) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Feeder Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1f2937; margin-top: 30px; }
          .info-section { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; margin: 8px 0; }
          .info-label { font-weight: bold; width: 150px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
          th { background-color: #2563eb; color: white; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .summary-box { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Power Distribution Feeder Report</h1>
        
        <div class="info-section">
          <h2>Feeder Information</h2>
          <div class="info-row"><span class="info-label">Feeder Name:</span><span>${selectedFeeder.name}</span></div>
          <div class="info-row"><span class="info-label">Zone:</span><span>${selectedFeeder.zone}</span></div>
          <div class="info-row"><span class="info-label">Station:</span><span>${selectedFeeder.station}</span></div>
          <div class="info-row"><span class="info-label">Voltage Class:</span><span>${selectedFeeder.voltage_class}</span></div>
          <div class="info-row"><span class="info-label">Trading Point:</span><span>${selectedFeeder.trading_point}</span></div>
          <div class="info-row"><span class="info-label">Report Period:</span><span>${fromDate} to ${toDate}</span></div>
        </div>
        
        <h2>Summary Statistics</h2>
        <div class="summary-box">
          <div class="info-row"><span class="info-label">Total Consumption:</span><span>${totalConsumption.toLocaleString()} kWh</span></div>
          <div class="info-row"><span class="info-label">Average Uptime:</span><span>${avgUptime} hours</span></div>
          <div class="info-row"><span class="info-label">Data Points:</span><span>${feederHistory.length} snapshots</span></div>
        </div>
        
        <h2>Detailed Records</h2>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Consumption (kWh)</th>
              <th>Uptime (hours)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${feederHistory.map(record => `
              <tr>
                <td>${new Date(record.snapshot_time).toLocaleString()}</td>
                <td>${record.consumption_kwh.toLocaleString()}</td>
                <td>${record.uptime_hours}</td>
                <td>${record.status === 1 ? 'ONLINE' : 'OFFLINE'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          Report Generated: ${new Date().toLocaleString()}<br>
          Power Distribution Monitoring System
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFeeder.name}_report_${fromDate}_to_${toDate}.doc`;
    a.click();
    window.URL.revokeObjectURL(url);
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


  // Separate feeders by status
  const onlineFeeders = filteredFeeders.filter(f => f.status === 1);
  const offlineFeeders = filteredFeeders.filter(f => f.status === 0);

  // Determine which feeders to display based on view mode
  const displayFeeders = viewMode === 'online' ? onlineFeeders : 
                         viewMode === 'offline' ? offlineFeeders : 
                         filteredFeeders;

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

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayFeeders.map((feeder, idx) => (
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
      </div> */}


      {/* Status View Toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setViewMode('all')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            viewMode === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Feeders ({filteredFeeders.length})
        </button>
        <button
          onClick={() => setViewMode('online')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            viewMode === 'online'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Online ({onlineFeeders.length})
        </button>
        <button
          onClick={() => setViewMode('offline')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            viewMode === 'offline'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Offline ({offlineFeeders.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayFeeders.map((feeder, idx) => (
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
              <div className="flex items-center gap-3">
                {/* Export Buttons */}
                <div className="flex gap-2 mr-4">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    title="Export to CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    CSV
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    title="Export to PDF (Text)"
                  >
                    <FileText className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={exportToWord}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    title="Export to Word"
                  >
                    <Download className="w-4 h-4" />
                    Word
                  </button>
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

const AnalyticsView = ({ zoneData }) => {
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

const ReportsView = ({ data }) => {
  const [reportFromDate, setReportFromDate] = useState('');
  const [reportToDate, setReportToDate] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showAllOnline, setShowAllOnline] = useState(false);

  // Set default dates
  React.useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    setReportToDate(today.toISOString().split('T')[0]);
    setReportFromDate(yesterday.toISOString().split('T')[0]);
  }, []);

  // Get all feeders
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

  const onlineFeeders = allFeeders.filter(f => f.status === 1);
  const offlineFeeders = allFeeders.filter(f => f.status === 0);

  const generatePerformanceReport = () => {
    setGeneratingReport(true);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Daily Feeder Performance Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #1f2937; }
          h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 30px; }
          h2 { color: #1f2937; margin-top: 40px; background: #f3f4f6; padding: 12px; border-left: 4px solid #2563eb; }
          .report-header { background: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .report-info { display: flex; justify-content: space-between; margin: 10px 0; }
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
          .summary-card { background: #f9fafb; border: 2px solid #e5e7eb; padding: 20px; border-radius: 8px; text-align: center; }
          .summary-card h3 { margin: 0; color: #6b7280; font-size: 14px; font-weight: normal; }
          .summary-card .value { font-size: 32px; font-weight: bold; color: #2563eb; margin: 10px 0; }
          .summary-card .label { color: #9ca3af; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; font-size: 13px; }
          th { background-color: #2563eb; color: white; font-weight: 600; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .status-online { background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
          .status-offline { background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
          .section-title { background: #1f2937; color: white; padding: 10px; margin-top: 30px; }
          .footer { margin-top: 60px; text-align: center; color: #6b7280; font-size: 12px; border-top: 2px solid #e5e7eb; padding-top: 20px; }
          .low-performance { background-color: #fef3c7 !important; }
          .zone-section { margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>⚡ Daily Feeder Performance Monitoring Report</h1>
        
        <div class="report-header">
          <h3 style="margin-top: 0; color: #1f2937;">Report Information</h3>
          <div class="report-info">
            <span><strong>Report Period:</strong> ${reportFromDate} to ${reportToDate}</span>
            <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
          </div>
          <div class="report-info">
            <span><strong>Total Feeders:</strong> ${allFeeders.length}</span>
            <span><strong>System:</strong> Power Distribution Monitoring</span>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Consumption</h3>
            <div class="value">${allFeeders.reduce((sum, f) => sum + f.consumption_kwh, 0).toLocaleString()}</div>
            <div class="label">kWh</div>
          </div>
          <div class="summary-card">
            <h3>Online Feeders</h3>
            <div class="value" style="color: #10b981;">${onlineFeeders.length}</div>
            <div class="label">${((onlineFeeders.length / allFeeders.length) * 100).toFixed(1)}% operational</div>
          </div>
          <div class="summary-card">
            <h3>Offline Feeders</h3>
            <div class="value" style="color: #ef4444;">${offlineFeeders.length}</div>
            <div class="label">${((offlineFeeders.length / allFeeders.length) * 100).toFixed(1)}% down</div>
          </div>
        </div>

        <h2>📊 Performance Summary by Zone</h2>
        ${data.Zone.map(zone => {
          const zoneFeeders = [];
          zone.trading_points.forEach(tp => {
            tp.feeders.forEach(f => zoneFeeders.push({...f, trading_point: tp.name}));
          });
          const zoneConsumption = zoneFeeders.reduce((sum, f) => sum + f.consumption_kwh, 0);
          const zoneAvgUptime = (zoneFeeders.reduce((sum, f) => sum + f.uptime_hours, 0) / zoneFeeders.length).toFixed(1);
          const zoneOnline = zoneFeeders.filter(f => f.status === 1).length;

          return `
            <div class="zone-section">
              <h3 style="margin-top: 0;">${zone.zone}</h3>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 15px;">
                <div><strong>Total Feeders:</strong> ${zoneFeeders.length}</div>
                <div><strong>Online:</strong> <span style="color: #10b981;">${zoneOnline}</span></div>
                <div><strong>Consumption:</strong> ${zoneConsumption.toLocaleString()} kWh</div>
                <div><strong>Avg Uptime:</strong> ${zoneAvgUptime}h</div>
              </div>
            </div>
          `;
        }).join('')}

        <h2>✅ Online Feeders (${onlineFeeders.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Feeder Name</th>
              <th>Zone</th>
              <th>Trading Point</th>
              <th>Consumption (kWh)</th>
              <th>Uptime (hours)</th>
              <th>Voltage Class</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${onlineFeeders.map(feeder => `
              <tr ${feeder.uptime_hours < 2 ? 'class="low-performance"' : ''}>
                <td><strong>${feeder.name}</strong></td>
                <td>${feeder.zone}</td>
                <td>${feeder.trading_point}</td>
                <td><strong>${feeder.consumption_kwh.toLocaleString()}</strong></td>
                <td>${feeder.uptime_hours}${feeder.uptime_hours < 2 ? ' ⚠️' : ''}</td>
                <td>${feeder.voltage_class}</td>
                <td><span class="status-online">ONLINE</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>❌ Offline Feeders (${offlineFeeders.length})</h2>
        ${offlineFeeders.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Feeder Name</th>
                <th>Zone</th>
                <th>Trading Point</th>
                <th>Last Consumption (kWh)</th>
                <th>Voltage Class</th>
                <th>Station</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${offlineFeeders.map(feeder => `
                <tr>
                  <td><strong>${feeder.name}</strong></td>
                  <td>${feeder.zone}</td>
                  <td>${feeder.trading_point}</td>
                  <td>${feeder.consumption_kwh.toLocaleString()}</td>
                  <td>${feeder.voltage_class}</td>
                  <td>${feeder.station}</td>
                  <td><span class="status-offline">OFFLINE</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p style="padding: 20px; background: #d1fae5; border-radius: 8px;">✅ No offline feeders - All systems operational!</p>'}

        <h2>⚠️ Performance Alerts</h2>
        ${onlineFeeders.filter(f => f.uptime_hours < 2).length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Feeder Name</th>
                <th>Zone</th>
                <th>Uptime (hours)</th>
                <th>Issue</th>
              </tr>
            </thead>
            <tbody>
              ${onlineFeeders.filter(f => f.uptime_hours < 2).map(feeder => `
                <tr class="low-performance">
                  <td><strong>${feeder.name}</strong></td>
                  <td>${feeder.zone}</td>
                  <td>${feeder.uptime_hours}</td>
                  <td>⚠️ Low uptime detected</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p style="padding: 20px; background: #d1fae5; border-radius: 8px;">✅ No performance issues detected</p>'}

        <div class="footer">
          <strong>Power Distribution Monitoring System</strong><br>
          Report Generated: ${new Date().toLocaleString()}<br>
          Period: ${reportFromDate} to ${reportToDate}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Feeder_Performance_Report_${reportFromDate}_to_${reportToDate}.doc`;
    a.click();
    window.URL.revokeObjectURL(url);

    setTimeout(() => setGeneratingReport(false), 1000);
  };

  const generateCSVReport = () => {
    const headers = ['Feeder Name', 'Zone', 'Trading Point', 'Station', 'Consumption (kWh)', 'Uptime (hours)', 'Voltage Class', 'Status'];
    const rows = allFeeders.map(feeder => [
      feeder.name,
      feeder.zone,
      feeder.trading_point,
      feeder.station,
      feeder.consumption_kwh,
      feeder.uptime_hours,
      feeder.voltage_class,
      feeder.status === 1 ? 'ONLINE' : 'OFFLINE'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All_Feeders_Report_${reportFromDate}_to_${reportToDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const visibleFeeders = showAllOnline
  ? onlineFeeders
  : onlineFeeders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Reports</h2>
          <p className="text-gray-600 mt-1">Generate comprehensive feeder performance reports</p>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={reportFromDate}
              onChange={(e) => setReportFromDate(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={reportToDate}
              onChange={(e) => setReportToDate(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={generatePerformanceReport}
            disabled={generatingReport}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-2 rounded font-medium transition-colors flex items-center gap-2"
          >
            {generatingReport ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate Word Report
              </>
            )}
          </button>
          <button
            onClick={generateCSVReport}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded font-medium transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-sm text-gray-600 mb-2">Total Feeders</h4>
          <p className="text-3xl font-bold text-gray-900">{allFeeders.length}</p>
          <p className="text-sm text-gray-600 mt-1">All zones combined</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-sm text-gray-600 mb-2">Online Feeders</h4>
          <p className="text-3xl font-bold text-green-600">{onlineFeeders.length}</p>
          <p className="text-sm text-gray-600 mt-1">{((onlineFeeders.length / allFeeders.length) * 100).toFixed(1)}% operational</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="text-sm text-gray-600 mb-2">Offline Feeders</h4>
          <p className="text-3xl font-bold text-red-600">{offlineFeeders.length}</p>
          <p className="text-sm text-gray-600 mt-1">{((offlineFeeders.length / allFeeders.length) * 100).toFixed(1)}% down</p>
        </div>
      </div>

      {/* Report Features */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Includes:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
              <span className="text-blue-600 text-sm font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Daily Performance Metrics</h4>
              <p className="text-sm text-gray-600">Consumption and uptime data for each feeder</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
              <span className="text-blue-600 text-sm font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Zone-wise Breakdown</h4>
              <p className="text-sm text-gray-600">Performance summary organized by zones</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
              <span className="text-blue-600 text-sm font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Online/Offline Status</h4>
              <p className="text-sm text-gray-600">Clear separation of operational and down feeders</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
              <span className="text-blue-600 text-sm font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Performance Alerts</h4>
              <p className="text-sm text-gray-600">Highlights feeders with low uptime or issues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status Preview</h3>
        
        <div className="mb-6">
          <h4 className="font-semibold text-green-600 mb-3">✅ Online Feeders ({onlineFeeders.length})</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Feeder</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Zone</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900">Consumption</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900">Uptime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visibleFeeders.map((feeder, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-900">{feeder.name}</td>
                    <td className="py-2 px-3 text-gray-600">{feeder.zone}</td>
                    <td className="py-2 px-3 text-right font-semibold text-gray-900">{feeder.consumption_kwh.toLocaleString()} kWh</td>
                    <td className="py-2 px-3 text-right text-gray-900">{feeder.uptime_hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
              {onlineFeeders.length > 5 && (
                <button
                  onClick={() => setShowAllOnline(!showAllOnline)}
                  className="mt-3 text-sm font-medium text-green-600 hover:text-green-700 hover:underline mx-auto block"
                >
                  {showAllOnline
                    ? "Show less"
                    : `Show ${onlineFeeders.length - 5} more online feeders`}
                </button>
              )}
          </div>
        </div>

        {offlineFeeders.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-600 mb-3">❌ Offline Feeders ({offlineFeeders.length})</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Feeder</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Zone</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Station</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {offlineFeeders.map((feeder, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-900">{feeder.name}</td>
                      <td className="py-2 px-3 text-gray-600">{feeder.zone}</td>
                      <td className="py-2 px-3 text-gray-600">{feeder.station}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerDashboard;