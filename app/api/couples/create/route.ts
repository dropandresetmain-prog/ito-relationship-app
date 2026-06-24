import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramInitData } from "@/lib/telegram/verify-init-data";
import { upsertAppUser, createCouple } from "@/lib/couples";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const initData = body.initData as string | undefined;

    const identity = verifyTelegramInitData(initData);
    const user = await upsertAppUser(identity);
    const couple = await createCouple(user.id);

    return NextResponse.json({ couple });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("already") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
