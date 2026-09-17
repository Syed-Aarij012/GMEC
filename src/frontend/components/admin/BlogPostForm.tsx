"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { BlogPost } from "@prisma/client";
import { Save, Loader2, Link2, X } from "lucide-react";
import { slugify } from "@/frontend/lib/utils";
import ImageUploader from "@/frontend/components/admin/ImageUploader";

interface Props {
  post?: BlogPost;
}

interface LinkOption {
  label: string;
  url: string;
}

export default function BlogPostForm({ post }: Props) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [author, setAuthor] = useState(post?.author ?? "GMEC Team");
  const [published, setPublished] = useState(post?.published ?? true);
  const [coverImages, setCoverImages] = useState<string[]>(post?.coverImage ? [post.coverImage] : []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [linkOptions, setLinkOptions] = useState<LinkOption[]>([]);
  const [linkPicker, setLinkPicker] = useState<{ start: number; end: number; text: string; url: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/blog/link-options")
      .then((res) => res.json())
      .then((data) => setLinkOptions(data.options ?? []))
      .catch(() => {});
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function openLinkPicker() {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    if (start === end) {
      setError("Select the words you want to turn into a link first, then click Insert Link.");
      return;
    }
    setError(null);
    setLinkPicker({ start, end, text: content.slice(start, end), url: "" });
  }

  function confirmLinkPicker() {
    if (!linkPicker) return;
    const { start, end, text, url } = linkPicker;
    if (!url.trim()) return;
    const markdown = `[${text}](${url.trim()})`;
    const next = content.slice(0, start) + markdown + content.slice(end);
    setContent(next);
    setLinkPicker(null);
    requestAnimationFrame(() => {
      const el = contentRef.current;
      if (!el) return;
      el.focus();
      const cursor = start + markdown.length;
      el.setSelectionRange(cursor, cursor);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImages[coverImages.length - 1] ?? "",
      author,
      published,
    };

    const res = await fetch(isEdit ? `/api/admin/blog/${post!.id}` : "/api/admin/blog", {
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

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card title="Post Content" delay={0}>
          <Field label="Title">
            <input required value={title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} />
          </Field>
          <Field label="URL Slug" className="mt-4">
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
          <Field label="Excerpt" className="mt-4">
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short 1-2 sentence summary shown on the blog listing page"
              className={inputClass}
            />
          </Field>
          <Field label="Content" className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-text/50">Select some text below, then click Insert Link to make it clickable.</p>
              <button
                type="button"
                onClick={openLinkPicker}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line/15 px-3 py-1.5 text-xs font-semibold text-text hover:border-gold-500 hover:text-gold-600"
              >
                <Link2 className="h-3.5 w-3.5" />
                Insert Link
              </button>
            </div>
            <textarea
              ref={contentRef}
              required
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={inputClass}
            />
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Cover Image" delay={0.05}>
          <ImageUploader images={coverImages} onChange={(imgs) => setCoverImages(imgs.slice(-1))} />
        </Card>

        <Card title="Publishing" delay={0.1}>
          <Field label="Author">
            <input required value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} />
          </Field>

          <label className="mt-4 flex items-center gap-2.5 text-sm font-medium text-text">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-line/20 accent-gold-500"
            />
            Published
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
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Publish Post"}
          </motion.button>
        </Card>
      </div>

      {linkPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setLinkPicker(null)}>
          <div
            className="w-full max-w-md rounded-2xl border border-line/10 bg-canvas p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text">Insert Link</h3>
              <button type="button" onClick={() => setLinkPicker(null)} className="text-text/50 hover:text-text">
                <X className="h-4 w-4" />
              </button>
            </div>

            <Field label="Link text">
              <input
                value={linkPicker.text}
                onChange={(e) => setLinkPicker({ ...linkPicker, text: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Link to" className="mt-4">
              <input
                list="blog-link-options"
                autoFocus
                value={linkPicker.url}
                onChange={(e) => setLinkPicker({ ...linkPicker, url: e.target.value })}
                placeholder="/shop/cool-white-led-bulbs or https://..."
                className={inputClass}
              />
              <datalist id="blog-link-options">
                {linkOptions.map((opt) => (
                  <option key={opt.url} value={opt.url} label={opt.label} />
                ))}
              </datalist>
              <p className="mt-1.5 text-xs text-text/50">Start typing to pick a page on the site, or paste a full URL.</p>
            </Field>

            <button
              type="button"
              onClick={confirmLinkPicker}
              disabled={!linkPicker.url.trim()}
              className="mt-5 w-full rounded-full bg-ink-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-gold-600 hover:text-ink-950 disabled:opacity-40"
            >
              Insert
            </button>
          </div>
        </div>
      )}
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
