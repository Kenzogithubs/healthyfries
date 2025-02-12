import { useState, useEffect } from "react"; // Import useEffect
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Home, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AdminPostModal } from "@/components/AdminPostModal";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import type { Post } from "@/types/blog";

export default function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize useNavigate

  const { data: posts, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });

  // New useEffect to check admin role on component mount
  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        return;
      }

      const user = session?.session?.user;
      if (!user?.app_metadata?.role === 'admin') {
        // If not admin, redirect to home or another appropriate page
        navigate("/"); // Redirect to homepage for non-admins
        toast({
          title: "Unauthorized",
          description: "You are not authorized to access this page.",
          variant: "destructive",
        });
      }
    };

    checkAdminRole();
  }, [navigate, toast]); // Add navigate and toast to dependency array


  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      refetch();
    }
  };

  const handleCreateNew = () => {
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-amber-800">Manage Posts</h1>
          </div>
          <Button onClick={handleCreateNew} className="bg-amber-600 hover:bg-amber-700">
            Create New Post
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Views</TableHead>
                <TableHead className="hidden md:table-cell">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(post.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{post.views}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.featured ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(post)}
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AdminPostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
