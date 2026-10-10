import { NextResponse } from 'next/server';
import { fetchSiteSettings } from '@/lib/siteSettings';

export async function GET(request: Request) {
  const faviconUrl = (await fetchSiteSettings())?.favicon_url?.trim() || '/favicon.ico';

  if (faviconUrl.startsWith('data:image/')) {
    const match = faviconUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (match) {
      return new Response(Buffer.from(match[2], 'base64'), {
        headers: {
          'Content-Type': match[1],
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }
  }

  let target: URL;
  try {
    target = new URL(faviconUrl, request.url);
  } catch {
    target = new URL('/favicon.ico', request.url);
  }

  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    target = new URL('/favicon.ico', request.url);
  }

  return NextResponse.redirect(target, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}