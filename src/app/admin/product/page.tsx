"use client";
import Header from "@/app/components/headerAdmin";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  stock: number;
  salesTotal: number;
  seller: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/admin/product?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("データ取得エラー", error));
  }, [page]);

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">商品一覧</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">カテゴリ</th>
              <th className="border p-2">商品名</th>
              <th className="border p-2">値段</th>
              <th className="border p-2">在庫数</th>
              <th className="border p-2">販売累計</th>
              <th className="border p-2">販売者</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border">
                <td className="border p-2">{product.id}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2">
                  <Link href={`/admin/product/${product.id}`} className="text-blue-500 underline">
                    {product.name}
                  </Link>
                </td>
                <td className="border p-2 text-right">¥{product.price.toLocaleString()}</td>
                <td className="border p-2 text-right">{product.stock}</td>
                <td className="border p-2 text-right">{product.salesTotal}</td>
                <td className="border p-2">{product.seller}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ページネーション */}
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 border rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            前へ
          </button>
          <span className="px-4 py-2">ページ {page} / {totalPages}</span>
          <button
            className={`px-4 py-2 border rounded ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
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
