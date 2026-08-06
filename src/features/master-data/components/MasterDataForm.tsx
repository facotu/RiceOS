// Reusable form builder component for Master Data entities
// File: src/features/master-data/components/MasterDataForm.tsx

import React, { useState } from "react";
import { Plus } from "lucide-react";

export interface FormField {
  label: string;
  name: string;
  type: 'text' | 'number' | 'tel';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

interface MasterDataFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => Promise<boolean>;
}

export default function MasterDataForm({ title, fields, onSubmit }: MasterDataFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach(f => {
      init[f.name] = f.defaultValue || "";
    });
    return init;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setSuccess(false);

    try {
      const ok = await onSubmit(values);
      if (ok) {
        setSuccess(true);
        // Reset form
        const reset: Record<string, string> = {};
        fields.forEach(f => {
          reset[f.name] = f.defaultValue || "";
        });
        setValues(reset);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err: any) {
      setFormError(err.message || "Gửi biểu mẫu thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <h3 className="text-sm font-bold text-gray-800 tracking-tight border-b border-gray-50 pb-2">{title}</h3>
      
      {formError && (
        <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs font-bold">
          {formError}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
          Đã thêm mới bản ghi danh mục thành công!
        </div>
      )}

      <div className="space-y-3">
        {fields.map((field, idx) => (
          <div key={idx}>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">{field.label}</label>
            <input
              type={field.type}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              required={field.required}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-primary hover:bg-primary-light text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
      >
        <Plus className="w-4 h-4" />
        <span>{isSubmitting ? "Đang xử lý..." : "THÊM MỚI DANH MỤC"}</span>
      </button>
    </form>
  );
}
