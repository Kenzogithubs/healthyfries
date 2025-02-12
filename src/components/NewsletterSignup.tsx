import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically send the email to your backend/newsletter service
      // For now, we'll simulate a successful signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Thanks for subscribing! Check your email to confirm.");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md w-full mx-auto">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/90 border-0"
        required
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        variant="secondary" 
        className="bg-white text-green-600 hover:bg-white/90 whitespace-nowrap"
        disabled={isLoading}
      >
        {isLoading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
};

export default NewsletterSignup;
