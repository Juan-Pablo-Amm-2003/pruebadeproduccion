import React, { useState, useRef } from 'react';
import { Upload, File } from 'lucide-react';
import { taskAPI } from '../services/api';
import { ProcessExcelResponse } from '../types/task';

interface FileUploadProps {
  onSuccess: (result: ProcessExcelResponse) => void;
  onError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onSuccess, onError }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
      onError('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError('El archivo es demasiado grande. Máximo 10MB permitido.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await taskAPI.procesarExcel(file);
      onSuccess(result);
    } catch (error) {
      console.error('Upload error:', error);
      onError('Error al procesar el archivo. Por favor intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Cargar Archivo Excel</h3>

      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200
        ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragOver={handleDrag}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-lg font-medium text-gray-900">Procesando archivo...</p>
              <p className="text-sm text-gray-500">Esto puede tomar unos momentos</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-lg font-medium text-gray-800 mb-1">
                Arrastrá tu archivo Excel aquí
              </p>
              <p className="text-sm text-gray-500 mb-2">
                o hacé clic para seleccionarlo
              </p>
              <p className="text-xs text-gray-400">
                Formatos: .xlsx, .xls &middot; Máx: 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <File className="w-4 h-4 mt-0.5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};
