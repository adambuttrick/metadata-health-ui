import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { House } from 'lucide-react';
import { Text } from '@/components/typography/typography';

export default function NotFound() {
  return (
    <div data-testid="not-found-container">
      <div data-testid="not-found-content" className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <div data-testid="not-found-text" className="space-y-2">
          <Text variant="h1" className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary">404</Text>
          <Text variant="h2" className="text-2xl font-semibold tracking-tight">Page Not Found</Text>
          <Text variant="body" className="text-muted-foreground">Sorry, we couldn&apos;t find the page you&apos;re looking for.</Text>
        </div>
        <Link href="/" passHref>
          <Button variant="default" className="gap-2">
            <House className="h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
