// src/components/common/ImageUpload.tsx
import React, { useRef, useState } from 'react';
import { UploadCloud, Trash2, Eye, X } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "Profile Image" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      convertToBase64(file);
    }
  };

  const convertToBase64 = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Please upload an image smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      convertToBase64(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative w-full max-w-md min-h-[140px] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-5 text-center cursor-pointer select-none
          ${value ? 'border-slate-200 bg-slate-50/50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50/50 bg-slate-50/20'}
          ${dragActive ? 'border-primary-500 bg-primary-50/30 scale-[1.01]' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {value ? (
          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0 shadow-sm">
              <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start gap-1.5 text-left">
              <p className="text-xs font-bold text-slate-800">Image Uploaded Successfully</p>
              <p className="text-[10px] text-slate-400">Click or drag new image to replace</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-md border border-primary-200/50 transition-colors"
                >
                  <Eye size={12} /> Preview
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md border border-red-200/50 transition-colors"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-slate-100 rounded-full text-slate-500 group-hover:text-primary-500 transition-colors">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Click to upload <span className="text-primary-600">or drag and drop</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WebP or SVG (max. 2MB)</p>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {showPreview && value && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => { e.stopPropagation(); setShowPreview(false); }}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-slate-800/80">
              <span className="text-sm font-semibold text-white">{label} Preview</span>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowPreview(false); }}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
              <img 
                src={value} 
                alt="Fullscreen Preview" 
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg border border-slate-700/50" 
                onClick={e => e.stopPropagation()} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
