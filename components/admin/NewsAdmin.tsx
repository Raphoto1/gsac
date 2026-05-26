import React, { useEffect, useRef, useState } from "react";
import NewsCard from "../news/NewsCard";
import type { NewsItem } from "@/types/news";
import { AdminField } from "./shared/AdminField";

type QuillType = typeof import("quill")["default"];
type QuillInstance = InstanceType<QuillType>;

type Lang = "es" | "en";

const NEWS_SECTION_VISIBILITY_EVENT = "gsac:news-section-visibility";

const emptyForm = {
  slug: "",
  date: "",
  isActive: true,
  imageUrl: "",
  es: { title: "", category: "", excerpt: "", content: [""] },
  en: { title: "", category: "", excerpt: "", content: [""] },
};

function mapNewsToForm(news: NewsItem) {
  return {
    slug: news.slug,
    date: news.date,
    isActive: news.isActive,
    imageUrl: news.imageUrl ?? "",
    es: {
      title: news.title,
      category: news.category,
      excerpt: news.excerpt,
      content: news.content.length > 0 ? [...news.content] : [""],
    },
    en: {
      title: news.title_en ?? "",
      category: news.category_en ?? "",
      excerpt: news.excerpt_en ?? "",
      content: news.content_en && news.content_en.length > 0 ? [...news.content_en] : [""],
    },
  };
}

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "blockquote",
  "list",
  "link",
];

type QuillEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: Record<string, unknown>;
  formats?: string[];
};

function QuillEditor({ value, onChange, placeholder, modules, formats }: QuillEditorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const onChangeRef = useRef(onChange);
  const lastKnownHtmlRef = useRef(value || "");
  const initialConfigRef = useRef({ placeholder, modules, formats });

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!hostRef.current || quillRef.current) return;

    let isMounted = true;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const { default: Quill } = await import("quill");
      if (!isMounted || !hostRef.current) return;

      const editorElement = document.createElement("div");
      hostRef.current.appendChild(editorElement);

      const editor = new Quill(editorElement, {
        theme: "snow",
        placeholder: initialConfigRef.current.placeholder,
        modules: initialConfigRef.current.modules,
        formats: initialConfigRef.current.formats,
      });

      quillRef.current = editor;
      editor.root.innerHTML = lastKnownHtmlRef.current;

      const handleTextChange = (_delta: unknown, _oldDelta: unknown, source: string) => {
        if (source !== "user") return;

        const currentHtml = editor.root.innerHTML;
        lastKnownHtmlRef.current = currentHtml;
        onChangeRef.current(currentHtml);
      };

      editor.on("text-change", handleTextChange);

      cleanup = () => {
        editor.off("text-change", handleTextChange);
        quillRef.current = null;
        if (hostRef.current) {
          hostRef.current.innerHTML = "";
        }
      };
    })();

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const editor = quillRef.current;
    if (!editor) return;

    const normalizedValue = value || "";
    if (normalizedValue !== lastKnownHtmlRef.current && editor.root.innerHTML !== normalizedValue) {
      editor.root.innerHTML = normalizedValue;
      lastKnownHtmlRef.current = normalizedValue;
    }
  }, [value]);

  return <div ref={hostRef} />;
}

function isRichTextEmpty(value: string): boolean {
  const plainText = value
    .replace(/<(.|\n)*?>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return plainText.length === 0;
}

export default function NewsAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sectionEnabled, setSectionEnabled] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    void fetchNews();
    void fetchSectionVisibility();
  }, []);

  async function fetchSectionVisibility() {
    try {
      setSectionLoading(true);
      const response = await fetch("/api/admin/news/section", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("No se pudo cargar el estado de la sección.");
      }

      const data = (await response.json()) as { newsEnabled?: boolean };
      const resolvedValue = data.newsEnabled !== false;
      setSectionEnabled(resolvedValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el estado de la sección.");
    } finally {
      setSectionLoading(false);
    }
  }

  async function fetchNews() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/news", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("No se pudieron cargar las noticias");
      }

      const data = (await response.json()) as { news?: NewsItem[] };
      setNewsList(Array.isArray(data.news) ? data.news : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar las noticias"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSharedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSuccess("");
  }

  async function handleToggleNewsActivation(slug: string, isActive: boolean) {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/news", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, isActive }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string; error?: string };
        throw new Error(data.message || data.error || "No se pudo actualizar el estado de la noticia");
      }

      setSuccess(isActive ? "Noticia activada." : "Noticia desactivada.");
      await fetchNews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar el estado de la noticia"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleSectionVisibility(nextValue: boolean) {
    setError("");
    setSuccess("");
    setSectionLoading(true);

    try {
      const response = await fetch("/api/admin/news/section", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newsEnabled: nextValue }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string; error?: string };
        throw new Error(data.message || data.error || "No se pudo actualizar la sección de noticias.");
      }

      setSectionEnabled(nextValue);
      window.dispatchEvent(
        new CustomEvent(NEWS_SECTION_VISIBILITY_EVENT, {
          detail: { newsEnabled: nextValue },
        })
      );
      setSuccess(nextValue ? "Sección de noticias activada." : "Sección de noticias desactivada.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar la sección de noticias."
      );
    } finally {
      setSectionLoading(false);
    }
  }

  function handleLangChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [name]: value },
    }));
    setSuccess("");
  }

  function handleContentChange(index: number, value: string) {
    setForm((prev) => {
      const content = [...prev[lang].content];
      content[index] = value;
      return { ...prev, [lang]: { ...prev[lang], content } };
    });
    setSuccess("");
  }

  function handleEditNews(news: NewsItem) {
    setError("");
    setSuccess("");
    setEditingNewsId(news.id);
    setForm(mapNewsToForm(news));
    setLang("es");
  }

  function handleCancelEdit() {
    setEditingNewsId(null);
    setForm(emptyForm);
    setLang("es");
    setError("");
    setSuccess("Edición cancelada.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const contentEs = form.es.content.filter((p) => !isRichTextEmpty(p));
    const contentEn = form.en.content.filter((p) => !isRichTextEmpty(p));

    if (contentEs.length === 0) {
      setError("Debes agregar al menos un párrafo en español.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: form.slug,
          date: form.date,
          isActive: form.isActive,
          imageUrl: form.imageUrl,
          es: {
            title: form.es.title,
            category: form.es.category,
            excerpt: form.es.excerpt,
            content: contentEs,
          },
          en: {
            title: form.en.title,
            category: form.en.category,
            excerpt: form.en.excerpt,
            content: contentEn,
          },
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string; error?: string };
        throw new Error(data.message || data.error || "No se pudo guardar la noticia");
      }

      const wasEditing = editingNewsId !== null;
      setEditingNewsId(null);
      setForm(emptyForm);
      setSuccess(wasEditing ? "Noticia actualizada correctamente." : "Noticia guardada correctamente.");
      await fetchNews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar la noticia"
      );
    } finally {
      setLoading(false);
    }
  }

  const tabClass = (active: boolean) =>
    `tab ${active ? "tab-active" : ""}`;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Noticias</h2>
      <p className="text-base-content/60 mb-8 text-sm">Administración de noticias del sitio.</p>

      {error && <div className="alert alert-error mb-5"><span>{error}</span></div>}
      {success && <div className="alert alert-success mb-5"><span>{success}</span></div>}

      <div className="mb-6 rounded-xl border border-base-300 bg-base-100 p-4">
        <h3 className="font-semibold text-lg">Sección de novedades</h3>
        <p className="mt-1 text-sm text-base-content/70">
          Controla si Noticias/Novedades aparece en la navegación pública.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={sectionEnabled}
            disabled={sectionLoading}
            onChange={(e) => void handleToggleSectionVisibility(e.target.checked)}
            aria-label="Activar o desactivar sección de novedades"
          />
          <span className="text-sm font-medium">
            {sectionEnabled ? "Sección visible en navegación" : "Sección oculta en navegación"}
          </span>
        </div>
      </div>

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
            {newsList.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
            {!loading && newsList.length === 0 ? (
              <p className="text-sm text-base-content/60">No hay noticias guardadas todavía.</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">Estado de noticias</h3>
        <div className="space-y-2">
          {newsList.map((news) => (
            <div key={`status-${news.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 px-4 py-3">
              <div>
                <p className="font-medium">{news.title}</p>
                <p className="text-xs text-base-content/60">/{news.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${news.isActive ? "badge-success" : "badge-ghost"}`}>
                  {news.isActive ? "Activa" : "Inactiva"}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => handleEditNews(news)}
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => void handleToggleNewsActivation(news.slug, !news.isActive)}
                  disabled={loading}
                >
                  {news.isActive ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          ))}
          {!loading && newsList.length === 0 ? (
            <p className="text-sm text-base-content/60">No hay noticias para administrar.</p>
          ) : null}
        </div>
      </div>

      {/* Create form */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-lg">{editingNewsId ? "Editar noticia" : "Agregar noticia"}</h3>
        {editingNewsId ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleCancelEdit}>
            Cancelar edición
          </button>
        ) : null}
      </div>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm">
        <div className="card-body gap-4">
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
            <AdminField label="Estado" id="news-active">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  id="news-active"
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleSharedChange}
                  className="toggle toggle-primary"
                />
                <span className="label-text">{form.isActive ? "Activa" : "Inactiva"}</span>
              </label>
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
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-full flex-1 rounded-box border border-base-300 bg-base-100">
                    <QuillEditor
                      value={para}
                      onChange={(value) => handleContentChange(i, value)}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder={lang === "es" ? `Párrafo ${i + 1}` : `Paragraph ${i + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-actions justify-end pt-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : editingNewsId ? "Actualizar noticia" : "Guardar noticia"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
