"use client";

import Header from "@/app/components/header";
import { useState, useEffect } from "react";

export default function HelpPage() {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    }
  }, []);

  const handleSubmit = async () => {
    if (title.length < 1 || detail.length < 1) {
      setError("タイトルと内容を入力してください。");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, detail }),
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }

      alert("問い合わせが送信されました");
      setTitle("");
      setDetail("");
    } catch (err) {
      setError("送信中にエラーが発生しました。");
      console.error(err);
    }
  };

  return (
    <div>
        <Header />
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">お問い合わせ</h1>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="mb-4">
                <label className="block text-sm font-medium">タイトル</label>
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="問い合わせのタイトル"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium">内容</label>
                <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full border rounded p-2 h-32"
                placeholder="問い合わせの詳細"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
                送信
            </button>
        </div>
    </div>
  );
}
