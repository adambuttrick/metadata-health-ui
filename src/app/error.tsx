'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/typography/typography';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <Text variant="h2" className="font-bold">Something went wrong!</Text>
      <Button
        onClick={() => reset()}
        variant="outline"
      >
        Try again
      </Button>
    </div>
  );
}
