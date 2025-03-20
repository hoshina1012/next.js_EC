"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useParamsを使用
import Header from "../../components/header";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string; // 型アサーションでstringに固定

  const [product, setProduct] = useState<any | null>(null);
  const [kinds, setKinds] = useState<string[]>([]); // 種類をリストで管理
  const [selectedKind, setSelectedKind] = useState<string>(""); // 選択された種類
  const [quantity, setQuantity] = useState(1); // 個数
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}'); // ローカルストレージからユーザー情報を取得
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id); // ユーザーIDをセット
    }

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
        setKinds(data); // 取得した種類一覧をセット
        if (data.length > 0) {
          setSelectedKind(data[0]); // 最初の種類をデフォルト選択
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchProduct();
  }, [id]);

  // 個数変更時のバリデーション
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedKind || !userId) {
      console.error("必要なデータが不足しています");
      return;
    }
  
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product.id,
          categoryId: product.category.id,
          kindId: selectedKind,
          quantity,
        }),
      });

      const data = await res.json();
      console.log("レスポンス:", data);

      if (!res.ok) throw new Error("カートへの追加に失敗しました");

      router.push("/cart");
    } catch (error) {
      console.error(error);
      alert("カートに追加できませんでした");
    }
  };

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;
  if (!product) return <p className="text-center mt-10">商品が見つかりません</p>;

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className={"p-4 border rounded-lg shadow bg-blue-50"}>
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
        </div>

        <h1 className="text-4xl font-bold mb-4 mt-10">購入</h1>
        
        {/* 種類の選択 */}
        {kinds.length > 0 && (
          <div className="mt-6">
            <label className="block text-lg font-semibold">
              {product.category.name === "ラケット" && "ラケットの型"}
              {product.category.name === "ラバー" && "ラバーの色"}
              {product.category.name === "シューズ" && "シューズのサイズ"}:
            </label>
            <select
              value={selectedKind}
              onChange={(e) => setSelectedKind(e.target.value)}
              className="mt-2 p-2 border rounded"
            >
              {kinds.map((kind, index) => (
                <option key={index} value={kind}>
                  {kind}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 個数の入力欄 */}
        <div className="mt-4">
          <label className="block text-lg font-semibold">個数:</label>
          <input
            type="number"
            value={quantity}
            min="1"
            max={product.stock}
            onChange={handleQuantityChange}
            className="mt-2 p-2 border rounded w-20 text-center"
          />
        </div>

        <button
            onClick={handleAddToCart}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
          >
            カートに入れる
          </button>
      </div>
    </div>
  );
}
