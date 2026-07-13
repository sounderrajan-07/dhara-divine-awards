import { NextResponse } from 'next/server';
import { readDb, writeDb } from '../db';

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json(db.events, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await readDb();
    
    const newEvent = {
      id: `ev-${Date.now()}`,
      type: body.type || 'image', // 'image' or 'video'
      category: body.category || 'Spiritual Seva',
      title: body.title || 'Dhara Event',
      image: body.image || '',
      description: body.description || '',
      youtubeId: body.youtubeId || undefined,
      duration: body.duration || undefined
    };

    db.events.unshift(newEvent);
    
    // Log this activity
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      type: 'system',
      message: `Admin added new event/activity: "${newEvent.title}"`,
      user: body.user || 'Super Admin'
    });

    await writeDb(db);

    return NextResponse.json({ success: true, event: newEvent, events: db.events }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, user } = await request.json();
    const db = await readDb();
    
    const eventIndex = db.events.findIndex(ev => ev.id === id);
    if (eventIndex !== -1) {
      const ev = db.events[eventIndex];
      db.events.splice(eventIndex, 1);
      
      db.activityLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        type: 'system',
        message: `Admin deleted event: "${ev.title}"`,
        user: user || 'Super Admin'
      });

      await writeDb(db);
      return NextResponse.json({ success: true, events: db.events });
    }
    
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
