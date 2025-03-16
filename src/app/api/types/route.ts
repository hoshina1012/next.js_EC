import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const types = await prisma.types.findMany();
    return new Response(JSON.stringify(types), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "データ取得エラー" }), { status: 500 });
  }
}