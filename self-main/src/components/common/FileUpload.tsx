import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string; // e.g. ".pdf,.jpg,.jpeg,.png"
  maxSizeMB?: number;
  onFileSelect: (file: File | null) => void;
  error?: string;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  onFileSelect,
  error,
  required = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateAndProcessFile = (file: File) => {
    setLocalError(null);
    
    // Check file size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setLocalError(`File size exceeds the limit of ${maxSizeMB}MB.`);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    // Check file extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = accept.split(',').map(t => t.trim().toLowerCase());
    
    if (!acceptedTypes.includes(ext) && !acceptedTypes.includes('*')) {
      setLocalError(`Invalid file format. Accepted formats: ${accept}`);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    // Success - Simulate upload progress
    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileSelect(file);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setLocalError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = error || localError;

  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-sm font-medium text-gov-charcoal flex items-center gap-0.5">
        {label}
        {required && <span className="text-gov-error" aria-hidden="true">*</span>}
      </span>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-white ${
          displayError
            ? 'border-gov-error bg-red-50/20'
            : selectedFile
            ? 'border-gov-success bg-green-50/10'
            : 'border-gov-border hover:border-gov-navy hover:bg-gov-bg-alt'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-2.5 bg-gov-bg-alt rounded-full text-gov-muted border border-gov-border">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gov-charcoal">
              Drag & Drop file here, or <span className="text-gov-navy underline">Browse</span>
            </p>
            <p className="text-xs text-gov-muted">
              Supported: {accept.toUpperCase()} (Max: {maxSizeMB}MB)
            </p>
          </div>
        ) : (
          <div className="w-full flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="p-2 bg-gov-navy-light text-gov-navy rounded-md">
              <File className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gov-charcoal truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gov-muted">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>

              {/* Progress Bar */}
              {isUploading && (
                <div className="w-full bg-gov-border rounded-full h-1.5 mt-2">
                  <div
                    className="bg-gov-navy h-1.5 rounded-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {!isUploading && uploadProgress === 100 && (
                <div className="flex items-center gap-1 mt-1 text-gov-success">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Uploaded Successfully</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={removeFile}
              className="p-2 text-gov-muted hover:text-gov-error hover:bg-gov-bg-alt rounded-md transition-colors"
              aria-label="Remove uploaded file"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {displayError && (
        <span className="text-xs text-gov-error font-medium flex items-center gap-1 mt-1" role="alert">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </span>
      )}
    </div>
  );
};
