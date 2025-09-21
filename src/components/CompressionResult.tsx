import { CheckCircle, Download, BarChart3, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompressionResult } from '@/lib/huffman';
import doneImage from '@/assets/done.jpeg';

interface CompressionResultProps {
  result: CompressionResult;
  operation: 'compress' | 'decompress';
  onDownload: () => void;
  onReset: () => void;
}

export function CompressionResultDisplay({ 
  result, 
  operation, 
  onDownload, 
  onReset 
}: CompressionResultProps) {
  const isCompression = operation === 'compress';
  
  const getCompressionEfficiency = (ratio: number): string => {
    if (ratio > 2) return 'Excellent';
    if (ratio > 1.5) return 'Good';
    if (ratio > 1.1) return 'Fair';
    return 'Limited';
  };

  const getEfficiencyColor = (ratio: number): string => {
    if (ratio > 2) return 'success';
    if (ratio > 1.5) return 'primary';
    if (ratio > 1.1) return 'warning';
    return 'destructive';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-pulse-glow">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-success-light/20 animate-float">
          <img 
            src={doneImage} 
            alt="Success" 
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-success" />
            <CardTitle className="text-2xl text-success">
              {isCompression ? 'Compression' : 'Decompression'} Complete!
            </CardTitle>
          </div>
          <p className="text-muted-foreground">{result.message}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isCompression && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center bg-gradient-to-br from-primary-light/10 to-primary-light/5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Compression Ratio</span>
              </div>
              <div className="text-2xl font-bold">{result.compressionRatio.toFixed(2)}x</div>
              <Badge 
                variant="outline" 
                className={`mt-1 border-${getEfficiencyColor(result.compressionRatio)}`}
              >
                {getCompressionEfficiency(result.compressionRatio)}
              </Badge>
            </Card>

            <Card className="p-4 text-center bg-gradient-to-br from-accent-light/10 to-accent-light/5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-accent">Original Size</span>
              </div>
              <div className="text-2xl font-bold">{result.originalSize}</div>
              <div className="text-sm text-muted-foreground">bytes</div>
            </Card>

            <Card className="p-4 text-center bg-gradient-to-br from-success-light/10 to-success-light/5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-success">Compressed Size</span>
              </div>
              <div className="text-2xl font-bold">{result.compressedSize}</div>
              <div className="text-sm text-muted-foreground">bytes</div>
            </Card>
          </div>
        )}

        {!isCompression && (
          <div className="text-center p-6 bg-gradient-to-br from-success-light/10 to-success-light/5 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-success" />
              <span className="text-lg font-medium text-success">File Restored</span>
            </div>
            <div className="text-2xl font-bold">{result.originalSize} bytes</div>
            <p className="text-sm text-muted-foreground mt-2">
              Your file has been successfully decompressed to its original state
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            variant="success" 
            size="lg" 
            onClick={onDownload}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download {isCompression ? 'Compressed' : 'Decompressed'} File
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onReset}
            className="flex-1"
          >
            Process Another File
          </Button>
        </div>

        {isCompression && result.compressionRatio <= 1.1 && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning-foreground">
              <strong>Note:</strong> The compression ratio is low. This typically happens with small files 
              or files with little repetitive content. Larger files with repeated patterns compress better.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}