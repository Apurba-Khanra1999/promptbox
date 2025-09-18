'use client';
import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import { useSearch } from '@/components/search-provider';
import PromptBoxLogo from '@/components/aetheria-logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <PromptBoxLogo />
          </Link>
          <nav className="hidden items-center space-x-1 md:flex">
             <Link href="/" passHref>
                <Button variant="ghost" className={cn("font-medium", pathname === '/' && 'bg-accent/50 text-accent-foreground')}>
                    Gallery
                </Button>
            </Link>
            <Link href="/favorites" passHref>
                <Button variant="ghost" className={cn("font-medium", pathname === '/favorites' && 'bg-accent/50 text-accent-foreground')}>
                    Favorites
                </Button>
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 md:flex-none">
          <div className="relative w-full max-w-xs sm:max-w-sm md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prompts..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/favorites" passHref className="md:hidden">
            <Button variant="ghost" size="icon" className={cn(pathname === '/favorites' && 'bg-accent/50 text-accent-foreground')}>
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
