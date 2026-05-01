# Guía de Multilingüismo - GSAC Project (Opción 2: URLs Limpias)

Este proyecto está configurado para soportar múltiples idiomas: **Español (es)** e **Inglés (en)** con **URLs limpias sin el idioma en la URL**, siguiendo la documentación oficial de [next-intl.dev](https://next-intl.dev/).

## 🏗️ Estructura de Archivos

```
gsac/
├── app/
│   ├── layout.tsx             # Layout raíz con NextIntlClientProvider
│   ├── page.tsx               # Página principal
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── products/
│   │   └── page.tsx
│   ├── api/
│   │   └── set-locale/
│   │       └── route.ts       # API para cambiar idioma
│   └── globals.css
├── i18n/
│   └── request.ts             # Configuración de mensajes y locale
├── messages/
│   ├── es.json                # Traducciones en español
│   └── en.json                # Traducciones en inglés
├── components/
│   ├── language/
│   │   └── LanguageSwitcher.tsx  # Selector de idioma
│   └── home/
│       └── Home.tsx
├── next.config.ts             # Plugin de next-intl
└── tsconfig.json
```

## 🌐 URLs Limpias

Las URLs **NO incluyen el idioma**:
- `http://localhost:3000` → Página principal en español (por defecto)
- `http://localhost:3000/about` → About page
- `http://localhost:3000/contact` → Contact page
- `http://localhost:3000/products` → Products page

El idioma se obtiene del **cookie** `locale` y se puede cambiar dinámicamente.

## 🔧 Cómo Funciona

### 1. Detectar el Locale

**`i18n/request.ts`** - Lee el locale de cookies:
```typescript
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const store = await cookies();
  let locale = store.get('locale')?.value || 'es'; // Default: español

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

### 2. Layout Raíz

**`app/layout.tsx`** - Proporciona mensajes a Client Components:
```typescript
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function RootLayout({ children }) {
  const messages = await getMessages();

  return (
    <html>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 3. Cambiar Idioma

**`app/api/set-locale/route.ts`** - API para guardar el locale en cookie:
```typescript
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { locale } = await request.json();
  
  const store = await cookies();
  store.set('locale', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 año
    path: '/',
  });

  return NextResponse.json({ success: true });
}
```

**`components/language/LanguageSwitcher.tsx`** - Componente para cambiar:
```typescript
"use client";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();

  const handleLocaleChange = async (newLocale: string) => {
    const response = await fetch("/api/set-locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: newLocale }),
    });

    if (response.ok) {
      window.location.reload(); // Recarga para aplicar el nuevo idioma
    }
  };

  return (
    <div className="flex gap-2">
      {["es", "en"].map((lang) => (
        <button
          key={lang}
          onClick={() => handleLocaleChange(lang)}
          className={locale === lang ? "bg-blue-600 text-white" : "bg-gray-200"}
        >
          {lang === "es" ? "Español" : "English"}
        </button>
      ))}
    </div>
  );
}
```

## 📝 Archivos de Traducción

**`messages/es.json`** y **`messages/en.json`** deben tener las mismas claves:

```json
{
  "navigation": {
    "home": "Home",
    "about": "About",
    "products": "Products",
    "contact": "Contact"
  },
  "home": {
    "welcome": "Welcome",
    "description": "Your description here"
  },
  "about": {
    "title": "About Us",
    "description": "Information about our company"
  },
  "products": {
    "title": "Our Products",
    "description": "Explore our catalog"
  },
  "contact": {
    "title": "Contact Us",
    "description": "Get in touch with us"
  }
}
```

## 💻 Usar Traducciones en Componentes

### En Client Components
```typescript
"use client";
import { useTranslations, useLocale } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("mySection");
  const locale = useLocale(); // 'es' o 'en'
  
  return <p>{t("myKey")}</p>;
}
```

### En Server Components
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('mySection');
  return <h1>{t('title')}</h1>;
}
```

## ➕ Agregar Nuevas Traducciones

1. Edita **`messages/es.json`** y **`messages/en.json`** con las mismas claves
2. Agrupa las traducciones por sección
3. Usa `useTranslations("sectionName")` en componentes

**Ejemplo:**
```json
// messages/es.json
{
  "blog": {
    "title": "Blog",
    "readMore": "Leer más"
  }
}

// messages/en.json
{
  "blog": {
    "title": "Blog",
    "readMore": "Read more"
  }
}
```

Luego en el componente:
```tsx
const t = useTranslations('blog');
<h2>{t('title')}</h2>
<button>{t('readMore')}</button>
```

## 🎯 Ventajas de esta Opción

✅ **URLs limpias** - `/about` en lugar de `/en/about`
✅ **Simplicidad** - No requiere `[locale]` dinámico
✅ **Flexible** - El idioma se puede cambiar desde el estado de la app
✅ **SEO** - Todas las páginas tienen la misma URL (usa hreflang para SEO)
✅ **Mejor UX** - URLs más amigables para usuarios

## ⚠️ Consideraciones

- Las URLs no cambian al cambiar idioma (se recarga la página)
- Para mejor SEO con múltiples idiomas, considera agregar `hreflang` tags
- El cookie persiste por 1 año

## 📱 Hooks Disponibles

### Para Client Components
```typescript
import {
  useTranslations,    // Obtener traducciones
  useLocale,         // Obtener locale actual
  useFormatter,      // Formatear números, fechas
  useMessages,       // Obtener todos los mensajes
} from 'next-intl';
```

### Para Server Components
```typescript
import {
  getTranslations,   // Obtener traducciones (async)
  getLocale,        // Obtener locale actual (async)
  getMessages,      // Obtener todos los mensajes (async)
  getFormatter,     // Obtener formateador (async)
} from 'next-intl/server';
```

## ➕ Agregar Más Idiomas

1. Crea `messages/fr.json` con las mismas claves
2. Actualiza `i18n/request.ts` para validar el nuevo locale:
   ```typescript
   const validLocales = ['es', 'en', 'fr'];
   ```
3. Actualiza `components/language/LanguageSwitcher.tsx` si quieres mostrar el nuevo idioma

## 🔗 Recursos Oficiales

- [next-intl Documentation](https://next-intl.dev/)
- [Without Locale-Based Routing](https://next-intl.dev/docs/getting-started/app-router#internationalization-without-routing)
- [Request Configuration](https://next-intl.dev/docs/usage/configuration)

## ✨ Flujo de Cambio de Idioma

1. Usuario hace click en botón de idioma
2. Se envía POST a `/api/set-locale` con el nuevo locale
3. El servidor guarda el locale en un cookie
4. La página se recarga para aplicar el nuevo idioma
5. `i18n/request.ts` lee el cookie y carga los mensajes correspondientes
6. La página se renderiza con las nuevas traducciones



