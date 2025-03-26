"use client";
import Header from "@/app/components/headerAdmin";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  seller: string;
  status: string;
  productId: string;
  kind: string; // 種類を追加
}

interface OrderDetail {
  id: string;
  userName: string;
  amount: number;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    fetch(`/api/admin/order/${id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((error) => console.error("データ取得エラー", error));
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">注文詳細：注文ID {order.id}</h1>

        <div className="mb-6 p-4 border rounded bg-gray-100">
          <p className="text-lg"><strong>注文ID:</strong> {order.id}</p>
          <p className="text-lg"><strong>注文ユーザー:</strong> {order.userName}</p>
          <p className="text-lg"><strong>合計金額:</strong> ¥{order.amount.toLocaleString()}</p>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">商品名</th>
              <th className="border p-2">種類</th>
              <th className="border p-2">数量</th>
              <th className="border p-2">単価</th>
              <th className="border p-2">販売者</th>
              <th className="border p-2">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border">
                <td className="border p-2">
                  <Link href={`/admin/product/${item.productId}`} className="text-blue-500 underline">
                    {item.productName}
                  </Link>
                </td>
                <td className="border p-2">{item.kind}</td>
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">¥{item.price.toLocaleString()}</td>
                <td className="border p-2">{item.seller}</td>
                <td className="border p-2">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
          <Link href="/admin/order" className="text-blue-500 hover:underline">
              注文一覧に戻る
          </Link>
      </div>
    </div>
  );
}
