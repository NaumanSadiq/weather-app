import { useState } from "react";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCurrentLocation: () => void;
  loading?: boolean;
}

export default function SearchBar({
  onSearch,
  onCurrentLocation,
  loading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-3 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onCurrentLocation}
          disabled={loading}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-3 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
