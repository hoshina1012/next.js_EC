import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, productId, categoryId, kindId, quantity } = await req.json();

    let resolvedKindId;

    // カテゴリに基づいて適切なkindIdを取得
    if (categoryId === 1) { // ラケットの場合
      const racketType = await prisma.types.findFirst({
        where: { name: kindId }, // name で検索
      });
      resolvedKindId = racketType ? racketType.id : null;
    } else if (categoryId === 2) { // ラバーの場合
      const rubberColor = await prisma.colors.findFirst({
        where: { name: kindId }, // name で検索
      });
      resolvedKindId = rubberColor ? rubberColor.id : null;
    } else if (categoryId === 3) { // シューズの場合
      const shoeSize = await prisma.sizes.findFirst({
        where: { name: kindId }, // name で検索
      });
      resolvedKindId = shoeSize ? shoeSize.id : null;
    } else {
      return NextResponse.json({ message: "無効なカテゴリID" }, { status: 400 });
    }

    // kindIdが無効の場合
    if (!resolvedKindId) {
      return NextResponse.json({ message: "選択した種類は存在しません" }, { status: 400 });
    }

    // 最大 ID を取得して +1
    const maxCart = await prisma.carts.findFirst({
      orderBy: { id: "desc" },
    });

    const newId = maxCart ? maxCart.id + 1 : 1;

    // カートに追加
    await prisma.carts.create({
      data: {
        id: newId,
        userId: userId,
        productId,
        categoryId,
        kindId: resolvedKindId,
        quantity,
      },
    });

    return NextResponse.json({ message: "カートに追加しました" }, { status: 200 });
  } catch (error) {
    console.error("カート追加エラー:", error);
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 500 });
  }
}
