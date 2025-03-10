import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// POST /api/signUp
export async function POST(req: Request) {
  try {
    const { name, mail, password } = await req.json();

    // メールアドレスの重複チェック
    const existingUser = await prisma.users.findUnique({
      where: { mail },
    });

    if (existingUser) {
      return NextResponse.json({ message: "メールアドレスは既に登録されています" }, { status: 400 });
    }

    // 最大 ID を取得して +1
    const maxUser = await prisma.users.findFirst({
      orderBy: { id: "desc" },
    });

    const newId = maxUser ? maxUser.id + 1 : 1; // ユーザーがいない場合は 1

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新規ユーザー作成
    const newUser = await prisma.users.create({
      data: {
        id: newId,
        name,
        mail,
        password: hashedPassword,
        authority: 0,
        status: 0,
      },
    });

    console.log("新規ユーザー作成:", newUser); // データが作成されたか確認

    return NextResponse.json({ message: "登録成功" }, { status: 200 });
  } catch (error) {
    console.error("エラー詳細:", error); // エラーメッセージを詳細に出力
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}
