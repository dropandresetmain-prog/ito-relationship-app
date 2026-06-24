import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramInitData } from "@/lib/telegram/verify-init-data";
import { upsertAppUser, joinCouple } from "@/lib/couples";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const initData = body.initData as string | undefined;
    const inviteCode = body.inviteCode as string | undefined;

    if (!inviteCode?.trim()) {
      return NextResponse.json({ error: "inviteCode is required" }, { status: 400 });
    }

    const identity = verifyTelegramInitData(initData);
    const user = await upsertAppUser(identity);
    const couple = await joinCouple(user.id, inviteCode);

    return NextResponse.json({ couple });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status =
      message.includes("not found") ? 404 :
      message.includes("full") || message.includes("already") ? 409 :
      400;
    return NextResponse.json({ error: message }, { status });
  }
}
