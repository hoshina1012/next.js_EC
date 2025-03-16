"use client";
import { useEffect, useState } from "react";
import Header from "../components/header";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState<{ id: string; name: string; status: number } | null>(null);

  useEffect(() => {
    // ローカルストレージからユーザー情報を取得
    const userData = localStorage.getItem("user");
    console.log("取得したユーザーデータ:", userData);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
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
      <h1 className="text-3xl font-bold my-4 max-w-4xl mx-auto text-center">商品一覧</h1>
      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
        {products.map((product: any) => {
          const isMyProduct = user?.id && product.userId === user.id;
          return (
            <div
              key={product.id}
              className={`p-4 border rounded-lg shadow ${isMyProduct ? "bg-pink-100" : ""}`}
            >
              <p>{product.category.name}</p>
              <p>{isMyProduct ? "マイ商品" : `販売者: ${product.user.name}`}</p>
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p>価格: {product.price}円</p>
              <p>在庫: {product.stock}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
