import { NextResponse } from 'next/server';
import { readDb, writeDb } from '../db';

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json(db.gallery, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read gallery' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await readDb();
    
    const newImage = {
      id: `gal-${Date.now()}`,
      src: body.src,
      category: body.category || 'Award Ceremony',
      caption: body.caption || 'Dhara Divine Awards image'
    };

    db.gallery.unshift(newImage);
    
    // Log this activity
    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      type: 'system',
      message: `Admin added new gallery image: "${newImage.caption}"`,
      user: body.user || 'Super Admin'
    });

    await writeDb(db);

    return NextResponse.json({ success: true, image: newImage, gallery: db.gallery }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add image to gallery' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, user } = await request.json();
    const db = await readDb();
    
    const imageIndex = db.gallery.findIndex(img => img.id === id);
    if (imageIndex !== -1) {
      const img = db.gallery[imageIndex];
      db.gallery.splice(imageIndex, 1);
      
      db.activityLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        type: 'system',
        message: `Admin deleted gallery image: "${img.caption}"`,
        user: user || 'Super Admin'
      });

      await writeDb(db);
      return NextResponse.json({ success: true, gallery: db.gallery });
    }
    
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
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
