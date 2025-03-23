"use client";
import Header from "@/app/components/headerAdmin";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Seller {
  id: string;
  name: string;
  mail: string;
  orderCount: number;
  helpCount: number;
}

export default function SellerList() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/admin/seller?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setSellers(data.sellers);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("データ取得エラー", error));
  }, [page]);

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">申請者一覧</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">名前</th>
              <th className="border p-2">メールアドレス</th>
              <th className="border p-2">受注数</th>
              <th className="border p-2">問い合わせ数</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border">
                <td className="border p-2">{seller.id}</td>
                <td className="border p-2">{seller.name}</td>
                <td className="border p-2">{seller.mail}</td>
                <td className="border p-2 text-right">{seller.orderCount}</td>
                <td className="border p-2 text-right">{seller.helpCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ページネーション */}
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 border rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            前へ
          </button>
          <span className="px-4 py-2">ページ {page} / {totalPages}</span>
          <button
            className={`px-4 py-2 border rounded ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
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
