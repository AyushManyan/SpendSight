import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-blue-100 rounded-full" />
        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-blue-600 rounded-full animate-ping" />
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-r-2 border-blue-600 rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Loading;