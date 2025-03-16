import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // リクエストのボディから商品データを取得
    const productData = await req.json();
    const { categoryId, options } = productData;

    // 必要なデータが揃っているかチェック
    if (!productData.name || !productData.price || !productData.categoryId || !productData.userId) {
      return NextResponse.json({ error: "商品名、価格、カテゴリ、ユーザーIDが必要です。" }, { status: 400 });
    }

    // 最大 ID を取得して +1
    const maxProduct = await prisma.products.findFirst({
      orderBy: { id: "desc" },
    });

    const newId = maxProduct ? maxProduct.id + 1 : 1; // ユーザーがいない場合は 1

    // 商品をデータベースに登録
    const newProduct = await prisma.products.create({
      data: {
        id: newId,
        name: productData.name,
        price: productData.price,
        categoryId: productData.categoryId,
        description: productData.description,
        userId: productData.userId.id,  // userIdをID（整数）として渡す
        stock: productData.stock,
      },
    });

    const maxType = await prisma.racketTypes.findFirst({
      orderBy: { id: "desc" },
    });

    const maxColor = await prisma.rubberColors.findFirst({
      orderBy: { id: "desc" },
    });

    const maxSize = await prisma.shoesSizes.findFirst({
      orderBy: { id: "desc" },
    });

    const productId = newProduct.id; // 登録された商品の ID を取得

    // ② カテゴリに応じて適切なテーブルにデータを登録
    if (categoryId === 1) { // ラケットの場合
      let newTypeId = maxType ? maxType.id + 1 : 1; // ユーザーがいない場合は 1
    
      await prisma.racketTypes.createMany({
        data: options.map((typeId: number) => ({
          id: newTypeId++,
          productId,
          typeId,
        })),
      });
    } else if (categoryId === 2) { // ラバーの場合
      let newColorId = maxColor ? maxColor.id + 1 : 1; // ユーザーがいない場合は 1
    
      await prisma.rubberColors.createMany({
        data: options.map((colorId: number) => ({
          id: newColorId++,
          productId,
          colorId,
        })),
      });
    } else if (categoryId === 3) { // シューズの場合
      let newSizeId = maxSize ? maxSize.id + 1 : 1; // ユーザーがいない場合は 1

      await prisma.shoesSizes.createMany({
        data: options.map((sizeId: number) => ({
          id: newSizeId++,
          productId,
          sizeId,
        })),
      });
    }

    // 成功した場合、登録された商品を返す
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("商品登録に失敗しました:", error);
    return NextResponse.json({ error: "商品登録に失敗しました" }, { status: 500 });
  } finally {
    // Prisma の接続を閉じる
    await prisma.$disconnect();
  }
}
