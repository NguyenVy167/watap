import { Link } from "wouter";
import { Eye, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StoryWithAuthor } from "@shared/schema";
import { formatNumber, formatRating, getGenreColor } from "@/lib/utils";

interface StoryCardProps {
  story: StoryWithAuthor;
  className?: string;
}

export default function StoryCard({ story, className = "" }: StoryCardProps) {
  return (
    <Link href={`/story/${story.id}`}>
      <Card className={`cursor-pointer group hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={story.coverImage || "/api/placeholder/300/400"}
              alt={`${story.title} cover`}
              className="w-full h-48 sm:h-56 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-wattpad-orange transition-colors">
              {story.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">by {story.author.displayName}</p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-yellow-400">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs text-gray-600 ml-1">
                  {formatRating(story.rating)}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <Eye className="w-3 h-3" />
                <span className="text-xs ml-1">{formatNumber(story.viewCount)}</span>
              </div>
            </div>
            <Badge className={getGenreColor(story.genre)}>
              {story.genre}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
