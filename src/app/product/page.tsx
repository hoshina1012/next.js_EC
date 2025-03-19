"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/header";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState<{ id: string; name: string; status: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // 1ページに表示する商品数

  useEffect(() => {
    // ローカルストレージからユーザー情報を取得
    const userData = localStorage.getItem("user");
    console.log("取得したユーザーデータ:", userData);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("商品の取得に失敗しました");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, []);

  // 現在のページの商品を取得
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div>
      <Header />
      <h1 className="text-3xl font-bold my-4 max-w-4xl mx-auto text-center">商品一覧</h1>

      {/* 商品リスト */}
      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
        {paginatedProducts.map((product: any) => {
          const isMyProduct = user?.id && product.userId === user.id;
          return (
            <div
              key={product.id}
              className={`p-4 border rounded-lg shadow ${isMyProduct ? "bg-pink-100" : ""}`}
            >
              <p>{product.category.name}</p>
              <p>{isMyProduct ? "マイ商品" : `販売者: ${product.user.name}`}</p>
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p>価格: {product.price}円</p>
              <p>在庫: {product.stock}</p>
              <Link href={`/product/${product.id}`} className="text-blue-500 hover:underline mt-2 block">
                詳細
              </Link>
            </div>
          );
        })}
      </div>

      {/* ページングボタン */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
        >
          前へ
        </button>
        <span className="px-4 py-2">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
        >
          次へ
        </button>
      </div>
    </div>
  );
}
