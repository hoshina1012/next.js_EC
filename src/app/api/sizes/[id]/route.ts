import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // URL パラメータを取得
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // 最後の部分を取得（例: 7）

    if (!id) {
      return new Response(JSON.stringify({ error: "IDが指定されていません" }), { status: 400 });
    }

    const sizeId = parseInt(id, 10); // IDを数値に変換

    if (isNaN(sizeId)) {
      return new Response(JSON.stringify({ error: "無効なIDです" }), { status: 400 });
    }

    // 特定のサイズをIDで取得
    const size = await prisma.sizes.findUnique({
      where: { id: sizeId },
    });

    if (!size) {
      return new Response(JSON.stringify({ error: "サイズが見つかりません" }), { status: 404 });
    }

    return new Response(JSON.stringify(size), { status: 200 });
  } catch (error) {
    console.error("Error fetching size:", error);
    return new Response(JSON.stringify({ error: "データ取得エラー", details: error }), { status: 500 });
  }
}
