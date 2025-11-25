// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    console.log('Starting Cloudinary upload for file:', file.name, 'Size:', file.size);

    // Create FormData for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', 'buddy-script'); // Make sure this matches your preset name
    cloudinaryFormData.append('folder', 'buddy-script');

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dkrtcdvnn/image/upload`;

    console.log('Uploading to Cloudinary URL:', cloudinaryUrl);

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    console.log('Cloudinary response status:', cloudinaryResponse.status);

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error('Cloudinary upload failed:', errorText);
      throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.status} ${errorText}`);
    }

    const cloudinaryData = await cloudinaryResponse.json();
    console.log('Cloudinary upload successful:', cloudinaryData.secure_url);

    return NextResponse.json({ 
      url: cloudinaryData.secure_url 
    });

  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    
    let errorMessage = 'Failed to upload image';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}