import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // URL パラメータを取得
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // 最後の部分を取得（例: 7）

    if (!id) {
      return new Response(JSON.stringify({ error: "IDが指定されていません" }), { status: 400 });
    }

    const typeId = parseInt(id, 10); // IDを数値に変換

    if (isNaN(typeId)) {
      return new Response(JSON.stringify({ error: "無効なIDです" }), { status: 400 });
    }

    // 特定のタイプをIDで取得
    const type = await prisma.types.findUnique({
      where: { id: typeId }, // idでタイプを検索
    });

    if (!type) {
      return new Response(JSON.stringify({ error: "タイプが見つかりません" }), { status: 404 });
    }

    return new Response(JSON.stringify(type), { status: 200 });
  } catch (error) {
    console.error("Error fetching type:", error);
    return new Response(JSON.stringify({ error: "データ取得エラー", details: error }), { status: 500 });
  }
}
