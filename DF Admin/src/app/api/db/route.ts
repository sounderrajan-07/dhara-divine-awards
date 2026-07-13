import { NextResponse } from 'next/server';
import { readDb } from '../db';

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json(db, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
