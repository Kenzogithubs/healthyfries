import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  categories: string[];
  slug: string;
}

interface BlogPostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogPostModal = ({ post, isOpen, onClose }: BlogPostModalProps) => {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {post.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <div className="flex gap-2 mb-4">
            {post.categories.map((category) => (
              <span
                key={category}
                className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
          <div className="text-sm text-gray-500">
            By {post.author} • Published on {post.date}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostModal;
