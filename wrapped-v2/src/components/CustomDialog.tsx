import React from 'react';
import CustomModal from './CustomModal';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'OK'
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mb-6 text-gray-200">
        {message}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-opacity-90 text-sm font-medium transition-colors"
        >
          {confirmText}
        </button>
      </div>
    </CustomModal>
  );
};

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mb-6 text-gray-200">
        {message}
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 text-sm font-medium transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 text-white rounded-md text-sm font-medium transition-colors ${
            isDangerous 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-theme-primary hover:bg-opacity-90'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </CustomModal>
  );
};
