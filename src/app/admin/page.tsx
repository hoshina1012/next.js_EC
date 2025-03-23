"use client";
import Header from "../components/headerAdmin";
import Link from "next/link";

export default function Top() {
  return (
    <div>
      <Header />
      <main className="p-4 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold my-4 max-w-4xl mx-auto text-center">管理画面</h1>
        <div className="mt-4">
            <Link href="/admin/user" className="text-blue-500 hover:underline">
                ユーザー一覧
            </Link>
        </div>
        <div className="mt-1">
            <Link href="/admin/seller" className="text-blue-500 hover:underline">
                販売者一覧
            </Link>
        </div>
        <div className="mt-1">
            <Link href="/admin/product" className="text-blue-500 hover:underline">
                商品一覧
            </Link>
        </div>
        <div className="mt-1">
            <Link href="/admin/order" className="text-blue-500 hover:underline">
                注文一覧
            </Link>
        </div>
        <div className="mt-1">
            <Link href="/admin/help" className="text-blue-500 hover:underline">
                問い合わせ一覧
            </Link>
        </div>
      </main>
    </div>
  );
}
