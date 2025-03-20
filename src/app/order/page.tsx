"use client";
import { useEffect, useState } from "react";
import Header from "../components/header";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [kindNames, setKindNames] = useState<{ [key: string]: string }>({});
  const [totalAmount, setTotalAmount] = useState<number>(0); // 合計金額を格納するための状態

  // ユーザーIDを取得（例: localStorage）
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id); // ログインユーザーのIDをセット
    }
  }, []);

  // カートアイテムを取得
  useEffect(() => {
    if (!userId) return;

    async function fetchCartItems() {
      try {
        const res = await fetch(`/api/cart?userId=${userId}`);
        if (!res.ok) throw new Error("カートのアイテムを取得できませんでした");
        const data = await res.json();
        setCartItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCartItems();
  }, [userId]);

  // kindId に対応する name を取得
  useEffect(() => {
    async function fetchKindNames() {
      const kindNameMap: { [key: string]: string } = {};

      await Promise.all(
        cartItems.map(async (item) => {
          let apiUrl = "";

          if (item.product.categoryId === 1) {
            apiUrl = `/api/types/${item.kindId}`;
          } else if (item.product.categoryId === 2) {
            apiUrl = `/api/colors/${item.kindId}`;
          } else if (item.product.categoryId === 3) {
            apiUrl = `/api/sizes/${item.kindId}`;
          }

          if (apiUrl) {
            try {
              const res = await fetch(apiUrl);
              if (res.ok) {
                const data = await res.json();
                kindNameMap[item.kindId] = data.name; // kindId に対応する名前をセット
              } else {
                kindNameMap[item.kindId] = "不明";
              }
            } catch (error) {
              console.error(error);
              kindNameMap[item.kindId] = "不明";
            }
          }
        })
      );

      setKindNames(kindNameMap);
    }

    if (cartItems.length > 0) {
      fetchKindNames();
    }
  }, [cartItems]);

  // 合計金額を計算
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    setTotalAmount(total); // 合計金額を状態にセット
  }, [cartItems]);

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;
  if (cartItems.length === 0) return <p className="text-center mt-10">カートは空です</p>;

  return (
    <div>
      <Header />
      <main className="p-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center">注文手続き</h1>
        <div className="mt-6">
          {cartItems.map((item, index) => (
            <div key={index} className="p-4 mb-4 border rounded-lg shadow">
              <p className="font-bold">
                <a href={`/product/${item.product.id}`} className="text-blue-500 hover:underline">
                  {item.product.name}
                </a>
              </p>
              <p>単価: {item.product.price}円</p>
              <p>個数: {item.quantity}</p>
              <p>
                {item.product.categoryId === 1
                  ? "型"
                  : item.product.categoryId === 2
                  ? "色"
                  : "サイズ"}
                ：{kindNames[item.kindId]}
              </p>
            </div>
          ))}
        </div>
        <div className="text-2xl mt-6 text-right font-bold">
          <p>合計金額: {totalAmount}円</p>
        </div>
        <div className="mt-6 text-center">
        </div>
      </main>
    </div>
  );
}
