import React, { useState } from "react";
import { sampleNews } from "../news/newsData";
import NewsCard from "../news/NewsCard";
import type { NewsItem } from "../news/types";
import { AdminField } from "./shared/AdminField";

type Lang = "es" | "en";

const emptyForm = {
  slug: "",
  date: "",
  imageUrl: "",
  es: { title: "", category: "", excerpt: "", content: [""] },
  en: { title: "", category: "", excerpt: "", content: [""] },
};

export default function NewsAdmin() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [lang, setLang] = useState<Lang>("es");
  const [saved, setSaved] = useState(false);

  function handleSharedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  function handleLangChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [name]: value },
    }));
    setSaved(false);
  }

  function handleContentChange(index: number, value: string) {
    setForm((prev) => {
      const content = [...prev[lang].content];
      content[index] = value;
      return { ...prev, [lang]: { ...prev[lang], content } };
    });
    setSaved(false);
  }

  function addParagraph() {
    setForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], content: [...prev[lang].content, ""] },
    }));
  }

  function removeParagraph(index: number) {
    setForm((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        content: prev[lang].content.filter((_, i) => i !== index),
      },
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newItem: NewsItem = {
      id: Date.now(),
      slug: form.slug || form.es.title.toLowerCase().replace(/\s+/g, "-"),
      date: form.date,
      imageUrl: form.imageUrl || undefined,
      title: form.es.title,
      category: form.es.category,
      excerpt: form.es.excerpt,
      content: form.es.content.filter((p) => p.trim() !== ""),
      title_en: form.en.title || undefined,
      category_en: form.en.category || undefined,
      excerpt_en: form.en.excerpt || undefined,
      content_en: form.en.content.filter((p) => p.trim() !== "").length
        ? form.en.content.filter((p) => p.trim() !== "")
        : undefined,
    };
    console.log("Nueva noticia:", newItem);
    setForm(emptyForm);
    setSaved(true);
  }

  const tabClass = (active: boolean) =>
    `tab ${active ? "tab-active" : ""}`;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Noticias</h2>
      <p className="text-base-content/60 mb-8 text-sm">Administración de noticias del sitio.</p>

      {/* Preview dropdown */}
      <div className="mb-8">
        <button
          onClick={() => setPreviewOpen((prev) => !prev)}
          className="btn btn-sm btn-ghost mb-3">
          <span>{previewOpen ? "▲" : "▼"}</span>
          Preview de Noticias
        </button>
        {previewOpen && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sampleNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </div>

      {/* Create form */}
      <h3 className="font-semibold text-lg mb-4">Agregar noticia</h3>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          {saved && <div className="alert alert-success"><span>Noticia guardada.</span></div>}

          {/* Shared fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminField label="Slug (opcional)" id="news-slug">
              <input
                id="news-slug"
                name="slug"
                value={form.slug}
                onChange={handleSharedChange}
                placeholder="url-de-la-noticia"
                className="input w-full"
              />
            </AdminField>
            <AdminField label="Fecha" id="news-date">
              <input
                id="news-date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleSharedChange}
                required
                className="input w-full"
              />
            </AdminField>
            <AdminField label="URL de imagen (opcional)" id="news-img">
              <input
                id="news-img"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleSharedChange}
                placeholder="https://..."
                className="input w-full"
              />
            </AdminField>
          </div>

          {/* Language tabs */}
          <div className="tabs tabs-border mt-2">
            <button type="button" className={tabClass(lang === "es")} onClick={() => setLang("es")}>
              🇪🇸 Español
            </button>
            <button type="button" className={tabClass(lang === "en")} onClick={() => setLang("en")}>
              🇺🇸 English
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminField label={lang === "es" ? "Título" : "Title"} id="news-title">
              <input
                id="news-title"
                name="title"
                value={form[lang].title}
                onChange={handleLangChange}
                placeholder={lang === "es" ? "Título de la noticia" : "News title"}
                required={lang === "es"}
                className="input w-full"
              />
            </AdminField>
            <AdminField label={lang === "es" ? "Categoría" : "Category"} id="news-category">
              <input
                id="news-category"
                name="category"
                value={form[lang].category}
                onChange={handleLangChange}
                placeholder={lang === "es" ? "Ej: Producto, Eventos" : "E.g.: Product, Events"}
                required={lang === "es"}
                className="input w-full"
              />
            </AdminField>
          </div>

          <AdminField label={lang === "es" ? "Resumen" : "Excerpt"} id="news-excerpt">
            <textarea
              id="news-excerpt"
              name="excerpt"
              value={form[lang].excerpt}
              onChange={handleLangChange}
              rows={2}
              placeholder={
                lang === "es"
                  ? "Descripción breve visible en la lista"
                  : "Short description shown in the list"
              }
              required={lang === "es"}
              className="textarea w-full"
            />
          </AdminField>

          <div>
            <p className="label text-sm font-medium mb-2">
              {lang === "es" ? "Contenido" : "Content"}
            </p>
            <div className="space-y-2">
              {form[lang].content.map((para, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    value={para}
                    onChange={(e) => handleContentChange(i, e.target.value)}
                    rows={3}
                    placeholder={lang === "es" ? `Párrafo ${i + 1}` : `Paragraph ${i + 1}`}
                    className="textarea w-full flex-1"
                  />
                  {form[lang].content.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParagraph(i)}
                      className="btn btn-sm btn-ghost text-error self-start mt-1"
                      title="Eliminar párrafo">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addParagraph}
              className="btn btn-sm btn-ghost mt-2">
              + {lang === "es" ? "Agregar párrafo" : "Add paragraph"}
            </button>
          </div>

          <div className="card-actions justify-end pt-2">
            <button type="submit" className="btn btn-primary">
              Guardar noticia
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
