"use client";

import React, { ChangeEvent, useState } from "react";

type Localized = { es: string; en: string };
type ContactInfo = {
  email: string;
  phone: string;
  title: Localized;
  description: Localized;
};

type ContactInfoErrors = Partial<Record<keyof ContactInfo, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

const DEFAULT_VALUES: ContactInfo = {
  email: "info@gsac.com",
  phone: "+1 234 567 890",
  title: { es: "", en: "" },
  description: { es: "", en: "" },
};

export default function AdminContact() {
  const [values, setValues] = useState<ContactInfo>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<ContactInfoErrors>({});
  const [saved, setSaved] = useState(false);

  function validateField(field: keyof ContactInfo, rawValue: string): string {
    const value = rawValue.trim();

    switch (field) {
      case "email":
        if (!value) return "El email es requerido.";
        if (!EMAIL_REGEX.test(value)) return "Ingresa un email válido.";
        return "";
      case "phone":
        if (!value) return "El teléfono es requerido.";
        if (!PHONE_REGEX.test(value)) return "Ingresa un teléfono válido.";
        return "";
      case "title.es":
        if (!value) return "El título es requerido.";
        if (value.length < 3) return "El título debe tener al menos 3 caracteres.";
        return "";
      case "title.en":
        if (!value) return "Title is required.";
        if (value.length < 3) return "Title must be at least 3 characters.";
        return "";
      case "description.es":
        if (!value) return "La descripción es requerida.";
        if (value.length < 10) return "La descripción debe tener al menos 10 caracteres.";
        return "";
      case "description.en":
        if (!value) return "Description is required.";
        if (value.length < 10) return "Description must be at least 10 characters.";
        return "";
      default:
        return "";
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;

    if (name === "title.es" || name === "title.en") {
      setValues((prev) => ({ ...prev, title: { ...prev.title, [name.split(".")[1]]: value } }));
    } else if (name === "description.es" || name === "description.en") {
      setValues((prev) => ({ ...prev, description: { ...prev.description, [name.split(".")[1]]: value } }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
    setSaved(false);
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof ContactInfo, value),
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: ContactInfoErrors = {
      email: validateField("email", values.email),
      phone: validateField("phone", values.phone),
      "title.es": validateField("title.es", values.title.es),
      "title.en": validateField("title.en", values.title.en),
      "description.es": validateField("description.es", values.description.es),
      "description.en": validateField("description.en", values.description.en),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    // TODO: send to DB
    console.log("Contact info to save:", values);
    setSaved(true);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>

      {saved && (
        <div className="alert alert-success mb-6">
          <span>Cambios guardados correctamente.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md">
        <div className="card-body gap-5">

          {/* Title */}
          <fieldset className="fieldset">
            <label className="label" htmlFor="admin-contact-title-es">Título de la sección (ES)</label>
            <input
              id="admin-contact-title-es"
              name="title.es"
              type="text"
              className={`input w-full ${errors["title.es"] ? "input-error" : ""}`}
              placeholder="Ej: Contáctanos"
              value={values.title.es}
              onChange={handleChange}
              aria-invalid={Boolean(errors["title.es"])}
              aria-describedby={errors["title.es"] ? "admin-contact-title-es-error" : undefined}
            />
            {errors["title.es"] && (
              <p id="admin-contact-title-es-error" className="text-sm text-error">{errors["title.es"]}</p>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <label className="label" htmlFor="admin-contact-title-en">Section title (EN)</label>
            <input
              id="admin-contact-title-en"
              name="title.en"
              type="text"
              className={`input w-full ${errors["title.en"] ? "input-error" : ""}`}
              placeholder="e.g. Contact us"
              value={values.title.en}
              onChange={handleChange}
              aria-invalid={Boolean(errors["title.en"])}
              aria-describedby={errors["title.en"] ? "admin-contact-title-en-error" : undefined}
            />
            {errors["title.en"] && (
              <p id="admin-contact-title-en-error" className="text-sm text-error">{errors["title.en"]}</p>
            )}
          </fieldset>

          {/* Description */}
          <fieldset className="fieldset">
            <label className="label" htmlFor="admin-contact-description-es">Descripción (ES)</label>
            <textarea
              id="admin-contact-description-es"
              name="description.es"
              className={`textarea w-full h-24 ${errors["description.es"] ? "textarea-error" : ""}`}
              placeholder="Texto introductorio de la sección de contacto"
              value={values.description.es}
              onChange={handleChange}
              aria-invalid={Boolean(errors["description.es"])}
              aria-describedby={errors["description.es"] ? "admin-contact-description-es-error" : undefined}
            />
            {errors["description.es"] && (
              <p id="admin-contact-description-es-error" className="text-sm text-error">{errors["description.es"]}</p>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <label className="label" htmlFor="admin-contact-description-en">Description (EN)</label>
            <textarea
              id="admin-contact-description-en"
              name="description.en"
              className={`textarea w-full h-24 ${errors["description.en"] ? "textarea-error" : ""}`}
              placeholder="Intro text for the contact section"
              value={values.description.en}
              onChange={handleChange}
              aria-invalid={Boolean(errors["description.en"])}
              aria-describedby={errors["description.en"] ? "admin-contact-description-en-error" : undefined}
            />
            {errors["description.en"] && (
              <p id="admin-contact-description-en-error" className="text-sm text-error">{errors["description.en"]}</p>
            )}
          </fieldset>

          {/* Email */}
          <fieldset className="fieldset">
            <label className="label" htmlFor="admin-contact-email">Email de contacto</label>
            <input
              id="admin-contact-email"
              name="email"
              type="email"
              className={`input w-full ${errors.email ? "input-error" : ""}`}
              placeholder="info@gsac.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "admin-contact-email-error" : undefined}
            />
            {errors.email && (
              <p id="admin-contact-email-error" className="text-sm text-error">{errors.email}</p>
            )}
          </fieldset>

          {/* Phone */}
          <fieldset className="fieldset">
            <label className="label" htmlFor="admin-contact-phone">Teléfono de contacto</label>
            <input
              id="admin-contact-phone"
              name="phone"
              type="tel"
              className={`input w-full ${errors.phone ? "input-error" : ""}`}
              placeholder="+1 234 567 890"
              value={values.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "admin-contact-phone-error" : undefined}
            />
            {errors.phone && (
              <p id="admin-contact-phone-error" className="text-sm text-error">{errors.phone}</p>
            )}
          </fieldset>

          <div className="card-actions justify-end pt-2">
            <button type="submit" className="btn btn-primary">
              Guardar cambios
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

