import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import StoryCard from "@/components/story-card";
import GenreFilter from "@/components/genre-filter";
import { StoryWithAuthor } from "@shared/schema";

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: featuredStories = [], isLoading: featuredLoading } = useQuery<StoryWithAuthor[]>({
    queryKey: ["/api/stories/featured"],
  });

  const { data: trendingStories = [], isLoading: trendingLoading } = useQuery<StoryWithAuthor[]>({
    queryKey: ["/api/stories/trending"],
  });

  const { data: stories = [], isLoading: storiesLoading } = useQuery<StoryWithAuthor[]>({
    queryKey: ["/api/stories", selectedGenre],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedGenre) params.append("genre", selectedGenre);
      params.append("limit", "20");
      
      const response = await fetch(`/api/stories?${params}`);
      if (!response.ok) throw new Error("Failed to fetch stories");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-wattpad-orange to-orange-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Where Stories Live
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Discover millions of stories and share your own. Connect with readers and writers from around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-wattpad-orange hover:bg-gray-100 font-semibold"
                asChild
              >
                <Link href="/browse">Start Reading</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-wattpad-orange font-semibold"
                asChild
              >
                <Link href="/write">Start Writing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Genre Filter */}
      <GenreFilter selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />

      {/* Featured Stories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
            <Button variant="link" className="text-wattpad-orange font-medium hover:text-wattpad-orange-dark">
              See All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="w-full h-48 sm:h-56 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {featuredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Stories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-wattpad-orange mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <Button variant="link" className="text-wattpad-orange font-medium hover:text-wattpad-orange-dark">
              View All
            </Button>
          </div>
          
          {trendingLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg shadow-sm animate-pulse">
                  <div className="flex">
                    <div className="w-20 h-28 bg-gray-200"></div>
                    <div className="flex-1 p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingStories.slice(0, 3).map((story, index) => (
                <div key={story.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <Link href={`/story/${story.id}`}>
                    <div className="flex">
                      <img
                        src={story.coverImage || "/api/placeholder/120/160"}
                        alt={`${story.title} cover`}
                        className="w-20 h-28 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {story.title}
                          </h3>
                          <div className="flex items-center text-xs text-wattpad-orange ml-2">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span className="font-medium">#{index + 1}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">by {story.author.displayName}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{(story.rating / 10).toFixed(1)}</span>
                          </div>
                          <div className="flex items-center">
                            <span>{(story.viewCount / 1000000).toFixed(1)}M reads</span>
                          </div>
                        </div>
                        <div className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${
                          story.genre === 'Fantasy' ? 'bg-purple-100 text-purple-800' :
                          story.genre === 'Romance' ? 'bg-pink-100 text-pink-800' :
                          story.genre === 'Mystery' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {story.genre}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Stories */}
      {selectedGenre && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{selectedGenre} Stories</h2>
            
            {storiesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                    <div className="w-full h-48 sm:h-56 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
