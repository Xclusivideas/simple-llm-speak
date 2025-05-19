
import React from "react";
import Chat from "@/components/Chat";

const Index: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-[100vh] bg-muted/20">
      <Chat />
    </div>
  );
};

export default Index;
