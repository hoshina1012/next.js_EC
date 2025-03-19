"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // useParamsを使用
import Header from "../../components/header";

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string; // 型アサーションでstringに固定

  const [product, setProduct] = useState<any | null>(null);
  const [kinds, setKinds] = useState<string[]>([]); // 種類をリストで管理
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("商品の取得に失敗しました");
        const data = await res.json();
        setProduct(data);

        // 種類を取得
        fetchKinds(id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchKinds(productId: string) {
      try {
        const res = await fetch(`/api/kinds/${productId}`);
        if (!res.ok) throw new Error("種類の取得に失敗しました");
        const data = await res.json();
        console.log("Fetched kinds:", data);
        setKinds(data); // 取得した種類一覧をセット
      } catch (error) {
        console.error(error);
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
        
        {/* 種類をリスト表示 */}
        {kinds.length > 0 && (
          <p className="mt-6 mb-3">
          {product.category.name === "ラケット" && (
            <>
              ラケットの型:
              {kinds.map((kind, index) => (
                <span key={index}>
                  <br />
                  {kind}
                </span>
              ))}
            </>
          )}
          {product.category.name === "ラバー" && (
            <>
              ラバーの色:
              {kinds.map((kind, index) => (
                <span key={index}>
                  <br />
                  {kind}
                </span>
              ))}
            </>
          )}
          {product.category.name === "シューズ" && (
            <>
              シューズのサイズ:
              {kinds.map((kind, index) => (
                <span key={index}>
                  <br />
                  {kind}
                </span>
              ))}
            </>
          )}
        </p>
        
        )}

        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded">
          カートに入れる
        </button>
      </div>
    </div>
  );
}
