import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramInitData } from "@/lib/telegram/verify-init-data";
import { upsertAppUser, getCoupleStatusForUser } from "@/lib/couples";
import { sendTouch } from "@/lib/touches";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const initData = body.initData as string | undefined;
    const message = (body.message as string | undefined) ?? "Thinking of you 💕";

    const identity = verifyTelegramInitData(initData);
    const user = await upsertAppUser(identity);
    const { couple, isPaired } = await getCoupleStatusForUser(user.id);

    if (!couple) {
      return NextResponse.json({ error: "You are not in a couple" }, { status: 404 });
    }

    if (!isPaired) {
      return NextResponse.json(
        { error: "Waiting for your partner to join" },
        { status: 409 }
      );
    }

    const result = await sendTouch(user, couple, message);

    if (!result.notificationSent) {
      return NextResponse.json({
        success: true,
        touch: result.touch,
        warning: `Touch saved but notification failed: ${result.notificationError}`,
      });
    }

    return NextResponse.json({
      success: true,
      touch: result.touch,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
