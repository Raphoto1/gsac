"use client";

import { useTranslations } from "next-intl";
import React, { ChangeEvent, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REPEATED_CHARACTER_REGEX = /(.)\1{4,}/;

type ContactFormValues = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export default function Contact() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});

  function validateField(field: keyof ContactFormValues, rawValue: string) {
    const value = rawValue.trim();

    switch (field) {
      case "name":
        if (!value) {
          return t("validation.nameRequired");
        }

        if (value.length < 2) {
          return t("validation.nameMinLength");
        }

        if (REPEATED_CHARACTER_REGEX.test(value)) {
          return t("validation.repeatedCharacters");
        }

        return "";
      case "email":
        if (!value) {
          return t("validation.emailRequired");
        }

        if (!EMAIL_REGEX.test(value)) {
          return t("validation.emailInvalid");
        }

        return "";
      case "message":
        if (!value) {
          return t("validation.messageRequired");
        }

        if (value.length < 10) {
          return t("validation.messageMinLength");
        }

        if (REPEATED_CHARACTER_REGEX.test(value)) {
          return t("validation.repeatedCharacters");
        }

        return "";
      case "company":
        if (value && REPEATED_CHARACTER_REGEX.test(value)) {
          return t("validation.repeatedCharacters");
        }

        return "";
      default:
        return "";
    }
  }

  function validateForm(nextValues: ContactFormValues) {
    const nextErrors: ContactFormErrors = {
      name: validateField("name", nextValues.name),
      email: validateField("email", nextValues.email),
      company: validateField("company", nextValues.company),
      message: validateField("message", nextValues.message),
    };

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validateField(name as keyof ContactFormValues, value),
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const sanitizedValues: ContactFormValues = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      company: values.company.trim(),
      message: values.message.trim(),
    };

    setValues(sanitizedValues);

    if (!validateForm(sanitizedValues)) {
      return;
    }

    // TODO: wire up to backend / email service
    setSubmitted(true);
  }

  return (
    <section className="bg-base-200 py-20 px-4">
      <div className="mx-auto max-w-5xl flex flex-col lg:flex-row gap-12 items-start">
        {/* Left: info */}
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-base-content/70 mb-8">{t("description")}</p>
          <ul className="space-y-4 text-base-content/80">
            <li>
              <span className="font-semibold">{t("emailLabel")}:</span>{" "}
              <a href="mailto:info@gsac.com" className="link link-hover">info@gsac.com</a>
            </li>
            <li>
              <span className="font-semibold">{t("phoneLabel")}:</span>{" "}
              <a href="tel:+1234567890" className="link link-hover">+1 234 567 890</a>
            </li>
          </ul>
        </div>

        {/* Right: form */}
        <div className="lg:w-1/2 w-full">
          {submitted ? (
            <div className="alert alert-success">
              <span>{t("successMessage")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
              <div className="card-body gap-4">
                <fieldset className="fieldset">
                  <label className="label" htmlFor="contact-name">{t("nameLabel")}</label>
                  <input
                    name="name"
                    id="contact-name"
                    type="text"
                    className={`input w-full ${errors.name ? "input-error" : ""}`}
                    placeholder={t("namePlaceholder")}
                    value={values.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    minLength={2}
                    required
                  />
                  {errors.name ? <p id="contact-name-error" className="text-sm text-error">{errors.name}</p> : null}
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label" htmlFor="contact-email">{t("emailLabel")}</label>
                  <input
                    name="email"
                    id="contact-email"
                    type="email"
                    className={`input w-full ${errors.email ? "input-error" : ""}`}
                    placeholder={t("emailPlaceholder")}
                    value={values.email}
                    onChange={handleChange}
                    pattern={EMAIL_REGEX.source}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    required
                  />
                  {errors.email ? <p id="contact-email-error" className="text-sm text-error">{errors.email}</p> : null}
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label" htmlFor="contact-company">{t("companyLabel")}</label>
                  <input
                    name="company"
                    id="contact-company"
                    type="text"
                    className={`input w-full ${errors.company ? "input-error" : ""}`}
                    placeholder={t("companyPlaceholder")}
                    value={values.company}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? "contact-company-error" : undefined}
                  />
                  {errors.company ? <p id="contact-company-error" className="text-sm text-error">{errors.company}</p> : null}
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label" htmlFor="contact-message">{t("messageLabel")}</label>
                  <textarea
                    name="message"
                    id="contact-message"
                    className={`textarea w-full h-32 ${errors.message ? "textarea-error" : ""}`}
                    placeholder={t("messagePlaceholder")}
                    value={values.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    minLength={10}
                    required
                  />
                  {errors.message ? <p id="contact-message-error" className="text-sm text-error">{errors.message}</p> : null}
                </fieldset>

                <button type="submit" className="btn btn-primary w-full mt-2">
                  {t("submitButton")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
