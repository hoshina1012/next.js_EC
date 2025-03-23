import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // URLのクエリパラメータを取得
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;

    // ユーザーの総数を取得（ページ数計算用）
    const totalUsers = await prisma.users.count({
      where: { status: 0 },
    });

    // 指定したページのユーザーを取得
    const users = await prisma.users.findMany({
      where: { status: 0 },
      select: {
        id: true,
        name: true,
        mail: true,
        _count: {
          select: {
            orders: true,
            helps: true,
          },
        },
      },
      skip,
      take: limit,
    });

    // 総ページ数を計算
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({ users, totalPages });
  } catch (error) {
    return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
  }
}
