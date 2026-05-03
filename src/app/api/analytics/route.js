import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET(req) {
  try {
    // Determine the date range (e.g., last 7 days)
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6).toISOString();

    // Fetch all events from the last 7 days from Supabase
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', sevenDaysAgo);

    if (error) throw error;
    
    // Safety check if no data
    if (!events || events.length === 0) {
      return NextResponse.json({
        totalVisitors: 0,
        todayVisitors: 0,
        dailyVisits: [],
        topPages: [],
        devices: [],
        referrers: []
      });
    }

    // 1. Total Unique Visitors (unique session_id)
    const uniqueSessions = new Set(events.map(e => e.session_id));
    const totalVisitors = uniqueSessions.size;

    // 2. Visitors Today
    const todayStart = startOfDay(today).toISOString();
    const todayEvents = events.filter(e => e.created_at >= todayStart);
    const todayVisitors = new Set(todayEvents.map(e => e.session_id)).size;

    // 3. Daily Visits Graph Data
    const dailyVisitsMap = {};
    // Init last 7 days with 0
    for(let i = 0; i < 7; i++) {
        const d = subDays(today, i).toISOString().split('T')[0];
        dailyVisitsMap[d] = new Set();
    }
    
    events.forEach(e => {
      const dateKey = e.created_at.split('T')[0];
      if(dailyVisitsMap[dateKey]) {
        dailyVisitsMap[dateKey].add(e.session_id);
      }
    });

    const dailyVisits = Object.keys(dailyVisitsMap).sort().map(date => ({
      date: date.substring(5), // e.g., '05-03'
      visitors: dailyVisitsMap[date].size
    }));

    // 4. Top Pages
    const pageCounts = {};
    events.forEach(e => {
      pageCounts[e.url_path] = (pageCounts[e.url_path] || 0) + 1;
    });
    const topPages = Object.keys(pageCounts)
      .map(url => ({ url, views: pageCounts[url] }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // 5. Device Breakdown
    const deviceCounts = {};
    events.forEach(e => {
        const dType = e.device_type || 'Unknown';
        deviceCounts[dType] = (deviceCounts[dType] || 0) + 1;
    });
    const devices = Object.keys(deviceCounts).map(name => ({ name, value: deviceCounts[name] }));

    // 6. Referrers
    const refCounts = {};
    events.forEach(e => {
        let ref = e.referrer || 'Direct';
        if (ref.includes('google')) ref = 'Google';
        if (ref.includes('facebook') || ref.includes('fb.com')) ref = 'Facebook';
        if (ref.includes('twitter') || ref.includes('t.co')) ref = 'Twitter';
        if (ref.includes('linkedin')) ref = 'LinkedIn';
        refCounts[ref] = (refCounts[ref] || 0) + 1;
    });
    const referrers = Object.keys(refCounts)
      .map(name => ({ name, value: refCounts[name] }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      totalVisitors,
      todayVisitors,
      dailyVisits,
      topPages,
      devices,
      referrers
    });
  } catch (err) {
    console.error('Analytics Fetch Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch analytics' }, { status: 500 });
  }
}
