'use client';
import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import { useSearch } from '@/components/search-provider';
import AetheriaLogo from '@/components/aetheria-logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <AetheriaLogo />
          </Link>
          <nav className="hidden items-center space-x-1 md:flex">
             <Link href="/" passHref>
                <Button variant="ghost" className={cn(pathname === '/' && 'bg-accent/50 text-accent-foreground')}>
                    Gallery
                </Button>
            </Link>
            <Link href="/favorites" passHref>
                <Button variant="ghost" className={cn(pathname === '/favorites' && 'bg-accent/50 text-accent-foreground')}>
                    Favorites
                </Button>
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search prompts..."
                className="pl-9 w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
