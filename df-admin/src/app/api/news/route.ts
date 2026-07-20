import { NextResponse } from 'next/server';
import { readDb, writeDb } from '../db';

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json(db.news || [], {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await readDb();

    if (!db.news) db.news = [];
    
    const newItem = {
      id: `news-${Date.now()}`,
      title: body.title || 'Untitled News',
      date: body.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      image: body.image || '/images/News/DHARA Divine Awards Ceremony.jpg',
      link: body.link || '',
      summary: body.summary || ''
    };

    db.news.unshift(newItem);
    
    // Log activity
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      type: 'system',
      message: `Admin added news article: "${newItem.title}"`,
      user: body.user || 'Super Admin'
    });

    await writeDb(db);

    return NextResponse.json({ success: true, item: newItem, news: db.news }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create news item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await readDb();

    if (!db.news) db.news = [];
    
    const index = db.news.findIndex((n: any) => n.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    db.news[index] = {
      ...db.news[index],
      ...body
    };

    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      type: 'system',
      message: `Admin updated news article: "${db.news[index].title}"`,
      user: body.user || 'Super Admin'
    });

    await writeDb(db);

    return NextResponse.json({ success: true, item: db.news[index], news: db.news }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, user } = await request.json();
    const db = await readDb();

    if (!db.news) db.news = [];

    const item = db.news.find((n: any) => n.id === id);
    db.news = db.news.filter((n: any) => n.id !== id);

    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      type: 'system',
      message: `Admin deleted news article: "${item?.title || id}"`,
      user: user || 'Super Admin'
    });

    await writeDb(db);

    return NextResponse.json({ success: true, news: db.news }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news item' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
