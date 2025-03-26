"use client";
import Header from "@/app/components/headerAdmin";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  userName: string;
  amount: number;
  createdAt: string;
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/admin/order?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("データ取得エラー", error));
  }, [currentPage]);

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">注文一覧</h1>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">注文ユーザー</th>
              <th className="border p-2">金額</th>
              <th className="border p-2">注文日</th>
              <th className="border p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border">
                <td className="border p-2 text-center">{order.id}</td>
                <td className="border p-2">{order.userName}</td>
                <td className="border p-2 text-right">¥{order.amount.toLocaleString()}</td>
                <td className="border p-2 text-center">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="border p-2 text-center">
                  <Link href={`/admin/order/${order.id}`} className="text-blue-500 underline">
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ページングナビゲーション */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
          >
            前へ
          </button>
          <span className="px-4 py-2">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
          >
            次へ
          </button>
        </div>
      </div>
      <div className="mt-4 text-center">
          <Link href="/admin" className="text-blue-500 hover:underline">
              管理画面に戻る
          </Link>
      </div>
    </div>
  );
}
