import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "データ取得エラー" }), { status: 500 });
  }
}
