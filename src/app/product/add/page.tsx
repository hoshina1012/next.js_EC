"use client";

import Header from "@/app/components/header";
import { useState, useEffect } from "react";

export default function AddProductPage() {
  const [product, setProduct] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    selectedOptions: [] as string[], // 複数選択できるように配列で保持
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [types, setTypes] = useState<{ id: number; name: string }[]>([]); // ラケットの種類
  const [colors, setColors] = useState<{ id: number; name: string }[]>([]); // ラバーの色
  const [sizes, setSizes] = useState<{ id: number; name: string }[]>([]); // シューズのサイズ
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  // **ログイン中のユーザーIDを取得**
  useEffect(() => {
    // ローカルストレージからユーザー情報を取得
    const userData = localStorage.getItem("user");
    console.log("取得したユーザーデータ:", userData);
    if (userData) {
      setUserId(JSON.parse(userData));
    }
  }, []);

  // カテゴリを取得
  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    }

    fetchCategories();
  }, []);

  // カテゴリが変更された時に対応するタイプ、色、サイズを取得
  useEffect(() => {
    if (product.category === "ラケット") {
      fetchOptions("/api/types", setTypes); // ラケットの種類
    } else if (product.category === "ラバー") {
      fetchOptions("/api/colors", setColors); // ラバーの色
    } else if (product.category === "シューズ") {
      fetchOptions("/api/sizes", setSizes); // シューズのサイズ
    }
  }, [product.category]);

  const fetchOptions = async (url: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    const response = await fetch(url);
    const data = await response.json();
    setter(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    // チェックボックスの場合
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement; // 型アサーションを追加
      setProduct((prev) => {
        const selectedOptions = checked
          ? [...prev.selectedOptions, value]
          : prev.selectedOptions.filter((option) => option !== value);
        return { ...prev, [name]: selectedOptions };
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError("ログイン情報がありません。");
      return;
    }

    if (!product.category || !product.name || !product.description || !product.price || !product.stock) {
      setError("すべてのフィールドを入力してください。");
      return;
    }

    if (product.selectedOptions.length === 0) {
      setError("少なくとも1つのオプションを選択してください。");
      return;
    }

    // **カテゴリ名から categoryId を取得**
    const selectedCategory = categories.find((c) => c.name === product.category);
    if (!selectedCategory) {
      setError("カテゴリが無効です。");
      return;
    }

    const categoryId = selectedCategory.id;

    const newProduct = {
      userId,
      categoryId,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: Number(product.stock),
      options: product.selectedOptions.map((option) => Number(option)), // 型IDを数値に変換
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setSuccess("商品が登録されました！");
        setProduct({
          category: "",
          name: "",
          description: "",
          price: "",
          stock: "",
          selectedOptions: [],
        });
      } else {
        setError("商品登録に失敗しました。");
      }
    } catch (error) {
      setError("エラーが発生しました。");
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-lg mx-auto mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">新規商品登録</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* カテゴリ選択 */}
          <div>
            <label className="block font-medium">カテゴリ</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">選択してください</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 商品名 */}
          <div>
            <label className="block font-medium">商品名</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* 商品説明 */}
          <div>
            <label className="block font-medium">商品説明</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          {/* 価格 */}
          <div>
            <label className="block font-medium">価格</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>

          {/* 在庫 */}
          <div>
            <label className="block font-medium">在庫</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>

          {/* ラケットの種類、ラバーの色、シューズのサイズ */}
          {product.category === "ラケット" && (
            <div>
              <label className="block font-medium">ラケットの種類</label>
              <div className="space-y-2">
                {types.map((type) => (
                  <label key={type.id} className="block">
                    <input
                      type="checkbox"
                      name="selectedOptions"
                      value={type.id.toString()}
                      checked={product.selectedOptions.includes(type.id.toString())}
                      onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>} // 型キャスト
                    />
                    {type.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {product.category === "ラバー" && (
            <div>
              <label className="block font-medium">ラバーの色</label>
              <div className="space-y-2">
                {colors.map((color) => (
                  <label key={color.id} className="block">
                    <input
                      type="checkbox"
                      name="selectedOptions"
                      value={color.id.toString()}
                      checked={product.selectedOptions.includes(color.id.toString())}
                      onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>} // 型キャスト
                    />
                    {color.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {product.category === "シューズ" && (
            <div>
              <label className="block font-medium">シューズのサイズ</label>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <label key={size.id} className="block">
                    <input
                      type="checkbox"
                      name="selectedOptions"
                      value={size.id.toString()}
                      checked={product.selectedOptions.includes(size.id.toString())}
                      onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>} // 型キャスト
                    />
                    {size.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* エラーメッセージ */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* 成功メッセージ */}
          {success && <div className="text-green-500 text-sm">{success}</div>}

          {/* 送信ボタン */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            登録する
          </button>
        </form>
      </div>
    </div>
  );
}
