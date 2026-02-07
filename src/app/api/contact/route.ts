import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/schemas';

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

    // TODO: Send email via SendGrid/Resend or forward to .NET API
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
