import prisma from "@/lib/prisma";
import Header from "@/app/components/header";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
  userId: number;
  stock: number;
  category: { name: string };
  user: { name: string };
}

interface UserPageProps {
  params: { id: string }; // URL のパラメータは string 型
}

// `generateStaticParams` を定義
export async function generateStaticParams() {
  const users = await prisma.users.findMany({
    select: { id: true },
  });

  return users.map((user) => ({
    id: user.id.toString(),
  }));
}

// ユーザー情報を取得
export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <div>
        <Header />
        <div className="text-center text-red-500">無効なユーザーIDです。</div>
      </div>
    );
  }

  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return (
      <div>
        <Header />
        <div className="text-center text-red-500">無効なユーザーIDです。</div>
      </div>
    );
  }

  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return (
      <div>
        <Header />
        <div className="text-center text-red-500">ユーザーが見つかりません。</div>
      </div>
    );
  }

  let products: Product[] = [];
  if (user.status === 1) {
    products = await prisma.products.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        category: true,
        user: true,
      },
    });
  }

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <h1 className="text-2xl font-bold mb-4">ユーザー情報</h1>
        <p><strong>名前:</strong> {user.name}</p>
        <p><strong>メールアドレス:</strong> {user.mail}</p>
        {user.status === 1 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">マイ商品</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                {products.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg shadow bg-pink-100">
                    <p>{product.category.name}</p>
                    <h2 className="text-2xl font-semibold">{product.name}</h2>
                    <p>価格: {product.price}円</p>
                    <p>在庫: {product.stock}</p>
                    <Link href={`/product/${product.id}`} className="text-blue-500 hover:underline mt-2 block">
                      詳細
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">まだ商品がありません。</p>
            )}
            <div className="mt-6">
              <Link href="/product/add" className="text-blue-500 hover:underline">
                新規商品登録
              </Link>
            </div>
          </div>
        )}
        <div className="mt-4">
          <Link href="/product" className="text-blue-500 hover:underline">
            すべての商品を見る
          </Link>
        </div>
        <div className="mt-8">
          <Link href="/orderHistory" className="text-blue-500 hover:underline">
            注文履歴
          </Link>
        </div>
        {user.status === 1 && (
          <div className="mt-4">
            <Link href="/orderManagement" className="text-blue-500 hover:underline">
              受注履歴
            </Link>
            <p className="text-gray-500 text-xs">未発送のものが無いようによく確認しましょう</p>
          </div>
        )}
        <div className="mt-8">
          <Link href="/help" className="text-blue-500 hover:underline">
            お問い合わせはこちらから
          </Link>
        </div>
      </div>
    </div>
  );
}
