import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import type { Post, NewPost } from "@/types/blog";

const PREDEFINED_CATEGORIES = [
  "Supplements",
  "Nutrition",
  "Protein",
  "Low Calorie",
  "Health Tips",
  "Recipes"
];

interface AdminPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPostModal({ post, isOpen, onClose }: AdminPostModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NewPost>({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    categories: [],
    slug: "",
    featured: false,
  });
  const [customCategory, setCustomCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        author: post.author,
        categories: post.categories,
        slug: post.slug,
        featured: post.featured,
      });
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        author: "",
        categories: [],
        slug: "",
        featured: false,
      });
    }
  }, [post]);

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleAddCustomCategory = () => {
    if (customCategory && !formData.categories.includes(customCategory)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, customCategory]
      }));
      setCustomCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (post) {
        const { error } = await supabase
          .from("posts")
          .update(formData)
          .eq("id", post.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      } else {
        const { error } = await supabase.from("posts").insert([formData]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Post created successfully",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast({
        title: "Error",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const timestamp = Date.now();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `post-image-${timestamp}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      const imageUrl = `https://pvcdxdyokiauhvkgtwei.supabase.co/storage/v1/object/public/blog-images/${filePath}`;
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      console.error("Supabase image upload error:", error); // Enhanced error logging
      toast({
        title: "Error",
        description: "Failed to upload image to Supabase.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {post ? "Edit Post" : "Create New Post"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              required
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
              <Button
                variant="outline"
                asChild
              >
                <label htmlFor="image-upload">
                  {imageFile ? imageFile.name : "Upload Image"}
                </label>
              </Button>
              <Button
                type="button"
                onClick={handleImageUpload}
                disabled={uploading || !imageFile}
                isLoading={uploading}
              >
                Upload to Supabase
              </Button>
            </div>
            {formData.image && !imageFile && (
              <div className="mt-2">
                <img src={formData.image} alt="Post Image" className="max-h-32 rounded-md" />
              </div>
            )}
             {imageFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Uploaded Image Preview"
                  className="max-h-32 rounded-md"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, author: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={formData.categories.includes(category) ? "default" : "outline"}
                  onClick={() => handleCategoryToggle(category)}
                  className={`rounded-full ${
                    formData.categories.includes(category)
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "border-amber-600 text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddCustomCategory}
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center gap-1 bg-amber-50 text-amber-700"
                >
                  {category}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-amber-900"
                    onClick={() => handleRemoveCategory(category)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, featured: checked }))
              }
            />
            <Label htmlFor="featured">Featured Post</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
