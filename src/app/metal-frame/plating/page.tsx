"use client";

import { useState, useMemo } from "react";
import {
  Card,
  PageHeader,
  Field,
  Input as UIInput,
  Select as UISelect,
  Button,
  Alert,
} from "@/components/ui";

const CATEGORY_OPTIONS = ["Fresh", "Rework"];

const SIZE_OPTIONS = ["XN", "N", "M", "W", "XW", "XL", "L", "LH", "RH", "NB"];

const FINISH_OPTIONS = [
  "Black Chrome",
  "Silver W/O EPL",
  "Gold W/O EPL",
  "Light Gunmetal W/O EPL",
  "Dark Gunmetal W/O EPL",
  "Silver with EPL (Shiny)",
  "Gold with EPL (Shiny)",
  "Light Gunmetal with EPL (Shiny)",
  "Dark Gunmetal with EPL (Shiny)",
  "Silver with EPL (Matte)",
  "Gold with EPL (Matte)",
  "Light Gunmetal with EPL (Matte)",
  "Dark Gunmetal with EPL (Matte)",
];

export default function PlatingPage() {
  const [form, setForm] = useState({
    categoryOfWork: "",
    modelId: "",
    size: "",
    finish: "",
    totalQuantity: 0,
    qcQuantity: 0,
    copperRejection: 0,
    nickelRejection: 0,
    lineRejection: 0,
    fqcRejection: 0,
  });

  const [message, setMessage] = useState<string | null>(null);

  /* ==========================
     Derived NG
  ========================== */
  const ngQuantity = useMemo(() => {
    const ng = form.totalQuantity - form.qcQuantity;
    return ng >= 0 ? ng : 0;
  }, [form.totalQuantity, form.qcQuantity]);

  const breakupTotal = useMemo(() => {
    return (
      form.copperRejection +
      form.nickelRejection +
      form.lineRejection +
      form.fqcRejection
    );
  }, [form]);

  /* ==========================
     Change Handler
  ========================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      [
        "totalQuantity",
        "qcQuantity",
        "copperRejection",
        "nickelRejection",
        "lineRejection",
        "fqcRejection",
      ].includes(name)
    ) {
      setForm((prev) => ({
        ...prev,
        [name]: Number(value) || 0,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ==========================
     Submit
  ========================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.categoryOfWork) {
      setMessage("❌ Category of Work is required");
      setTimeout(() => setMessage(null), 2500);
      return;
    }

    if (breakupTotal !== ngQuantity) {
      setMessage("❌ NG breakup does not match NG quantity");
      setTimeout(() => setMessage(null), 2500);
      return;
    }

    const payload = {
      ...form,
      ngQuantity,
    };

    const res = await fetch("/api/metal-frame/plating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setMessage("❌ Error saving entry");
    } else {
      setMessage("✔️ Entry saved successfully");
    }

    setTimeout(() => setMessage(null), 2500);
  };

  return (
    <div
      className="relative flex min-h-full items-center justify-center"
      style={{
        backgroundImage: "url('/images/plating-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <Card variant="floating" className="relative z-10 w-full max-w-3xl p-8">
        <PageHeader title="Metal Frame – Plating Entry" />

        {message && (
          <Alert
            tone={message.startsWith("✔️") ? "success" : "error"}
            className="mb-4"
          >
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CATEGORY FIRST */}
          <div className="grid grid-cols-1 gap-4">
            <SelectField
              label="Category of Work"
              name="categoryOfWork"
              value={form.categoryOfWork}
              options={CATEGORY_OPTIONS}
              onChange={handleChange}
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Model ID">
              <UIInput
                name="modelId"
                value={form.modelId}
                onChange={handleChange}
              />
            </Field>

            <SelectField
              label="Size"
              name="size"
              value={form.size}
              options={SIZE_OPTIONS}
              onChange={handleChange}
            />

            <SelectField
              label="Finish"
              name="finish"
              value={form.finish}
              options={FINISH_OPTIONS}
              onChange={handleChange}
            />
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <NumberField
              label="Total Quantity"
              name="totalQuantity"
              value={form.totalQuantity}
              onChange={handleChange}
            />
            <NumberField
              label="QC Quantity"
              name="qcQuantity"
              value={form.qcQuantity}
              onChange={handleChange}
            />
            <NumberField
              label="NG Quantity (Auto)"
              name="ngQuantity"
              value={ngQuantity}
              disabled
            />
          </div>

          {/* NG Breakup */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-brand-700">
              NG Breakup
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <NumberField
                label="Copper"
                name="copperRejection"
                value={form.copperRejection}
                onChange={handleChange}
              />
              <NumberField
                label="Nickel"
                name="nickelRejection"
                value={form.nickelRejection}
                onChange={handleChange}
              />
              <NumberField
                label="Line"
                name="lineRejection"
                value={form.lineRejection}
                onChange={handleChange}
              />
              <NumberField
                label="FQC"
                name="fqcRejection"
                value={form.fqcRejection}
                onChange={handleChange}
              />
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Breakup Total: <strong>{breakupTotal}</strong>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto md:px-8">
            Save Entry
          </Button>
        </form>
      </Card>
    </div>
  );
}

/* ==========================
   Reusable field helpers (built on shared primitives)
========================== */

function NumberField({ label, ...props }: any) {
  return (
    <Field label={label}>
      <UIInput type="number" min="0" {...props} />
    </Field>
  );
}

function SelectField({ label, options, ...props }: any) {
  return (
    <Field label={label}>
      <UISelect {...props}>
        <option value="">Select</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </UISelect>
    </Field>
  );
}
