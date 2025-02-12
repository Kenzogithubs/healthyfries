import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                src="/lovable-uploads/1d59b177-a3d7-4452-93f5-ca99363790e4.png"
                alt="Healthy Fries"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-amber-600">Healthy Fries</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link to="/" className="text-amber-700 hover:text-amber-500 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link to="/review" className="text-amber-700 hover:text-amber-500 px-3 py-2 text-sm font-medium">
              Review
            </Link>
            <Link to="/faq" className="text-amber-700 hover:text-amber-500 px-3 py-2 text-sm font-medium">
              FAQ
            </Link>
            {user ? (
              <>
                <Link to="/admin" className="text-amber-700 hover:text-amber-500 px-3 py-2 text-sm font-medium">
                  Admin
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-amber-700 hover:text-amber-500">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth" className="text-amber-700 hover:text-amber-500 px-3 py-2 text-sm font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
