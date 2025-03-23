"use client";
import Header from "./components/header";

export default function Top() {
  return (
    <div>
      <Header />
      <main className="p-4">
        <h1 className="text-3xl font-bold my-4 max-w-4xl mx-auto text-center">トップページ</h1>
      </main>
    </div>
  );
}
