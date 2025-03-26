import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    // 注文一覧を取得
    const orders = await prisma.orders.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    // 全注文数を取得（ページネーション用）
    const totalOrders = await prisma.orders.count();

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        userName: order.user.name,
        amount: order.amount,
        createdAt: order.createdAt.toISOString(),
      })),
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("データ取得エラー:", error);
    return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
  }
}
