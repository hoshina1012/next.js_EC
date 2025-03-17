import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma クライアントのインポート

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = Number(params.id); // `id` を number に変換

  if (isNaN(productId)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  try {
    // データベースから商品を取得（category, user の情報も含める）
    const product = await prisma.products.findUnique({
      where: { id: productId }, // `id` を number で検索
      include: {
        category: true, // カテゴリー情報を取得
        user: true, // 販売者情報を取得
      },
    });

    if (!product) {
      return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("商品取得エラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
