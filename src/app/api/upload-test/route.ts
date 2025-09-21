import { NextResponse } from 'next/server';

export async function GET() {
	return NextResponse.json({ ok: true, message: 'upload-test GET' });
}

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => ({}));
		return NextResponse.json({ ok: true, data: body });
			} catch {
				return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
			}
}

export const dynamic = 'force-dynamic';
