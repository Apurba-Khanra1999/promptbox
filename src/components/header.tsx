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
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/95 backdrop-blur-xl">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-6">
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

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="relative w-full max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prompts..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/" passHref className="md:hidden">
            <Button variant="ghost" size="icon" className={cn(pathname === '/' && 'bg-accent/50 text-accent-foreground')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><rect width="6" height="6" x="9" y="9" rx="1"></rect><path d="M3 15h18"></path><path d="M15 3v18"></path></svg>
                <span className="sr-only">Gallery</span>
            </Button>
          </Link>
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
