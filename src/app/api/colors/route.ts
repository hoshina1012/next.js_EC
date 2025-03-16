import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const colors = await prisma.colors.findMany();
    return new Response(JSON.stringify(colors), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "データ取得エラー" }), { status: 500 });
  }
}