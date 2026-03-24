"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

export default function Contact() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
                    id="contact-name"
                    type="text"
                    className="input w-full"
                    placeholder={t("namePlaceholder")}
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label" htmlFor="contact-email">{t("emailLabel")}</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="input w-full"
                    placeholder={t("emailPlaceholder")}
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label" htmlFor="contact-company">{t("companyLabel")}</label>
                  <input
                    id="contact-company"
                    type="text"
                    className="input w-full"
                    placeholder={t("companyPlaceholder")}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label" htmlFor="contact-message">{t("messageLabel")}</label>
                  <textarea
                    id="contact-message"
                    className="textarea w-full h-32"
                    placeholder={t("messagePlaceholder")}
                    required
                  />
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
