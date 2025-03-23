"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/header";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  kind: string;
  createdAt: string;
  status: number;
}

const PAGE_SIZE = 5;

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orderManagement?userId=${userId}&page=${currentPage}`);
        if (!res.ok) {
          throw new Error("受注履歴の取得に失敗しました");
        }
        const data = await res.json();
        setOrders(data.orders);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("受注履歴の取得エラー:", error);
      }
    };

    fetchOrders();
  }, [userId, currentPage]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const updateOrderStatus = async (orderId: number) => {
    try {
      const res = await fetch(`/api/updateOrderStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        throw new Error("ステータスの更新に失敗しました");
      }

      // ステータスを更新する
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 1 } : order
        )
      );
    } catch (error) {
      console.error("ステータス更新エラー:", error);
    }
  };

  return (
    <div>
      <Header />
      <main className="p-4">
        <h1 className="text-3xl font-bold my-4 max-w-4xl mx-auto text-center">受注履歴</h1>
        <div className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <p className="text-center">受注履歴がありません。</p>
          ) : (
            <>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">商品名</th>
                    <th className="border p-2">単価</th>
                    <th className="border p-2">数量</th>
                    <th className="border p-2">種類</th>
                    <th className="border p-2">受注日</th>
                    <th className="border p-2">ステータス</th>
                    <th className="border p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="text-center">
                      <td className="border p-2">
                        <Link href={`/product/${order.productId}`} className="text-blue-500 underline">
                          {order.productName}
                        </Link>
                      </td>
                      <td className="border p-2">{order.price.toLocaleString()} 円</td>
                      <td className="border p-2">{order.quantity}</td>
                      <td className="border p-2">{order.kind}</td>
                      <td className="border p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="border p-2">{order.status === 0 ? "未発送" : "発送済"}</td>
                      <td className="border p-2">
                        {order.status === 0 && (
                          <button
                            onClick={() => updateOrderStatus(order.id)}
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                          >
                            発送済にする
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ページネーション */}
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  前へ
                </button>
                <span className="px-4 py-2">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  次へ
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
