import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCheckoutClick = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để thanh toán nhé!");
      navigate('/login');
      return;
    }

    if (cart.length === 0) return;

    try {
      // Gọi API Inserts vào bảng `orders`
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_price: cartTotal,
            items: cart,
            // status default là 'pending' như trong SQL
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      alert("Đặt hàng thành công! 🎉");
      clearCart();
      navigate('/order-history');
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng: " + error.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8">Hãy tìm thêm các sản phẩm công nghệ tuyệt vời nhé!</p>
        <Link to="/">
          <Button size="lg">Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50 min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4">
              <div className="w-24 h-24 bg-gray-100 flex-shrink-0 flex items-center justify-center rounded-md">
                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain p-2" />
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-primary font-bold">{item.price}</p>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 hover:bg-white rounded-full transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-medium w-6 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 hover:bg-white rounded-full transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                title="Xóa sản phẩm"
              >
                <Trash2 size={20} />
              </button>
            </Card>
          ))}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={clearCart} className="text-red-600 border-red-200 hover:bg-red-50">
              Xóa toàn bộ giỏ hàng
            </Button>
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí giao hàng</span>
                <span>Miễn phí</span>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatPrice(cartTotal)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full text-lg h-12" onClick={handleCheckoutClick}>
                Tiến hành thanh toán
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}