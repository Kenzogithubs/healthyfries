import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import BlogPostModal from "@/components/BlogPostModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: featuredPost } = useQuery({
    queryKey: ["featuredPost"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("featured", true)
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: latestPosts = [] } = useQuery({
    queryKey: ["latestPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const { data: topPosts = [] } = useQuery({
    queryKey: ["topPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("views", { ascending: false })
        .limit(2);

      if (error) throw error;
      return data;
    },
  });

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-amber-900 leading-tight">
              Honest Reviews, No BS
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-amber-800 leading-relaxed">
              Join our community for authentic, unbiased reviews on supplements, nutrition, and health tips.
              No paid promotions – just real experiences and honest opinions.
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-24">
        {/* Featured Article */}
        {featuredPost && (
          <div className="mb-24">
            <h2 className="text-3xl font-bold mb-12 text-left text-amber-800">Featured Article</h2>
            <div
              className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handlePostClick(featuredPost)}
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-w-16 aspect-h-9 md:aspect-h-full">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-12 flex flex-col justify-center">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {featuredPost.categories.map((category) => (
                      <span
                        key={category}
                        className="text-xs font-medium px-3 py-1 bg-amber-50 text-amber-700 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-gray-800">{featuredPost.title}</h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-8">
                    <span className="font-medium">{featuredPost.author}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(featuredPost.date)}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredPost.views?.toLocaleString() || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Latest Articles */}
        <div className="mb-24">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-amber-800">Latest Articles</h2>
            <Link to="/review">
              <Button variant="outline" size="lg" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <div
                key={post.id}
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
                <div className="p-6">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(post.date)}</span>
                    <span>{post.views?.toLocaleString() || 0} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular */}
        <div>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-amber-800">Most Popular</h2>
            <Link to="/review">
              <Button variant="outline" size="lg" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {topPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 transition-transform"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {post.categories.map((category) => (
                        <span
                          key={category}
                          className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">{post.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDate(post.date)}</span>
                      <span>{post.views?.toLocaleString() || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-amber-600 to-orange-600 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Subscribe to Our Newsletter</h2>
            <p className="text-white/90 mb-8">
              Get authentic reviews and insights delivered straight to your inbox. No spam, no paid promotions – just honest content.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>

      <BlogPostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default Index;
