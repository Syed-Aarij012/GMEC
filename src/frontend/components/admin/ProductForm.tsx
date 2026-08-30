"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Category, Product } from "@prisma/client";
import { Save, Loader2 } from "lucide-react";
import { slugify } from "@/frontend/lib/utils";
import { getProductImages } from "@/frontend/lib/product";
import ImageUploader from "@/frontend/components/admin/ImageUploader";

interface Props {
  categories: Category[];
  product?: Product;
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [sku, setSku] = useState(product?.sku ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [fitting, setFitting] = useState(product?.fitting ?? "");
  const [wattage, setWattage] = useState(product?.wattage ?? "");
  const [colour, setColour] = useState(product?.colour ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "100");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(product ? getProductImages(product.images) : []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      slug,
      sku,
      description,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      categoryId,
      fitting: fitting || null,
      wattage: wattage || null,
      colour: colour || null,
      stock: parseInt(stock, 10),
      featured,
      images,
    };

    const res = await fetch(isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (!res.ok) {
      setError(result.error ?? "Something went wrong");
      setSubmitting(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card title="Basic Information" delay={0}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Product Name">
              <input required value={name} onChange={(e) => handleNameChange(e.target.value)} className={inputClass} />
            </Field>
            <Field label="URL Slug">
              <input
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="SKU">
              <input required value={sku} onChange={(e) => setSku(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Category">
              <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Description" className="mt-4">
            <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
          </Field>
        </Card>

        <Card title="Pricing & Stock" delay={0.05}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Price (£)">
              <input required type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Compare-at Price (£)">
              <input type="number" step="0.01" min="0" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Stock">
              <input required type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Card>

        <Card title="Specifications" delay={0.1}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Fitting (optional)">
              <input value={fitting ?? ""} onChange={(e) => setFitting(e.target.value)} placeholder="GU10, E14, B22, E27" className={inputClass} />
            </Field>
            <Field label="Wattage (optional)">
              <input value={wattage ?? ""} onChange={(e) => setWattage(e.target.value)} placeholder="5W" className={inputClass} />
            </Field>
            <Field label="Colour (optional)">
              <input value={colour ?? ""} onChange={(e) => setColour(e.target.value)} placeholder="Warm White" className={inputClass} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Product Images" delay={0.05}>
          <ImageUploader images={images} onChange={setImages} />
        </Card>

        <Card title="Visibility" delay={0.1}>
          <label className="flex items-center gap-2.5 text-sm font-medium text-text">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-line/20 accent-gold-500"
            />
            Featured on homepage
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gold-600 hover:text-ink-950 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </motion.button>
        </Card>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-line/15 bg-canvas px-3.5 py-2.5 text-sm text-text outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500";

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-text">{label}</span>
      {children}
    </label>
  );
}

function Card({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text/50">{title}</h2>
      {children}
    </motion.div>
  );
}
