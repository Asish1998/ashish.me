import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { url_path, referrer, screenWidth } = body;

    // Get Request Headers to form a unique daily session ID
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    
    // Hash IP + UA + Date for a privacy-friendly unique daily Session ID
    const today = new Date().toISOString().split('T')[0];
    const sessionString = `${ip}-${userAgent}-${today}`;
    const sessionId = crypto.createHash('sha256').update(sessionString).digest('hex');

    // Parse User Agent (Basic estimation without heavy libraries on edge)
    let device_type = 'Desktop';
    if (/Mobi|Android/i.test(userAgent)) device_type = 'Mobile';
    if (/Tablet|iPad/i.test(userAgent)) device_type = 'Tablet';

    // Basic Browser
    let browser = 'Unknown';
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('SamsungBrowser')) browser = 'Samsung Internet';
    else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
    else if (userAgent.includes('Trident')) browser = 'Internet Explorer';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';

    // Geolocation from Vercel headers (if deployed on Vercel)
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';

    // Insert into Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert([
        {
          session_id: sessionId,
          url_path: url_path || '/',
          referrer: referrer || 'Direct',
          country,
          city,
          device_type,
          browser
        }
      ]);

    if (error) {
      console.error('Supabase Analytics Error:', error);
      return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: sessionId });
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
