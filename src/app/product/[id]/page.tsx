"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // useParamsを使用
import Header from "../../components/header";

export default function ProductDetail() {
  const { id } = useParams(); // URLのidを取得
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // idが取得できるまで待つ

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("商品の取得に失敗しました");
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;
  if (!product) return <p className="text-center mt-10">商品が見つかりません</p>;

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4 text-center">
      <p className="text-lg">カテゴリー: {product.category.name}</p>
      <p className="text-lg">販売者: {product.user.name}</p>
        <h1 className="text-4xl font-bold mb-4 mt-4">{product.name}</h1>
        <p className="text-lg mb-2">{product.description}</p>
        <p className="text-lg">価格: {product.price}円</p>
        <p className="text-lg">在庫: {product.stock}</p>
        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded">
          カートに入れる
        </button>
      </div>
    </div>
  );
}
