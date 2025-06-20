import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Book, Users, Eye, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AuthorWithStats } from "@shared/schema";
import { formatNumber, formatRating, getGenreColor } from "@/lib/utils";

export default function Author() {
  const { id } = useParams<{ id: string }>();
  const authorId = parseInt(id!);

  const { data: author, isLoading } = useQuery<AuthorWithStats>({
    queryKey: ["/api/authors", authorId],
    queryFn: async () => {
      const response = await fetch(`/api/authors/${authorId}`);
      if (!response.ok) throw new Error("Failed to fetch author");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wattpad-orange"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Author not found</h1>
          <Link href="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden mb-8">
          <CardContent className="p-0">
            {/* Profile Header */}
            <div className="relative">
              <img
                src={author.coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300"}
                alt="Author profile background"
                className="w-full h-32 sm:h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            
            <div className="relative px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 sm:-mt-20">
                {/* Profile Picture */}
                <div className="relative z-10 mb-4 sm:mb-0">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white">
                    <AvatarImage src={author.avatar || ""} alt={author.displayName} />
                    <AvatarFallback className="text-2xl">{author.displayName[0]}</AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 sm:ml-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {author.displayName}
                  </h1>
                  <p className="text-gray-600 mb-4">@{author.username}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Book className="w-4 h-4 mr-2 text-wattpad-orange" />
                      <span>{author.stories.length} Stories</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-wattpad-orange" />
                      <span>{formatNumber(author.followerCount)} Followers</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-wattpad-orange" />
                      <span>{formatNumber(author.totalReads)} Total Reads</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-wattpad-orange" />
                      <span>
                        {author.stories.length > 0 
                          ? formatRating(author.stories.reduce((acc, story) => acc + story.rating, 0) / author.stories.length)
                          : "0.0"
                        } Avg Rating
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button className="bg-wattpad-orange text-white hover:bg-wattpad-orange-dark">
                    Follow
                  </Button>
                  <Button variant="outline" className="hover:border-wattpad-orange hover:text-wattpad-orange">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
              
              {/* Bio */}
              {author.bio && (
                <div className="mt-6 p-4 bg-white rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {author.bio}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Published Stories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Published Stories</h2>
          
          {author.stories.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                <p className="text-gray-600">This author hasn't published any stories yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {author.stories.map((story) => (
                <Card key={story.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <Link href={`/story/${story.id}`}>
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <img
                          src={story.coverImage || "/api/placeholder/80/120"}
                          alt={`${story.title} cover`}
                          className="w-16 h-24 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-2 hover:text-wattpad-orange transition-colors">
                            {story.title}
                          </h3>
                          {story.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {story.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                              <span>{formatRating(story.rating)}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              <span>{formatNumber(story.viewCount)} reads</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={getGenreColor(story.genre)}>
                              {story.genre}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {story.chapterCount} chapters
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
