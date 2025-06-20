import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Eye, Star, Bookmark, Share2, Clock, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StoryWithAuthor } from "@shared/schema";
import { formatNumber, formatRating, getGenreColor } from "@/lib/utils";

export default function Story() {
  const { id } = useParams<{ id: string }>();
  const storyId = parseInt(id!);

  const { data: story, isLoading } = useQuery<StoryWithAuthor>({
    queryKey: ["/api/stories", storyId],
    queryFn: async () => {
      const response = await fetch(`/api/stories/${storyId}`);
      if (!response.ok) throw new Error("Failed to fetch story");
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

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Story not found</h1>
          <Link href="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Cover Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={story.coverImage || "/api/placeholder/200/300"}
                      alt={`${story.title} cover`}
                      className="w-48 h-72 object-cover rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>

                  {/* Story Info */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <Badge className={getGenreColor(story.genre)}>
                        {story.genre}
                      </Badge>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {story.title}
                    </h1>

                    <div className="flex items-center mb-4">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={story.author.avatar || ""} alt={story.author.displayName} />
                        <AvatarFallback>{story.author.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          <Link href={`/author/${story.author.id}`}>
                            <span className="hover:text-wattpad-orange transition-colors">
                              {story.author.displayName}
                            </span>
                          </Link>
                        </p>
                        <p className="text-sm text-gray-600">@{story.author.username}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-yellow-400 mb-1">
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                        <p className="text-sm font-medium">{formatRating(story.rating)}</p>
                        <p className="text-xs text-gray-600">{formatNumber(story.ratingCount)} votes</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-blue-500 mb-1">
                          <Eye className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium">{formatNumber(story.viewCount)}</p>
                        <p className="text-xs text-gray-600">reads</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-green-500 mb-1">
                          <Book className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium">{story.chapterCount}</p>
                        <p className="text-xs text-gray-600">chapters</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-purple-500 mb-1">
                          <Clock className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium">{story.isCompleted ? 'Complete' : 'Ongoing'}</p>
                        <p className="text-xs text-gray-600">status</p>
                      </div>
                    </div>

                    {story.description && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{story.description}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button 
                        className="bg-wattpad-orange text-white hover:bg-wattpad-orange-dark"
                        asChild
                      >
                        <Link href={`/read/${story.id}/1`}>Start Reading</Link>
                      </Button>
                      <Button variant="outline">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Add to Library
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chapters */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Chapters</h3>
                <div className="space-y-2">
                  {story.chapters?.slice(0, 5).map((chapter) => (
                    <Link key={chapter.id} href={`/read/${story.id}/${chapter.chapterNumber}`}>
                      <div className="p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="font-medium text-sm">{chapter.title}</p>
                        <p className="text-xs text-gray-600">
                          {formatNumber(chapter.wordCount)} words
                        </p>
                      </div>
                    </Link>
                  ))}
                  {story.chapterCount > 5 && (
                    <Link href={`/story/${story.id}/chapters`}>
                      <Button variant="link" className="text-wattpad-orange p-0">
                        View all {story.chapterCount} chapters
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">About the Author</h3>
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarImage src={story.author.avatar || ""} alt={story.author.displayName} />
                    <AvatarFallback className="text-lg">{story.author.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-medium text-gray-900 mb-1">{story.author.displayName}</h4>
                  <p className="text-sm text-gray-600 mb-3">@{story.author.username}</p>
                  {story.author.bio && (
                    <p className="text-sm text-gray-700 mb-4">{story.author.bio}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-center mb-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{formatNumber(story.author.followerCount)}</p>
                      <p className="text-xs text-gray-600">Followers</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{formatNumber(story.author.totalReads)}</p>
                      <p className="text-xs text-gray-600">Total Reads</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Follow Author
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
