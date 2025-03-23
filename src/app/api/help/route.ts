import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, title, detail } = await req.json();

    if (!userId || !title || !detail || title.length < 1 || detail.length < 1) {
      return NextResponse.json({ error: "無効な入力です" }, { status: 400 });
    }

    // IDの最大値を取得して+1
    const maxId = await prisma.helps.aggregate({
      _max: { id: true },
    });

    const newId = (maxId._max.id || 0) + 1;

    // 新しい問い合わせを作成
    const newHelp = await prisma.helps.create({
      data: {
        id: newId,
        userId,
        title,
        detail,
        status: 0,
      },
    });

    return NextResponse.json(newHelp, { status: 201 });
  } catch (error) {
    console.error("問い合わせの作成エラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
