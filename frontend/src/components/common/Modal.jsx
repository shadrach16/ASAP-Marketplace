// src/components/common/Modal.js (NEW FILE)

import React, { useEffect, Fragment } from 'react';
import { X } from 'lucide-react';
import { Transition } from '@headlessui/react'; // Using a simple transition library
import Button from './Button';

/**
 * A reusable Modal component.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls if the modal is open or not.
 * @param {function} props.onClose - Function to call when the modal should close.
 * @param {string} props.title - The title to display in the modal header.
 * @param {React.ReactNode} props.children - The content to display in the modal body.
 */
const Modal = ({ isOpen, onClose, title, children,isAlert }) => {
  // Effect to handle 'Escape' key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />
        </Transition.Child>

        {/* Modal Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className={`relative mx-4 w-full ${isAlert ? 'sm:w-[60vw]':'sm:w-[80vw]'}  bg-white rounded-lg shadow-xl overflow-hidden ${isAlert ? ' ':'min-h-[90vh]'}`}>
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-border-light">
              <h3 className="text-xl font-semibold text-text-primary">
                {title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-text-secondary hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {children}
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Modal;