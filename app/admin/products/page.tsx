"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Sparkles, Check, X, RefreshCw, AlertCircle } from "lucide-react";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?includeUnavailable=true&_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        let deletedKeys: string[] = [];
        let overrides: Record<string, Product> = {};
        try {
          const storedDeleted = localStorage.getItem("cravings_deleted_items");
          if (storedDeleted) deletedKeys = JSON.parse(storedDeleted);
          const storedOverrides = localStorage.getItem("cravings_product_overrides");
          if (storedOverrides) overrides = JSON.parse(storedOverrides);
        } catch {}

        const filtered = data.products
          .filter(
            (p: Product) =>
              !deletedKeys.includes(p.id) &&
              !deletedKeys.includes(p.slug)
          )
          .map((p: Product) => {
            const override = overrides[p.id] || overrides[p.slug];
            return override ? { ...p, ...override } : p;
          });

        setProducts(filtered);
      }
    } catch (e) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleAvailability = async (product: Product) => {
    const updatedStatus = !product.isAvailable;
    const updatedProduct = { ...product, isAvailable: updatedStatus };

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? updatedProduct : p))
    );

    try {
      const storedOverrides = localStorage.getItem("cravings_product_overrides");
      const overrides = storedOverrides ? JSON.parse(storedOverrides) : {};
      overrides[product.id] = updatedProduct;
      if (product.slug) overrides[product.slug] = updatedProduct;
      localStorage.setItem("cravings_product_overrides", JSON.stringify(overrides));
    } catch {}

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: updatedStatus }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
    } catch {
      // Revert if error
      fetchProducts();
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const updatedStatus = !product.isFeatured;
    const updatedProduct = { ...product, isFeatured: updatedStatus };

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? updatedProduct : p))
    );

    try {
      const storedOverrides = localStorage.getItem("cravings_product_overrides");
      const overrides = storedOverrides ? JSON.parse(storedOverrides) : {};
      overrides[product.id] = updatedProduct;
      if (product.slug) overrides[product.slug] = updatedProduct;
      localStorage.setItem("cravings_product_overrides", JSON.stringify(overrides));
    } catch {}

    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: updatedStatus }),
      });
    } catch {
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const targetProduct = products.find((p) => p.id === id);

    // Immediately record locally so even on page refresh / cold start it stays deleted
    try {
      const stored = localStorage.getItem("cravings_deleted_items");
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(id)) list.push(id);
      if (targetProduct?.slug && !list.includes(targetProduct.slug)) {
        list.push(targetProduct.slug);
      }
      localStorage.setItem("cravings_deleted_items", JSON.stringify(list));

      const storedOverrides = localStorage.getItem("cravings_product_overrides");
      if (storedOverrides) {
        const overrides = JSON.parse(storedOverrides);
        delete overrides[id];
        if (targetProduct?.slug) delete overrides[targetProduct.slug];
        localStorage.setItem("cravings_product_overrides", JSON.stringify(overrides));
      }
    } catch {}

    // Optimistically update UI
    setProducts((prev) => prev.filter((p) => p.id !== id && p.slug !== id));

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn("Server delete warning:", await res.text());
      }
    } catch (err) {
      console.warn("Delete request network notice:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-caramel-400 font-bold">
            Catalog & Inventory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-cream-100 mt-1">
            Menu Management
          </h1>
          <p className="text-xs text-cream-300/60 mt-0.5">
            Add desserts, change prices, toggle sold-out status, and configure add-ons.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-3 rounded-2xl bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Create New Dessert
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-caramel-400 animate-spin mx-auto" />
          <p className="text-sm font-medium">Loading desserts catalog...</p>
        </div>
      ) : (
        <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-cream-200">
              <thead className="bg-cocoa-950/80 text-[10px] uppercase tracking-wider text-caramel-400 border-b border-white/10 font-bold">
                <tr>
                  <th className="py-4 px-6">Dessert</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Base Price</th>
                  <th className="py-4 px-4">Sale Price</th>
                  <th className="py-4 px-4">Add-ons</th>
                  <th className="py-4 px-4">Availability</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized={Boolean(product.imageUrl?.startsWith("data:"))}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-cream-100">{product.name}</p>
                          <p className="text-[11px] text-cream-300/50 truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-cocoa-950 border border-white/10 text-[11px]">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-cream-100">
                      ₹{product.basePrice}
                    </td>

                    <td className="py-4 px-4">
                      {product.salePrice ? (
                        <span className="font-bold text-caramel-400">
                          ₹{product.salePrice}
                        </span>
                      ) : (
                        <span className="text-cream-300/40">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs text-cream-300/80">
                        {product.addons?.length || 0} extra(s)
                      </span>
                    </td>

                    {/* Instant Availability Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleAvailability(product)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          product.isAvailable
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                            : "bg-strawberry-500/20 text-strawberry-300 border-strawberry-500/40 hover:bg-strawberry-500/30"
                        }`}
                      >
                        {product.isAvailable ? "Available" : "Sold Out"}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          product.isFeatured
                            ? "bg-caramel-500 text-cocoa-950 border-caramel-500"
                            : "bg-cocoa-950 text-cream-300/40 border-white/10 hover:border-white/30"
                        }`}
                        title="Toggle homepage featured"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-xl bg-cocoa-950 border border-white/10 text-cream-200 hover:text-white transition-colors"
                          title="Edit dessert"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-2 rounded-xl bg-cocoa-950 border border-white/10 text-cream-300/60 hover:text-strawberry-400 transition-colors"
                          title="Delete dessert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
