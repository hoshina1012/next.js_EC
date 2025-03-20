import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // URL パラメータを取得
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // 最後の部分を取得（例: 5）

    if (!id) {
      return new Response(JSON.stringify({ error: "IDが指定されていません" }), { status: 400 });
    }

    const colorId = parseInt(id, 10); // IDを数値に変換

    if (isNaN(colorId)) {
      return new Response(JSON.stringify({ error: "無効なIDです" }), { status: 400 });
    }

    // 特定の色をIDで取得
    const color = await prisma.colors.findUnique({
      where: { id: colorId }, // idで色を検索
    });

    if (!color) {
      return new Response(JSON.stringify({ error: "色が見つかりません" }), { status: 404 });
    }

    return new Response(JSON.stringify(color), { status: 200 });
  } catch (error) {
    console.error("Error fetching color:", error);
    return new Response(JSON.stringify({ error: "データ取得エラー", details: error }), { status: 500 });
  }
}
