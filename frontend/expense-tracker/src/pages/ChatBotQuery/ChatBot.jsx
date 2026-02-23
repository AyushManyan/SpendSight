import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ChatQuery from '../../components/ChatQuery';

const ChatBot = () => {
  return (
    <DashboardLayout>
      <div
        className="flex flex-col items-center justify-center min-h-[70vh] p-6 mx-auto max-w-2xl mt-8"
      >
        <h2 className="text-2xl font-semibold mb-4 text-primary">AI Chat Assistant</h2>
        <ChatQuery />
      </div>
    </DashboardLayout>
  );
};

export default ChatBot;