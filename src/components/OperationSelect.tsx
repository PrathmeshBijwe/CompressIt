import { Archive, Expand, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OperationSelectProps {
  onSelectOperation: (operation: 'compress' | 'decompress') => void;
  file: File;
  className?: string;
}

export function OperationSelect({ onSelectOperation, file, className }: OperationSelectProps) {
  const showWarning = file.size === 0 || file.size <= 350;
  const showInfo = file.size > 350 && file.size < 1000;

  return (
    <Card className={cn("w-full max-w-2xl mx-auto animate-float", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Operation</CardTitle>
        <p className="text-muted-foreground">
          What would you like to do with <strong>{file.name}</strong>?
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {(showWarning || showInfo) && (
          <div className={cn(
            "flex items-start gap-3 p-4 rounded-lg border",
            showWarning ? "bg-warning/10 border-warning/20" : "bg-primary/10 border-primary/20"
          )}>
            <Info className={cn(
              "w-5 h-5 mt-0.5 shrink-0",
              showWarning ? "text-warning" : "text-primary"
            )} />
            <div className="space-y-1">
              <p className={cn(
                "text-sm font-medium",
                showWarning ? "text-warning-foreground" : "text-primary"
              )}>
                File Size Notice
              </p>
              <p className="text-sm text-muted-foreground">
                {showWarning 
                  ? `Your file is ${file.size === 0 ? 'empty' : 'very small'} (${file.size} bytes). The compressed file might be larger than the original due to the overhead of storing the compression tree.`
                  : `Your file is relatively small (${file.size} bytes). Compression efficiency is typically better with larger files that contain more repetitive patterns.`
                }
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group bg-gradient-to-br from-primary-light/10 to-primary-light/5 border-primary/20 hover:border-primary">
            <CardContent className="p-6" onClick={() => onSelectOperation('compress')}>
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary-light/20 group-hover:bg-primary/20 transition-colors">
                  <Archive className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Compress File</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce file size using Huffman coding algorithm
                  </p>
                </div>
                <Button variant="hero" size="lg" className="w-full">
                  <Archive className="w-4 h-4 mr-2" />
                  Start Compression
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group bg-gradient-to-br from-accent-light/10 to-accent-light/5 border-accent/20 hover:border-accent">
            <CardContent className="p-6" onClick={() => onSelectOperation('decompress')}>
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-accent-light/20 group-hover:bg-accent/20 transition-colors">
                  <Expand className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-accent">Decompress File</h3>
                  <p className="text-sm text-muted-foreground">
                    Restore compressed file to its original form
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Expand className="w-4 h-4 mr-2" />
                  Start Decompression
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}