"use client";
import Header from "@/app/components/headerAdmin";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  mail: string;
  _count: {
    orders: number;
    helps: number;
  };
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1); // 現在のページ番号
  const [totalPages, setTotalPages] = useState(1); // 総ページ数

  const USERS_PER_PAGE = 5; // 1ページに表示する件数

  useEffect(() => {
    fetch(`/api/admin/user?page=${page}&limit=${USERS_PER_PAGE}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("データ取得エラー", error));
  }, [page]);

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">ユーザー一覧</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">名前</th>
              <th className="border p-2">メールアドレス</th>
              <th className="border p-2">注文数</th>
              <th className="border p-2">問い合わせ数</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.mail}</td>
                <td className="border p-2 text-right">{user._count.orders}</td>
                <td className="border p-2 text-right">{user._count.helps}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 border rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
          >
            前へ
          </button>
          <span className="text-lg">ページ {page} / {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-4 py-2 border rounded ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
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