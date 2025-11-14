// src/components/features/Chat/FileUploaderButton.jsx 
import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';

/**
 * A simplified button-based file selector for the chat input.
 * @param {object} props
 * @param {function(File): void} props.onFileSelect - Callback with the selected File object.
 * @param {string} props.acceptedTypes - String of MIME types (e.g., "image/*, .pdf, .zip").
 * @param {boolean} props.disabled - Disables the button.
 */
const FileUploaderButton = ({ onFileSelect, acceptedTypes, disabled }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = null; // Reset the input to allow selecting the same file again
    if (file) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        title="Attach File"
        className={`p-2 rounded-full transition-colors ${
            disabled 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
        }`}
      >
        <Paperclip className="h-5 w-5" />
      </button>
    </>
  );
};

export default FileUploaderButton;