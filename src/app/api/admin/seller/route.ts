import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const PAGE_SIZE = 5; // 1ページあたり5件表示

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;

    // ステータスが1のユーザーを取得
    const sellers = await prisma.users.findMany({
      where: { status: 1 },
      select: {
        id: true,
        name: true,
        mail: true,
        _count: {
          select: {
            helps: true, // 問い合わせ数
          },
        },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    // 注文数を計算
    const sellerData = await Promise.all(
      sellers.map(async (seller) => {
        const orderCount = await prisma.orderItems.count({
          where: {
            product: {
              userId: seller.id, // そのユーザーが販売した商品の注文数を取得
            },
          },
        });

        return {
          id: seller.id,
          name: seller.name,
          mail: seller.mail,
          orderCount,
          helpCount: seller._count.helps,
        };
      })
    );

    // 総件数を取得してページ数を計算
    const totalCount = await prisma.users.count({ where: { status: 1 } });
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return NextResponse.json({ sellers: sellerData, totalPages });
  } catch (error) {
    console.error("データ取得エラー:", error);
    return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
  }
}
