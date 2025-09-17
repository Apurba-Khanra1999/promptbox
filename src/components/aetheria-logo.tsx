import { Aperture } from 'lucide-react';

export default function AetheriaLogo() {
  return (
    <div className="flex items-center gap-2">
      <Aperture className="h-7 w-7 text-primary" />
      <span className="text-2xl font-bold tracking-tighter text-foreground">
        Aetheria
      </span>
    </div>
  );
}
