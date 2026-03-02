import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return <div className="text-center py-20 min-h-[60vh]">Đang tải lịch sử đơn hàng...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Lịch sử đơn hàng</h1>
      
      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-lg text-gray-500">Bạn chưa có đơn hàng nào cả.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-100 pb-4 border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <CardTitle className="text-lg">Đơn hàng #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                    <CardDescription>
                      Ngày đặt: {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-4 items-center">
                    <p className="font-semibold">
                      Tổng tiền: <span className="text-primary text-xl">{formatPrice(order.total_price)}</span>
                    </p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status === 'pending' ? 'Chờ xử lý' : order.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="divide-y">
                  {order.items.map((item, index) => (
                    <li key={`${item.id}-${index}`} className="py-3 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border rounded flex items-center justify-center p-1">
                          <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-800">{item.price}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
