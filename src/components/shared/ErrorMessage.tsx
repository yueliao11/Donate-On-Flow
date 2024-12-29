import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 rounded-md">
    <AlertCircle size={20} />
    <span>{message}</span>
  </div>
);