import React from 'react';
import ChatInterface from '../components/ChatInterface';

const ChatPage = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hỗ trợ trực tuyến</h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Hỏi AI Assistant về thông tin sản phẩm, giá cả và tình trạng kho hàng 24/7.
          </p>
        </div>
        
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;
