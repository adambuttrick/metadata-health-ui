'use client';

import { Text } from '../typography/typography';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-center">
          <Text 
            variant="small"
            className="text-[#34495e] text-center"
          >
            Data file version: 2025-01-16
          </Text>
        </div>
      </div>
    </footer>
  );
}