import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { locale } = await request.json();

  // Validate locale
  const validLocales = ['es', 'en'];
  if (!validLocales.includes(locale)) {
    return NextResponse.json(
      { error: 'Invalid locale' },
      { status: 400 }
    );
  }

  // Set cookie
  const store = await cookies();
  store.set('locale', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });

  return NextResponse.json({ success: true });
}
