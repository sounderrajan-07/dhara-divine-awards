import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    let fileUrl = '';
    
    // Check Content-Type to see if it is multipart/form-data or application/json
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as Blob | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}_${(file as any).name || 'upload.jpg'}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure upload directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      fileUrl = `/uploads/${filename}`;
    } else {
      // Handle JSON Base64
      const body = await request.json();
      if (body.base64 && body.name) {
        const base64Data = body.base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${Date.now()}_${body.name}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);
        fileUrl = `/uploads/${filename}`;
      } else {
        return NextResponse.json({ error: 'Invalid payload. Expecting file or base64 data.' }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, url: fileUrl }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
