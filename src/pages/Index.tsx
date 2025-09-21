import { useState, useCallback } from 'react';
import { FileText, Zap, Github, Archive } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { OperationSelect } from '@/components/OperationSelect';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { CompressionResultDisplay } from '@/components/CompressionResult';
import { Button } from '@/components/ui/button';
import { HuffmanCodec, CompressionResult, downloadFile } from '@/lib/huffman';
import { useToast } from '@/hooks/use-toast';

type AppState = 'upload' | 'select' | 'processing' | 'result';

const Index = () => {
  const [state, setState] = useState<AppState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [operation, setOperation] = useState<'compress' | 'decompress' | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const { toast } = useToast();

  const codec = new HuffmanCodec();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setState('select');
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setState('upload');
  }, []);

  const handleOperationSelect = useCallback(async (selectedOperation: 'compress' | 'decompress') => {
    if (!selectedFile) return;

    setOperation(selectedOperation);
    setState('processing');
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        try {
          let compressionResult: CompressionResult;
          
          if (selectedOperation === 'compress') {
            compressionResult = codec.encode(text);
          } else {
            compressionResult = codec.decode(text);
          }
          
          setProgress(100);
          setTimeout(() => {
            setResult(compressionResult);
            setState('result');
            toast({
              title: "Success!",
              description: `File ${selectedOperation}ed successfully`,
            });
          }, 500);
        } catch (error) {
          console.error('Processing error:', error);
          toast({
            title: "Error",
            description: selectedOperation === 'decompress' 
              ? "Invalid compressed file format. Please upload a valid compressed file."
              : "Failed to process file. Please try again.",
            variant: "destructive",
          });
          setState('select');
        }
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      console.error('File reading error:', error);
      toast({
        title: "Error",
        description: "Failed to read file. Please try again.",
        variant: "destructive",
      });
      setState('select');
    }

    clearInterval(progressInterval);
  }, [selectedFile, codec, toast]);

  const handleDownload = useCallback(() => {
    if (!result || !selectedFile || !operation) return;

    const filename = selectedFile.name.replace('.txt', '');
    const extension = operation === 'compress' ? '_compressed.txt' : '_decompressed.txt';
    downloadFile(filename + extension, result.data);
    
    toast({
      title: "Downloaded!",
      description: `File saved as ${filename + extension}`,
    });
  }, [result, selectedFile, operation, toast]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setOperation(null);
    setResult(null);
    setProgress(0);
    setState('upload');
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CompressIt
                </h1>
                <p className="text-sm text-muted-foreground">Huffman Compression Tool</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                Source Code
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        {state === 'upload' && (
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                  Compress Your Files
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Experience the power of Huffman coding algorithm for efficient, lossless file compression
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-to-br from-primary-light/10 to-primary-light/5">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary-light/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Lossless Compression</h3>
                <p className="text-sm text-muted-foreground">
                  Reduce file size without losing any data integrity
                </p>
              </div>
              
              <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-to-br from-accent-light/10 to-accent-light/5">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-accent-light/20">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold">Huffman Algorithm</h3>
                <p className="text-sm text-muted-foreground">
                  Industry-standard compression using optimal binary codes
                </p>
              </div>
              
              <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-to-br from-success-light/10 to-success-light/5">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-success-light/20">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold">Easy to Use</h3>
                <p className="text-sm text-muted-foreground">
                  Simple drag-and-drop interface for quick compression
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Upload */}
        {state === 'upload' && (
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClearFile={handleClearFile}
            className="max-w-2xl mx-auto"
          />
        )}

        {/* Operation Selection */}
        {state === 'select' && selectedFile && (
          <OperationSelect
            onSelectOperation={handleOperationSelect}
            file={selectedFile}
          />
        )}

        {/* Processing Status */}
        {state === 'processing' && operation && (
          <ProcessingStatus
            operation={operation}
            progress={progress}
          />
        )}

        {/* Results */}
        {state === 'result' && result && operation && (
          <CompressionResultDisplay
            result={result}
            operation={operation}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent"></div>
              <span className="font-semibold">CompressIt</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Huffman Algorithm • Powered by React & TypeScript
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 CompressIt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
