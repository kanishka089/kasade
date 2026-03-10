import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Heart className="h-4 w-4 text-primary-500" fill="currentColor" />
            <span>&copy; {new Date().getFullYear()} Kasade.lk. All rights reserved.</span>
          </div>
          <p className="text-xs text-gray-400">
            Find your perfect match with Vedic horoscope compatibility
          </p>
        </div>
      </div>
    </footer>
  );
}
