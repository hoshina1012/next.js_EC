import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    // 問い合わせ一覧を取得
    const helps = await prisma.helps.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { mail: true },
        },
      },
    });

    // 全問い合わせ数を取得（ページング用）
    const totalHelps = await prisma.helps.count();

    return NextResponse.json({
      helps: helps.map((help) => ({
        id: help.id,
        email: help.user.mail,
        title: help.title,
        detail: help.detail,
        createdAt: help.createdAt.toISOString(),
        status: help.status,
      })),
      totalPages: Math.ceil(totalHelps / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("データ取得エラー:", error);
    return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const newStatus = (status + 1) % 3; // 0 → 1 → 2 → 0 のループ

    const updatedHelp = await prisma.helps.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, newStatus: updatedHelp.status });
  } catch (error) {
    console.error("ステータス更新エラー:", error);
    return NextResponse.json({ error: "ステータス更新に失敗しました" }, { status: 500 });
  }
}
