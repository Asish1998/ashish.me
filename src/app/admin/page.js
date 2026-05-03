'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, UserPlus, MousePointerClick, Activity, MonitorSmartphone, Link as LinkIcon, RefreshCcw } from 'lucide-react';
import styles from './admin.module.css';

const COLORS = ['#60a5fa', '#c084fc', '#f472b6', '#34d399', '#fbbf24'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className={styles.adminContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#a1a1aa' }}>Loading Analytics...</h2>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className={styles.adminContainer}>
        <h2 style={{ color: '#ef4444' }}>
          {data?.error ? `Analytics Error: ${data.error}` : 'Error loading dashboard infrastructure. Did you set up the Supabase env keys?'}
        </h2>
      </div>
    );
  }

  const { totalVisitors, todayVisitors, dailyVisits, topPages, devices, referrers } = data;

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Traffic Overview</h1>
        <button 
          onClick={fetchAnalytics}
          style={{ background: 'transparent', border: '1px solid #3f3f5a', padding: '0.5rem 1rem', borderRadius: '8px', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </header>

      {/* Top Stat Cards */}
      <div className={styles.statsGrid}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.statCard} style={{ '--card-color': '#c084fc' }}>
          <div className={styles.statTitle}><Users size={18} color="#c084fc" /> Total Unique Visitors</div>
          <div className={styles.statValue}>{totalVisitors}</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.statCard} style={{ '--card-color': '#34d399' }}>
          <div className={styles.statTitle}><UserPlus size={18} color="#34d399" /> Visitors Today</div>
          <div className={styles.statValue}>{todayVisitors}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={styles.statCard} style={{ '--card-color': '#10b981' }}>
          <div className={styles.statTitle}>
            <Activity size={18} color="#10b981" /> Live Demo Visitors
            <div className={styles.pulseDot} style={{ marginLeft: 'auto' }}></div>
          </div>
          <div className={styles.statValue}>1</div>
          <p style={{ color: '#a1a1aa', fontSize: '0.8rem', marginTop: '0.5rem', margin: 0 }}>*Simulated</p>
        </motion.div>
      </div>

      {/* Main Charts Area */}
      <div className={styles.chartsGrid}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
          <h3 className={styles.chartTitle}><MousePointerClick size={20} /> Traffic Trend (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 300 }}>
            {dailyVisits.length > 0 ? (
                <ResponsiveContainer>
                <AreaChart data={dailyVisits} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a40" vertical={false} />
                    <XAxis dataKey="date" stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e2f', borderColor: '#3f3f5a', borderRadius: '8px', color: '#fff' }} 
                    itemStyle={{ color: '#60a5fa' }}
                    />
                    <Area type="monotone" dataKey="visitors" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div style={{ height: '100%', display:'flex', alignItems:'center', justifyContent:'center', color: '#a1a1aa' }}>
                    No recent data
                </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={styles.chartCard}>
          <h3 className={styles.chartTitle}><MonitorSmartphone size={20} /> Device Breakdown</h3>
          <div style={{ width: '100%', height: 250 }}>
            {devices.length > 0 ? (
                <ResponsiveContainer>
                <PieChart>
                    <Pie
                    data={devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e1e2f', borderColor: '#3f3f5a', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div style={{ height: '100%', display:'flex', alignItems:'center', justifyContent:'center', color: '#a1a1aa' }}>No device data</div>
            )}
          </div>
          {devices.length > 0 && (
             <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                {devices.map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                        {d.name} ({d.value})
                    </div>
                ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={styles.chartCard}>
          <h3 className={styles.chartTitle}><LinkIcon size={20} /> Traffic Sources</h3>
          <ul className={styles.tableList}>
            {referrers.length > 0 ? referrers.slice(0,5).map((ref, i) => (
              <li key={i} className={styles.tableRow}>
                <span>{ref.name}</span>
                <strong>{ref.value}</strong>
              </li>
            )) : <li style={{color: '#a1a1aa', textAlign: 'center', marginTop: '2rem'}}>No referral data</li>}
          </ul>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
          <h3 className={styles.chartTitle}>Top Visited Pages</h3>
          <ul className={styles.tableList}>
            {topPages.length > 0 ? topPages.map((page, i) => (
              <li key={i} className={styles.tableRow}>
                <span style={{ color: '#60a5fa' }}>{page.url}</span>
                <strong>{page.views} views</strong>
              </li>
            )) : <li style={{color: '#a1a1aa', textAlign: 'center', marginTop: '2rem'}}>No page data</li>}
          </ul>
        </motion.div>

      </div>
    </div>
  );
}
