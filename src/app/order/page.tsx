"use client";
import { useEffect, useState } from "react";
import Header from "../components/header";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [kindNames, setKindNames] = useState<{ [key: string]: string }>({});
  const [totalAmount, setTotalAmount] = useState<number>(0); // 合計金額を格納するための状態

  const [cardNumber, setCardNumber] = useState<string>(""); // カード番号の状態
  const [cardHolderName, setCardHolderName] = useState<string>(""); // 名前の状態
  const [cardNumberError, setCardNumberError] = useState<string>(""); // カード番号のエラーメッセージ
  const [cardHolderNameError, setCardHolderNameError] = useState<string>(""); // 名前のエラーメッセージ

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

  // 支払情報のバリデーション
  const validatePayment = () => {
    let isValid = true;
    if (!/^\d{16}$/.test(cardNumber)) {
      setCardNumberError("カード番号は16桁の数字で入力してください");
      isValid = false;
    } else {
      setCardNumberError("");
    }

    if (cardHolderName.trim().length === 0) {
      setCardHolderNameError("名前は1文字以上で入力してください");
      isValid = false;
    } else {
      setCardHolderNameError("");
    }

    return isValid;
  };

  // 支払情報の送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;
  
    try {
      // 1. 注文データを作成
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: totalAmount }),
      });
  
      if (!orderRes.ok) throw new Error("注文の作成に失敗しました");
      const orderData = await orderRes.json();
      const orderId = orderData.id; // 新しい注文IDを取得
  
      // 2. 各注文アイテムを登録
      for (const item of cartItems) {
        await fetch("/api/orderItems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            productId: item.product.id,
            kindId: item.kindId,
            quantity: item.quantity,
            status: 0,
          }),
        });
      }
  
      alert("購入が完了しました");
      setCartItems([]); // カートを空にする
    } catch (error) {
      console.error(error);
      alert("購入処理に失敗しました");
    }
  };
  

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;
  if (cartItems.length === 0) return <p className="text-center mt-10">カートは空です</p>;

  return (
    <div>
      <Header />
      <main className="p-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center">購入手続き</h1>
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
        <h1 className="mt-16 text-4xl font-bold text-center">支払情報入力</h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-lg font-bold">
              カード番号（16桁）
            </label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded"
              maxLength={16}
            />
            {cardNumberError && <p className="text-red-500 text-sm mt-1">{cardNumberError}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="cardHolderName" className="block text-lg font-bold">
              名前
            </label>
            <input
              id="cardHolderName"
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded"
            />
            {cardHolderNameError && <p className="text-red-500 text-sm mt-1">{cardHolderNameError}</p>}
          </div>
          <div className="mt-6 text-center">
            <button type="submit" className="bg-blue-500 text-white px-8 py-4 text-xl rounded">
              購入する
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
