"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/header";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState<{ id: string; name: string; status: number } | null>(null);

  useEffect(() => {
    // ローカルストレージからユーザー情報を取得
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/top");
        if (!res.ok) {
          throw new Error("商品の取得に失敗しました");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <Header />
      <h1 className="text-3xl font-bold my-6 max-w-4xl mx-auto text-center">最新の商品</h1>

      {/* 商品リスト */}
      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
        {products.map((product: any) => {
          const isMyProduct = user?.id && product.userId === user.id;
          return (
            <div
              key={product.id}
              className={`p-4 border rounded-lg shadow ${isMyProduct ? "bg-pink-100" : ""}`}
            >
              <p>{product.category?.name}</p>
              <p>{isMyProduct ? "マイ商品" : `販売者: ${product.user?.name}`}</p>
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p>価格: {product.price}円</p>
              <p>在庫: {product.stock}</p>
              <Link href={`/product/${product.id}`} className="text-blue-500 hover:underline mt-2 block">
                詳細
              </Link>
            </div>
          );
        })}
      </div>
        <div className="mt-8 text-center">
          <Link href="/product" className="text-blue-500 hover:underline">
            すべての商品を見る
          </Link>
        </div>
    </div>
  );
}
