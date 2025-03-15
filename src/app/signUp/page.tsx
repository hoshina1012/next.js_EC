"use client";
import Header from "../components/header";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ページ遷移用

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージ用
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // エラーをリセット

    try {
      const res = await fetch("/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mail: email, password }),
      });

      if (!res.ok) {
        // 既に登録されている場合
        if (res.status === 400) {
          setErrorMessage("メールアドレスは既に登録されています");
        } else {
          setErrorMessage("登録に失敗しました。もう一度お試しください。");
        }
        return;
      }

      // 成功時は /login に移動してメッセージを表示
      router.push("/login?message=登録に成功しました！ログインしましょう！");
    } catch (error) {
      console.error("エラー:", error);
      setErrorMessage("登録に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto mt-10 p-4">
        <a href="/signUpSeller" className="block text-center text-blue-600 hover:underline mb-4">
          販売者としての登録はこちらから
        </a>
        <h1 className="text-2xl font-bold mb-4 text-center">新規会員登録</h1>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>} {/* エラー表示 */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
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
            登録
          </button>
        </form>
      </div>
    </div>
  );
}
