export default function Top() {
  return (
    <div>
      <header className="bg-blue-500 text-white p-4">
        <nav className="flex justify-between max-w-4xl mx-auto">
          <a href="/" className="text-lg font-bold hover:underline">
            ECサイト
          </a>
          <div className="space-x-4">
            <a href="/login" className="hover:underline">
              ログイン
            </a>
            <a href="/signUp" className="hover:underline">
              新規会員登録
            </a>
          </div>
        </nav>
      </header>
      <main className="p-4">
        <h1 className="text-2xl font-bold">トップページ</h1>
      </main>
    </div>
  );
}