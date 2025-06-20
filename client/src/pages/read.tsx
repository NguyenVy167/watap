import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ChevronLeft, ChevronRight, Bookmark, Share2, Settings, Eye, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StoryWithAuthor, Chapter } from "@shared/schema";
import { calculateReadingTime } from "@/lib/utils";

export default function Read() {
  const { storyId, chapterNumber = "1" } = useParams<{ storyId: string; chapterNumber?: string }>();
  const storyIdNum = parseInt(storyId!);
  const chapterNum = parseInt(chapterNumber);

  const { data: story, isLoading: storyLoading } = useQuery<StoryWithAuthor>({
    queryKey: ["/api/stories", storyIdNum],
    queryFn: async () => {
      const response = await fetch(`/api/stories/${storyIdNum}`);
      if (!response.ok) throw new Error("Failed to fetch story");
      return response.json();
    },
  });

  const { data: chapter, isLoading: chapterLoading } = useQuery<Chapter>({
    queryKey: ["/api/stories", storyIdNum, "chapters", chapterNum],
    queryFn: async () => {
      const response = await fetch(`/api/stories/${storyIdNum}/chapters/${chapterNum}`);
      if (!response.ok) throw new Error("Failed to fetch chapter");
      return response.json();
    },
  });

  const { data: allChapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/stories", storyIdNum, "chapters"],
    queryFn: async () => {
      const response = await fetch(`/api/stories/${storyIdNum}/chapters`);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      return response.json();
    },
  });

  if (storyLoading || chapterLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wattpad-orange"></div>
      </div>
    );
  }

  if (!story || !chapter) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chapter not found</h1>
          <Link href="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentChapterIndex = allChapters.findIndex(ch => ch.chapterNumber === chapterNum);
  const progress = ((currentChapterIndex + 1) / allChapters.length) * 100;
  const hasNextChapter = currentChapterIndex < allChapters.length - 1;
  const hasPrevChapter = currentChapterIndex > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Story Header */}
            <div className="flex items-start space-x-4 mb-6 pb-6 border-b">
              <img
                src={story.coverImage || "/api/placeholder/80/120"}
                alt={`${story.title} cover`}
                className="w-16 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{story.title}</h3>
                <p className="text-gray-600 mb-2">by {story.author.displayName}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Chapter {chapter.chapterNumber} of {story.chapterCount}</span>
                  <span>•</span>
                  <span>{calculateReadingTime(chapter.wordCount)}</span>
                  <span>•</span>
                  <span>{story.genre}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-wattpad-orange">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-wattpad-orange">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-wattpad-orange">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                disabled={!hasPrevChapter}
                asChild={hasPrevChapter}
                className="text-wattpad-orange hover:text-wattpad-orange-dark disabled:text-gray-400"
              >
                {hasPrevChapter ? (
                  <Link href={`/read/${storyIdNum}/${allChapters[currentChapterIndex - 1].chapterNumber}`}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Chapter
                  </Link>
                ) : (
                  <span>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Chapter
                  </span>
                )}
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Progress:</span>
                <Progress value={progress} className="w-32" />
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              
              <Button 
                variant="ghost" 
                disabled={!hasNextChapter}
                asChild={hasNextChapter}
                className="text-wattpad-orange hover:text-wattpad-orange-dark disabled:text-gray-400"
              >
                {hasNextChapter ? (
                  <Link href={`/read/${storyIdNum}/${allChapters[currentChapterIndex + 1].chapterNumber}`}>
                    Next Chapter
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                ) : (
                  <span>
                    Next Chapter
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </span>
                )}
              </Button>
            </div>

            {/* Chapter Content */}
            <div className="prose prose-lg max-w-none">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{chapter.title}</h1>
              <div className="text-gray-800 leading-relaxed space-y-4">
                {chapter.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Chapter End Actions */}
            <div className="mt-8 pt-6 border-t flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-gray-600 hover:text-red-500">
                  <Heart className="w-4 h-4 mr-2" />
                  <span>324</span>
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-blue-500">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>89</span>
                </Button>
              </div>
              {hasNextChapter && (
                <Button 
                  className="bg-wattpad-orange text-white hover:bg-wattpad-orange-dark"
                  asChild
                >
                  <Link href={`/read/${storyIdNum}/${allChapters[currentChapterIndex + 1].chapterNumber}`}>
                    Continue Reading
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Author Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={story.author.avatar || ""} alt={story.author.displayName} />
                <AvatarFallback>{story.author.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{story.author.displayName}</h4>
                <p className="text-sm text-gray-600">
                  {story.author.bio || `Author of ${story.title}`}
                </p>
              </div>
              <Button 
                variant="outline" 
                asChild
                className="hover:border-wattpad-orange hover:text-wattpad-orange"
              >
                <Link href={`/author/${story.author.id}`}>View Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
