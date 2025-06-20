import { Button } from "@/components/ui/button";

interface GenreFilterProps {
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
}

const genres = [
  "Fantasy",
  "Romance", 
  "Mystery",
  "Teen Fiction",
  "Science Fiction",
  "Horror",
  "Adventure"
];

export default function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
  return (
    <section className="bg-white py-6 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Browse by Genre</h2>
          <Button 
            variant="link" 
            className="text-wattpad-orange hover:text-wattpad-orange-dark"
            onClick={() => onGenreChange(null)}
          >
            View All
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => onGenreChange(selectedGenre === genre ? null : genre)}
              className={
                selectedGenre === genre
                  ? "bg-wattpad-orange text-white hover:bg-wattpad-orange-dark"
                  : "border-gray-300 text-gray-700 hover:bg-wattpad-orange hover:text-white hover:border-wattpad-orange"
              }
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
