import { NextRequest, NextResponse } from 'next/server';
import { careerApplicationSchema } from '@/lib/schemas';

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

    // TODO: Send email notification via SendGrid/Resend or forward to HR system
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
