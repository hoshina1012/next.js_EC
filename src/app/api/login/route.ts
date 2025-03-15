import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // メールアドレスでユーザーを検索
    const user = await prisma.users.findUnique({
      where: { mail: email },
    });

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 401 });
    }

    // パスワードの照合
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "パスワードが違います" }, { status: 401 });
    }

    // 成功時、ユーザーIDを返す
    return NextResponse.json({ 
      userId: user.id, 
      userName: user.name,
      userStatus: user.status
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
