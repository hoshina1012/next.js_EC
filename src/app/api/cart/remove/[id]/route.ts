import prisma from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const itemId = Number(params.id);
    
    // カートアイテムを削除
    const deletedItem = await prisma.carts.delete({
      where: { id: itemId },
    });

    return new Response(JSON.stringify(deletedItem), { status: 200 });
  } catch (error) {
    console.error("カートアイテムの削除に失敗しました:", error);
    return new Response(JSON.stringify({ error: "削除に失敗しました" }), { status: 500 });
  }
}
