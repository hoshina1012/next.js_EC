import prisma from "@/lib/prisma";

interface UserPageProps {
  params: { id: string }; // URL のパラメータは string 型
}

// ユーザー情報を取得
export default async function UserPage({ params }: UserPageProps) {
  const userId = parseInt(params.id, 10); // string → number に変換

  // 変換結果が NaN ならエラーメッセージを表示
  if (isNaN(userId)) {
    return <div className="text-center text-red-500">無効なユーザーIDです。</div>;
  }

  const user = await prisma.users.findUnique({
    where: { id: userId }, // number 型で検索
  });

  if (!user) {
    return <div className="text-center text-red-500">ユーザーが見つかりません。</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">ユーザー情報</h1>
      <p><strong>名前:</strong> {user.name}</p>
      <p><strong>メールアドレス:</strong> {user.mail}</p>
    </div>
  );
}
