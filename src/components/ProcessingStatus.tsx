import { Loader2, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProcessingStatusProps {
  operation: 'compress' | 'decompress';
  progress: number;
  className?: string;
}

export function ProcessingStatus({ operation, progress, className }: ProcessingStatusProps) {
  const isCompression = operation === 'compress';
  
  return (
    <Card className={cn("w-full max-w-2xl mx-auto animate-pulse-glow", className)}>
      <CardContent className="p-8 text-center space-y-6">
        <div className="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-primary-light/20 animate-spin">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold">
            {isCompression ? 'Compressing' : 'Decompressing'} File...
          </h3>
          <p className="text-muted-foreground">
            {isCompression 
              ? 'Applying Huffman coding algorithm to reduce file size'
              : 'Restoring your file to its original state'
            }
          </p>
        </div>

        <div className="space-y-3">
          <Progress value={progress} className="w-full h-3" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>{progress}% Complete</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground max-w-md mx-auto">
          {isCompression 
            ? 'Building frequency tables and generating optimal binary codes...'
            : 'Parsing compression tree and reconstructing original data...'
          }
        </div>
      </CardContent>
    </Card>
  );
}