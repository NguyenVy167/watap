import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder="Search stories, authors..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-wattpad-orange"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
    </form>
  );
}
