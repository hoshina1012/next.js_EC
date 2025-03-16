import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sizes = await prisma.sizes.findMany();
    return new Response(JSON.stringify(sizes), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "データ取得エラー" }), { status: 500 });
  }
}