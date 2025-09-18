import { Box } from 'lucide-react';

export default function PromptBoxLogo() {
  return (
    <div className="flex items-center gap-2">
      <Box className="h-7 w-7 text-primary" />
      <span className="text-2xl font-bold tracking-tighter text-foreground">
        PromptBox
      </span>
    </div>
  );
}
