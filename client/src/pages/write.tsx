import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Save, Upload, Plus, Edit, Trash2, Eye, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Quote, Link as LinkIcon, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Story, Chapter, InsertStory, InsertChapter } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const genres = [
  "Fantasy", "Romance", "Mystery", "Teen Fiction", 
  "Science Fiction", "Horror", "Adventure"
];

export default function Write() {
  const { storyId } = useParams<{ storyId?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const isEditing = !!storyId;
  const storyIdNum = storyId ? parseInt(storyId) : undefined;

  // Fetch story if editing
  const { data: story, isLoading: storyLoading } = useQuery<Story>({
    queryKey: ["/api/stories", storyIdNum],
    queryFn: async () => {
      const response = await fetch(`/api/stories/${storyIdNum}`);
      if (!response.ok) throw new Error("Failed to fetch story");
      return response.json();
    },
    enabled: isEditing,
  });

  // Fetch chapters if editing
  const { data: chapters = [], isLoading: chaptersLoading } = useQuery<Chapter[]>({
    queryKey: ["/api/stories", storyIdNum, "chapters"],
    queryFn: async () => {
      const response = await fetch(`/api/stories/${storyIdNum}/chapters`);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      return response.json();
    },
    enabled: isEditing,
  });

  // Create story mutation
  const createStoryMutation = useMutation({
    mutationFn: async (data: InsertStory) => {
      const response = await apiRequest("POST", "/api/stories", data);
      return response.json();
    },
    onSuccess: (newStory) => {
      toast({ title: "Story created successfully!" });
      setLocation(`/write/${newStory.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
    },
    onError: () => {
      toast({ title: "Failed to create story", variant: "destructive" });
    },
  });

  // Update story mutation
  const updateStoryMutation = useMutation({
    mutationFn: async (data: Partial<InsertStory>) => {
      const response = await apiRequest("PUT", `/api/stories/${storyIdNum}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Story updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/stories", storyIdNum] });
    },
    onError: () => {
      toast({ title: "Failed to update story", variant: "destructive" });
    },
  });

  // Create chapter mutation
  const createChapterMutation = useMutation({
    mutationFn: async (data: InsertChapter) => {
      const response = await apiRequest("POST", `/api/stories/${storyIdNum}/chapters`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Chapter created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/stories", storyIdNum, "chapters"] });
      setChapterTitle("");
      setChapterContent("");
    },
    onError: () => {
      toast({ title: "Failed to create chapter", variant: "destructive" });
    },
  });

  // Update chapter mutation
  const updateChapterMutation = useMutation({
    mutationFn: async ({ id, data }: { id:number, data: Partial<InsertChapter> }) => {
      const response = await apiRequest("PUT", `/api/chapters/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Chapter updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/stories", storyIdNum, "chapters"] });
    },
    onError: () => {
      toast({ title: "Failed to update chapter", variant: "destructive" });
    },
  });

  // Load story data when editing
  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setDescription(story.description || "");
      setGenre(story.genre);
      setCoverImage(story.coverImage || "");
      setIsPublished(story.isPublished);
    }
  }, [story]);

  // Load chapter data when selecting a chapter
  useEffect(() => {
    if (selectedChapter !== null) {
      const chapter = chapters.find(ch => ch.id === selectedChapter);
      if (chapter) {
        setChapterTitle(chapter.title);
        setChapterContent(chapter.content);
      }
    }
  }, [selectedChapter, chapters]);

  const handleSaveStory = () => {
    if (!title.trim() || !genre) {
      toast({ title: "Please fill in title and genre", variant: "destructive" });
      return;
    }

    const storyData: InsertStory = {
      title: title.trim(),
      description: description.trim() || undefined,
      genre,
      coverImage: coverImage.trim() || undefined,
      authorId: 1, // Mock author ID
      isPublished
    };

    if (isEditing) {
      updateStoryMutation.mutate(storyData);
    } else {
      createStoryMutation.mutate(storyData);
    }
  };

  const handleSaveChapter = () => {
    if (!chapterTitle.trim() || !chapterContent.trim()) {
      toast({ title: "Please fill in chapter title and content", variant: "destructive" });
      return;
    }

    if (!storyIdNum) {
      toast({ title: "Please save the story first", variant: "destructive" });
      return;
    }

    const chapterData: InsertChapter = {
      storyId: storyIdNum,
      title: chapterTitle.trim(),
      content: chapterContent.trim(),
      chapterNumber: selectedChapter ? chapters.find(ch => ch.id === selectedChapter)?.chapterNumber || 1 : chapters.length + 1,
      isPublished: true
    };

    if (selectedChapter) {
      updateChapterMutation.mutate({ id: selectedChapter, data: chapterData });
    } else {
      createChapterMutation.mutate(chapterData);
    }
  };

  const handleNewChapter = () => {
    setSelectedChapter(null);
    setChapterTitle("");
    setChapterContent("");
  };

  if (isEditing && (storyLoading || chaptersLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wattpad-orange"></div>
      </div>
    );
  }

  const wordCount = chapterContent.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = chapterContent.length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isEditing ? "Edit Your Story" : "Create Your Story"}
          </h1>
          <p className="text-gray-600">
            Powerful editor with everything you need to write and publish your stories
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Story Header */}
          <div className="px-6 py-4 border-b bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <Input
                  placeholder="Story Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold bg-transparent border-none focus:ring-2 focus:ring-wattpad-orange max-w-md"
                />
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={handleSaveStory}
                  disabled={createStoryMutation.isPending || updateStoryMutation.isPending}
                  className="text-gray-600 hover:text-wattpad-orange"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save Draft
                </Button>
                <Button
                  onClick={() => {
                    setIsPublished(true);
                    handleSaveStory();
                  }}
                  disabled={createStoryMutation.isPending || updateStoryMutation.isPending}
                  className="bg-wattpad-orange text-white hover:bg-wattpad-orange-dark"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Publish
                </Button>
              </div>
            </div>
            
            {/* Story Description */}
            <div className="mt-4">
              <Textarea
                placeholder="Story description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Editor Toolbar */}
          <div className="px-6 py-3 border-b bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                  <Underline className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                  <Quote className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                  <LinkIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                  <Image className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="p-6">
            <div className="flex space-x-6">
              {/* Chapter List Sidebar */}
              <div className="w-64 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Chapters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewChapter}
                    className="text-wattpad-orange hover:text-wattpad-orange-dark"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      onClick={() => setSelectedChapter(chapter.id)}
                      className={`p-3 rounded cursor-pointer transition-colors ${
                        selectedChapter === chapter.id
                          ? "bg-wattpad-orange text-white"
                          : "bg-white border border-gray-200 hover:border-wattpad-orange"
                      }`}
                    >
                      <div className="font-medium text-sm">Chapter {chapter.chapterNumber}</div>
                      <div className="text-xs opacity-90 truncate">{chapter.title}</div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleNewChapter}
                    className="w-full text-left border-2 border-dashed border-gray-300 text-gray-500 hover:border-wattpad-orange hover:text-wattpad-orange"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chapter
                  </Button>
                </div>
              </div>

              {/* Main Editor */}
              <div className="flex-1">
                <Input
                  placeholder="Chapter Title"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="text-2xl font-bold mb-4 border-none focus:ring-2 focus:ring-wattpad-orange"
                />
                <Textarea
                  placeholder="Start writing your story..."
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  className="min-h-96 resize-none border border-gray-200 focus:ring-2 focus:ring-wattpad-orange"
                />
                
                {/* Editor Stats */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Words: <span className="font-medium">{wordCount}</span></span>
                    <span>Characters: <span className="font-medium">{charCount}</span></span>
                    <span>Reading time: <span className="font-medium">{readingTime} min</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-green-600">
                      <i className="fas fa-check-circle mr-1"></i>
                      Auto-saved
                    </div>
                    <Button
                      onClick={handleSaveChapter}
                      disabled={createChapterMutation.isPending || updateChapterMutation.isPending}
                      className="bg-wattpad-orange text-white hover:bg-wattpad-orange-dark"
                    >
                      Save Chapter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
