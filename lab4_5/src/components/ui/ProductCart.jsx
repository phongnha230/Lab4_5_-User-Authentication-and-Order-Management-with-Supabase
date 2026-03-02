import React from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

const ProductCart = ({ id, name, image, description, price }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      alert("Bạn phải đăng nhập thì mới được thêm vào giỏ hàng nhé!");
      navigate("/login");
      return;
    }
    
    addToCart({ id, name, image, price });
    // Using a more subtle toast would be better, but alert is what we have for now.
    alert(`Đã thêm ${name} vào giỏ hàng!`);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group bg-white rounded-2xl">
      <div className="w-full relative pt-[100%] overflow-hidden bg-slate-50/50 group-hover:bg-indigo-50/30 transition-colors">
        <div className="absolute inset-0 p-6 flex items-center justify-center">
          <img 
            src={image} 
            alt={name} 
            className="max-w-full max-h-full object-contain drop-shadow-sm group-hover:scale-105 group-hover:drop-shadow-md transition-all duration-500 ease-out" 
          />
        </div>
      </div>

      <div className="flex flex-col flex-grow p-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {name}
          </CardTitle>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black text-indigo-600">{price}</span>
            {!price.includes('đ') && <span className="text-sm font-semibold text-indigo-600/70">đ</span>}
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow pb-4">
          <CardDescription className="line-clamp-2 text-sm text-slate-500 font-medium">
            {description}
          </CardDescription>
        </CardContent>

        <CardFooter className="pt-0">
          <button 
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md shadow-slate-900/10 hover:shadow-indigo-600/25 active:scale-[0.98] transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Thêm giỏ hàng</span>
          </button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCart;
