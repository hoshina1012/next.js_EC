"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<{ id: string; name: string; status: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // ローカルストレージからユーザー情報を取得
    const userData = localStorage.getItem("user");
    console.log("取得したユーザーデータ:", userData);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/"); // トップページへ遷移
  };

  return (
    <header className="bg-orange-500 text-white p-4">
      <nav className="flex justify-between max-w-4xl mx-auto">
        <a href="/" className="text-lg font-bold hover:underline">
          ECサイト
        </a>
        <div className="space-x-4">
          {user ? (
            <>
              <a href={`/user/${user.id}`} className="hover:underline">
                ようこそ {user.name} さん！
              </a>
              <a href="/cart" className="hover:underline">
                カート
              </a>
              <button onClick={handleLogout} className="hover:underline">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="hover:underline">
                ログイン
              </a>
              <a href="/signUp" className="hover:underline">
                新規会員登録
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
