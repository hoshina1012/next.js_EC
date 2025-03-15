"use client";
import Header from "../components/header";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 API ステータスコード:", response.status); // ← ステータスコードを表示

      if (!response.ok) {
        throw new Error("ログインに失敗しました");
      }

      const data = await response.json();
      console.log("🎉 ログイン API レスポンス:", data);
      
      // localStorageに保存
      localStorage.setItem("user", JSON.stringify({ id: data.userId, name: data.userName, status: data.userStatus }));

      // ページ遷移後にリロード（Topコンポーネントで反映されるようにする）
      router.push(`/user/${data.userId}`);
      setTimeout(() => window.location.reload(), 100); // 短い遅延をつける
    } catch (err) {
      setError("ログインに失敗しました。メールアドレスまたはパスワードが間違っています。");
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto mt-10 p-4">
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <h1 className="text-2xl font-bold mb-4 text-center">ログイン</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
