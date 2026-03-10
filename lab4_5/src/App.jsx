import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { supabase } from "./lib/supabase";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, Package, Hexagon, MessageSquare, X } from "lucide-react";
import ChatInterface from "./components/ChatInterface";

function App() {
  const { user } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans py-[0px]">
      {/* Premium Navigation Header */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Main Nav */}
            <div className="flex items-center gap-8 lg:gap-12">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-1.5 md:p-2 rounded-xl shadow-md group-hover:shadow-indigo-500/30 group-hover:-translate-y-0.5 transition-all duration-300">
                  <Hexagon className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" strokeWidth={1} />
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-950 to-slate-700">
                  TechStore
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-1 mt-1">
                <Link 
                  to="/" 
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    location.pathname === '/' 
                      ? 'text-indigo-600 bg-indigo-50/80 shadow-sm shadow-indigo-100/50' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Trang chủ
                </Link>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="flex items-center gap-2 sm:gap-4 mt-1">
              <Link to="/cart">
                <Button 
                  variant="ghost" 
                  className="relative group flex items-center gap-2 hover:bg-slate-100/80 rounded-full md:rounded-xl px-3 py-2 h-auto transition-all"
                >
                  <div className="relative flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" strokeWidth={2.2} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-sm ring-2 ring-white transform group-hover:scale-110 transition-transform">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:inline-block font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">Giỏ hàng</span>
                </Button>
              </Link>

              <div className="h-6 w-[2px] bg-slate-200 hidden sm:block mx-1 rounded-full"></div>

              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link to="/order-history">
                    <Button variant="ghost" className="hidden lg:flex items-center gap-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-xl font-semibold transition-all">
                      <Package className="w-4 h-4" strokeWidth={2.5} />
                      Đơn hàng
                    </Button>
                  </Link>
                  
                  <div className="flex items-center gap-2.5 bg-slate-100/80 pl-1.5 pr-4 py-1.5 rounded-full border border-slate-200/60 hidden sm:flex hover:bg-slate-200/50 transition-colors cursor-default">
                    <div className="bg-indigo-100 text-indigo-700 p-1 rounded-full shadow-sm">
                      <User className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[140px]">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full h-10 w-10 transition-colors" 
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" strokeWidth={2.5} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 md:gap-3">
                  <Link to="/login">
                    <Button variant="ghost" className="text-slate-600 font-semibold hover:text-indigo-600 hover:bg-indigo-50 rounded-xl hidden sm:inline-flex transition-all">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg active:scale-95 transition-all text-sm px-5 sm:px-6 h-10">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Nội dung các trang sẽ hiện ở đây */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="mt-auto py-6 text-center bg-white border-t text-gray-500">
        <p>© 2026 - TechStore Lab 4+5 Project</p>
      </footer>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {isChatOpen && user && (
          <div className="shadow-2xl mb-2">
            <ChatInterface onClose={() => setIsChatOpen(false)} />
          </div>
        )}
        
        <Button
          onClick={() => {
            if (!user) {
              navigate('/login');
              return;
            }
            setIsChatOpen(!isChatOpen);
          }}
          className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 active:scale-90 flex items-center justify-center ${
            isChatOpen 
              ? 'bg-rose-500 hover:bg-rose-600 rotate-90' 
              : 'bg-gradient-to-br from-indigo-600 to-blue-600 hover:shadow-indigo-500/40 hover:-translate-y-1'
          }`}
        >
          {isChatOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-white"></span>
              </span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

export default App;