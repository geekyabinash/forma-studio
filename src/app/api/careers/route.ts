import { NextRequest, NextResponse } from 'next/server';
import { careerApplicationSchema } from '@/lib/schemas';
import { db } from '@/lib/db';
import { formSubmissions } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = careerApplicationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }

    // Save to database
    try {
      await db.insert(formSubmissions).values({
        type: 'career',
        data: result.data,
        status: 'unread',
      });
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue even if DB save fails - don't block user
    }

    // TODO: Send email notification via Resend
    console.log('Career application submission:', result.data);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your application! We will review it and get back to you soon.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
