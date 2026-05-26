"use client";

import React, { useEffect, useState } from "react";
import type { ContactInfo } from "@/types/contact";
import { DEFAULT_CONTACT_INFO } from "@/types/contact";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

export default function AdminContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo>(
    DEFAULT_CONTACT_INFO
  );

  useEffect(() => {
    fetchContactInfo();
  }, []);

  async function fetchContactInfo() {
    try {
      setError("");
      const response = await fetch("/api/admin/home/contact");
      if (!response.ok) {
        throw new Error("Failed to fetch contact info");
      }
      const data = await response.json();
      setContactInfo(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch contact info"
      );
    }
  }

  function validateEmail(email: string): string {
    const trimmed = email.trim();
    if (!trimmed) return "Email is required";
    if (!EMAIL_REGEX.test(trimmed)) return "Invalid email format";
    return "";
  }

  function validatePhone(phone: string): string {
    const trimmed = phone.trim();
    if (!trimmed) return "Phone is required";
    if (!PHONE_REGEX.test(trimmed)) return "Invalid phone format";
    return "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate
    const emailError = validateEmail(contactInfo.email);
    const phoneError = validatePhone(contactInfo.phone);

    if (emailError || phoneError) {
      setError(emailError || phoneError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/home/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInfo),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update contact info");
      }

      const updatedData = await response.json();
      setContactInfo(updatedData);
      setSuccess("Contact info updated successfully");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update contact info"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof ContactInfo, value: string) {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSuccess("");
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-6">
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md">
        <div className="card-body gap-5">
          <fieldset className="fieldset">
            <label className="label" htmlFor="company-name">Company Name</label>
            <input
              id="company-name"
              type="text"
              className="input input-bordered w-full"
              value={contactInfo.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Company name"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label" htmlFor="nit">NIT</label>
            <input
              id="nit"
              type="text"
              className="input input-bordered w-full"
              value={contactInfo.nit}
              onChange={(e) => handleChange("nit", e.target.value)}
              placeholder="NIT"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input input-bordered w-full"
              value={contactInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email address"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label" htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              className="input input-bordered w-full"
              value={contactInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Phone number"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label" htmlFor="address">Address (Optional)</label>
            <input
              id="address"
              type="text"
              className="input input-bordered w-full"
              value={contactInfo.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Address"
            />
          </fieldset>

          <div className="card-actions justify-end pt-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Contact Info"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

