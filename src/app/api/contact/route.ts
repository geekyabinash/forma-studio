import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/schemas';
import { db } from '@/lib/db';
import { formSubmissions } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }

    // Save to database
    try {
      await db.insert(formSubmissions).values({
        type: 'contact',
        data: result.data,
        status: 'unread',
      });
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue even if DB save fails - don't block user
    }

    // TODO: Send email notification via Resend
    console.log('Contact form submission:', result.data);

    return NextResponse.json({
      success: true,
      message: 'Thank you! We will be in touch soon.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
