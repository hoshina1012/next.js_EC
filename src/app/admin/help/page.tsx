"use client";
import Header from "@/app/components/headerAdmin";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Help {
  id: string;
  email: string;
  title: string;
  detail: string;
  createdAt: string;
  status: number;
}

export default function HelpListPage() {
  const [helps, setHelps] = useState<Help[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/admin/help?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        setHelps(data.helps);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("データ取得エラー", error));
  }, [currentPage]);

  const handleStatusChange = async (id: string, currentStatus: number) => {
    try {
      const res = await fetch(`/api/admin/help`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setHelps((prev) =>
          prev.map((help) =>
            help.id === id ? { ...help, status: data.newStatus } : help
          )
        );
      }
    } catch (error) {
      console.error("ステータス更新エラー", error);
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "未対応";
      case 1: return "対応中";
      case 2: return "対応済";
      default: return "";
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">問い合わせ一覧</h1>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">メールアドレス</th>
              <th className="border p-2">タイトル</th>
              <th className="border p-2">内容</th>
              <th className="border p-2">作成日</th>
              <th className="border p-2">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {helps.map((help) => (
              <tr key={help.id} className="border">
                <td className="border p-2 text-center">{help.id}</td>
                <td className="border p-2">{help.email}</td>
                <td className="border p-2">{help.title}</td>
                <td className="border p-2">{help.detail}</td>
                <td className="border p-2 text-center">
                  {new Date(help.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleStatusChange(help.id, help.status)}
                    className={`px-4 py-2 rounded ${
                      help.status === 0 ? "bg-red-500" :
                      help.status === 1 ? "bg-yellow-500" :
                      "bg-green-500"
                    } text-white`}
                  >
                    {getStatusText(help.status)}
                  </button>
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
