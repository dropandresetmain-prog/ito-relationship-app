import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramInitData } from "@/lib/telegram/verify-init-data";
import { upsertAppUser, getCoupleStatusForUser } from "@/lib/couples";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const initData = body.initData as string | undefined;

    const identity = verifyTelegramInitData(initData);
    const user = await upsertAppUser(identity);
    const coupleStatus = await getCoupleStatusForUser(user.id);

    return NextResponse.json({
      user,
      coupleStatus,
      isDevFallback: identity.isDevFallback,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
