"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  AlertCircle,
  UploadCloud,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { Product, Category } from "@/types";

interface ProductFormProps {
  initialProduct?: Product;
  isEditing?: boolean;
}

export default function ProductForm({
  initialProduct,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [imageUrl, setImageUrl] = useState(initialProduct?.imageUrl || "");
  const [basePrice, setBasePrice] = useState(
    initialProduct?.basePrice?.toString() || "299"
  );
  const [salePrice, setSalePrice] = useState(
    initialProduct?.salePrice?.toString() || ""
  );
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || "");
  const [preparationInfo, setPreparationInfo] = useState(
    initialProduct?.preparationInfo || ""
  );
  const [isAvailable, setIsAvailable] = useState(
    initialProduct?.isAvailable ?? true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialProduct?.isFeatured ?? false
  );

  // Dynamic Add-ons
  const [addons, setAddons] = useState<Array<{ name: string; price: number }>>(
    initialProduct?.addons?.map((a) => ({ name: a.name, price: a.price })) || [
      { name: "Extra Dip", price: 49 },
    ]
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (!categoryId && data.categories.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      });
  }, [categoryId]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleAddAddon = () => {
    setAddons([...addons, { name: "", price: 39 }]);
  };

  const handleUpdateAddon = (
    index: number,
    field: "name" | "price",
    val: string
  ) => {
    const updated = [...addons];
    if (field === "price") {
      updated[index].price = parseFloat(val) || 0;
    } else {
      updated[index].name = val;
    }
    setAddons(updated);
  };

  const handleRemoveAddon = (index: number) => {
    setAddons(addons.filter((_, i) => i !== index));
  };

  // Gallery Image Upload State & Handlers
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (JPEG, PNG, WEBP, etc.)");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setImageUrl(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image from gallery");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploadError(null);

    if (!imageUrl.trim()) {
      setError("Please select and upload a dessert photo from your gallery.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isEditing
        ? `/api/products/${initialProduct?.id}`
        : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          basePrice: parseFloat(basePrice),
          salePrice: salePrice ? parseFloat(salePrice) : null,
          categoryId,
          preparationInfo: preparationInfo.trim() || undefined,
          isAvailable,
          isFeatured,
          addons: addons.filter((a) => a.name.trim().length > 0),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-caramel-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Products List
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
            {isEditing ? `Edit: ${initialProduct?.name}` : "Create New Dessert"}
          </h1>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4 stroke-[3]" />
          )}
          {isEditing ? "Save Changes" : "Publish Dessert"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-strawberry-500/15 border border-strawberry-500/40 text-strawberry-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Core Product Info */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400">
              Basic Details
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Dessert Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Chocolate Truffle Dream Bowl"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. chocolate-truffle-dream-bowl"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 font-mono focus:outline-none focus:border-caramel-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe layers, chocolate percentage, texture, and taste sensation..."
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                Preparation & Serving Instructions
              </label>
              <input
                type="text"
                value={preparationInfo}
                onChange={(e) => setPreparationInfo(e.target.value)}
                placeholder="e.g. Served chilled or warm with dessert spoon"
                className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
            </div>
          </div>

          {/* Pricing & Category */}
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400">
              Pricing & Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                  Sale Price (₹, Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="e.g. 279"
                  className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-cream-200">
                  Category *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-cocoa-950">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Add-ons Builder */}
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400">
                Configurable Paid Add-ons
              </h3>
              <button
                type="button"
                onClick={handleAddAddon}
                className="px-3 py-1.5 rounded-xl bg-cocoa-950 border border-white/10 hover:border-caramel-500 text-xs text-cream-200 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Extra Option
              </button>
            </div>

            <div className="space-y-3">
              {addons.map((addon, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Add-on Name (e.g. Extra Dark Cocoa Dip)"
                    value={addon.name}
                    onChange={(e) => handleUpdateAddon(index, "name", e.target.value)}
                    className="flex-1 bg-cocoa-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                  />
                  <div className="w-28 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-300/40 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Price"
                      value={addon.price}
                      onChange={(e) => handleUpdateAddon(index, "price", e.target.value)}
                      className="w-full bg-cocoa-950/80 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAddon(index)}
                    className="p-2 text-cream-300/50 hover:text-strawberry-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Photography & Availability */}
        <div className="md:col-span-4 space-y-6">
          {/* Direct Gallery Image Upload */}
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400">
                Product Photo
              </h3>
              <span className="text-[11px] text-cream-300/50">Direct Gallery Upload</span>
            </div>

            {/* Hidden file input supporting mobile gallery and camera */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imageUrl ? (
              <div className="space-y-3">
                <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-white/10 bg-cocoa-950 group">
                  <Image
                    src={imageUrl}
                    alt={name || "Product preview"}
                    fill
                    sizes="400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-cocoa-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                      <RefreshCw className="w-6 h-6 animate-spin text-caramel-400" />
                      <span className="text-xs font-semibold text-cream-200">
                        Uploading new photo...
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-2.5 rounded-xl bg-cocoa-800 hover:bg-cocoa-700 border border-caramel-500/30 text-caramel-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    disabled={isUploading}
                    className="px-3 py-2.5 rounded-xl bg-cocoa-950/80 hover:bg-strawberry-950/50 border border-white/10 hover:border-strawberry-500/40 text-cream-300/60 hover:text-strawberry-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[200px] ${
                  isDragOver
                    ? "border-caramel-400 bg-caramel-500/10 scale-[1.01]"
                    : "border-white/15 bg-cocoa-950/60 hover:border-caramel-500/40 hover:bg-cocoa-950"
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-caramel-400" />
                    <p className="text-xs font-semibold text-cream-100">
                      Uploading from gallery...
                    </p>
                    <p className="text-[11px] text-cream-300/50">Saving high-res dessert photo</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-caramel-500/15 border border-caramel-500/30 flex items-center justify-center text-caramel-400 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-cream-100">
                        Upload from Gallery / Photos
                      </p>
                      <p className="text-[11px] text-cream-300/60 mt-1">
                        Tap here to pick from your phone gallery or files
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-cream-300/70">
                      JPG, PNG, WEBP, GIF up to 12MB
                    </span>
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <div className="p-3 rounded-xl bg-strawberry-500/15 border border-strawberry-500/40 text-strawberry-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Availability & Featured Flags */}
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400">
              Status Flags
            </h3>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-cocoa-950/80 border border-white/10 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-cream-100">Available to Order</p>
                <p className="text-[11px] text-cream-300/60">
                  When unticked, dessert displays as "Sold Out"
                </p>
              </div>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-caramel-500 rounded border-white/20 focus:ring-caramel-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-cocoa-950/80 border border-white/10 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-cream-100">Featured on Homepage</p>
                <p className="text-[11px] text-cream-300/60">
                  Displays in signature collection
                </p>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-caramel-500 rounded border-white/20 focus:ring-caramel-500"
              />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
