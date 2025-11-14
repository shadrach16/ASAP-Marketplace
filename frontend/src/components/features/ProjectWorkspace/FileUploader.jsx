// src/components/features/ProjectWorkspace/FileUploader.jsx (Redesigned)

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import Button from '../../common/Button'; // Assuming you have this

/**
 * A modern, reusable file uploader component with drag-and-drop.
 * This component is "controlled" by the parent via onFileSelect.
 * It immediately passes the selected file up and then clears itself.
 * * @param {object} props
 * @param {function(File): void} props.onFileSelect - Callback with the selected File object.
 * @param {string} props.acceptedTypes - String of MIME types (e.g., "image/*, .pdf").
 * @param {boolean} props.disabled - Disables the uploader.
 */
const FileUploader = ({ onFileSelect, acceptedTypes, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  // --- Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processFile = (selectedFile) => {
    if (selectedFile) {
      // Pass the selected file up to the parent
      onFileSelect(selectedFile);
      // Reset the input value so the same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
        disabled={disabled}
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex justify-center px-6 pt-5 pb-6 border-2 ${
          isDragOver ? 'border-primary' : 'border-border'
        } border-dashed rounded-md transition-colors ${
          disabled ? 'bg-background-light opacity-70 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="space-y-1 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-text-light" />
          <div className="flex text-sm text-text-secondary">
            <button
              type="button"
              onClick={handleBrowseClick}
              disabled={disabled}
              className="relative font-medium text-primary hover:underline focus:outline-none"
            >
              Upload a file
            </button>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-text-light">
            File types: PDF, DOC, CSV, XLS, PNG, JPG, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;