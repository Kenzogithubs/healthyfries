import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostModal from "@/components/BlogPostModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CATEGORIES = ["All", "Supplements", "Nutrition", "Protein", "Low Calorie", "Health Tips", "Recipes"];
const POSTS_PER_PAGE = 12;

const Review = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Filter posts based on category and search query
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.categories.includes(selectedCategory);
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-amber-800">Health & Nutrition Blog</h1>
        <p className="text-amber-700 mb-8 md:mb-12 max-w-2xl mx-auto">
          Expert insights on supplements, nutrition, and healthy living. All articles are carefully researched and written to help you make informed decisions about your health.
        </p>
        
        {/* Search bar */}
        <div className="relative max-w-md mx-auto mb-6 md:mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full border-amber-200 focus:ring-amber-500"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8 md:mb-12 justify-center">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full text-sm md:text-base ${
                selectedCategory === category 
                  ? "bg-amber-600 hover:bg-amber-700 text-white" 
                  : "border-amber-600 text-amber-600 hover:bg-amber-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {paginatedPosts.map((post) => (
            <div 
              key={post.slug}
              onClick={() => handlePostClick(post)}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 transition-transform"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 md:p-6">
                <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-amber-800">{post.title}</h2>
                <p className="text-amber-600 mb-4 text-sm md:text-base line-clamp-3">{post.excerpt}</p>
                <div className="text-xs md:text-sm text-amber-500">
                  Published on {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 md:mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} text-amber-600`}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page} className="hidden md:block">
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className={currentPage === page ? "bg-amber-600" : "text-amber-600"}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} text-amber-600`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <BlogPostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default Review;
