import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// 商品の種類を取得するAPI
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;

  try {
    // productId を number に変換
    const numericProductId = parseInt(productId, 10);
    if (isNaN(numericProductId)) {
      return new Response(JSON.stringify({ error: "無効な商品IDです" }), { status: 400 });
    }

    // 商品のカテゴリを取得
    const product = await prisma.products.findUnique({
      where: { id: numericProductId }, // IDを number に変更
      include: { category: true },
    });

    if (!product) {
      return new Response(JSON.stringify({ error: "商品が見つかりません" }), { status: 404 });
    }

    let kinds: string[] = [];

    if (product.category.name === "ラケット") {
      const racketTypes = await prisma.racketTypes.findMany({
        where: { productId: numericProductId }, // 数値のまま渡す
        include: { type: true },
        orderBy: { type: { name: "asc" } },
      });
      kinds = racketTypes.map((r) => r.type.name); // `type.name` を取得
    } else if (product.category.name === "ラバー") {
      const rubberColors = await prisma.rubberColors.findMany({
        where: { productId: numericProductId }, // 数値のまま渡す
        include: { color: true },
        orderBy: { color: { name: "asc" } }
      });
      kinds = rubberColors.map((r) => r.color.name); // `color.name` を取得
    } else if (product.category.name === "シューズ") {
      const shoesSizes = await prisma.shoesSizes.findMany({
        where: { productId: numericProductId }, // 数値のまま渡す
        include: { size: true },
        orderBy: { size: { name: "asc" } },
      });
      kinds = shoesSizes.map((r) => r.size.name); // `size.name` を取得
    }

    return new Response(JSON.stringify(kinds), { status: 200 });
  } catch (error) {
    console.error("種類の取得エラー:", error);
    return new Response(JSON.stringify({ error: "種類の取得に失敗しました" }), { status: 500 });
  }
}
