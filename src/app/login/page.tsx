"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("メールアドレス:", email);
    console.log("パスワード:", password);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
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
  );
}
