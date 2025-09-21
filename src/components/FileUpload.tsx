import { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  className?: string;
}

export function FileUpload({ onFileSelect, selectedFile, onClearFile, className }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        onFileSelect(file);
      } else {
        alert('Please upload a .txt file only');
      }
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        onFileSelect(file);
      } else {
        alert('Please upload a .txt file only');
        e.target.value = '';
      }
    }
  }, [onFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card 
      className={cn(
        "relative border-2 border-dashed transition-all duration-300 hover:shadow-lg",
        isDragActive ? "border-primary bg-primary-light/20 scale-105" : "border-muted-foreground/25",
        selectedFile ? "border-success bg-success-light/10" : "",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="p-8 text-center">
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-success-light/20 animate-float">
              <File className="w-8 h-8 text-success" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-success">File Selected</h3>
              <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                Size: {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFile}
              className="mt-4"
            >
              <X className="w-4 h-4 mr-2" />
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={cn(
              "flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary-light/20 transition-all duration-300",
              isDragActive ? "scale-110 bg-primary/30" : "animate-float"
            )}>
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Text File</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your .txt file here, or click to browse
              </p>
            </div>
            <div className="pt-4">
              <input
                type="file"
                accept=".txt,text/plain"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="hero" size="lg" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}