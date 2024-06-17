"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Bot } from "lucide-react";

interface Message {
  sender: string;
  text: string;
  fromUser: boolean;
}

export default function Component() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCards, setShowCards] = useState(true); // State to manage card visibility

  const handleSubmit = async () => {
    if (!message.trim()) return; // Do nothing if the message is empty

    const newMessage = { sender: "You", text: message, fromUser: true }; // User message
    setMessages([...messages, newMessage]);
    setMessage("");
    setShowCards(false); // Hide the cards after sending a message

    setLoading(true);

    try {
      const response = await fetch("/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }), // Adjusted to match the expected schema
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "AtlantiqAI", text: result, fromUser: false }, // API message
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "AtlantiqAI",
          text: "Error fetching response.",
          fromUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to render messages
  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div
        key={index}
        className={`flex items-${msg.fromUser ? "end" : "start"} gap-3 max-w-full py-3`}
      >
        {!msg.fromUser && (
          <Avatar>
            <AvatarImage alt="Bot" src="/placeholder-ai.jpg" />
            <AvatarFallback>
              <Bot className="" />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`bg-${msg.fromUser ? "purple-500 text-white" : "gray-200"} rounded-lg p-2 ${msg.fromUser ? "ml-auto" : ""} max-w-full`}
        >
          <p>{msg.text}</p>
        </div>
        {msg.fromUser && (
          <Avatar>
            <AvatarImage alt="User" src="/placeholder-user.jpg" />
            <AvatarFallback>{msg.sender}</AvatarFallback>
          </Avatar>
        )}
      </div>
    ));
  };

  const handleButtonClick = (text: string) => {
    setMessage(text);
    handleSubmit();
  };

  return (
    <div className="p-4 sm:p-6 bg-white border rounded-lg">
      <div className="flex items-center mb-4">
        <Avatar className="w-12 h-12 rounded-full mr-4">
          <img src="/placeholder.png" alt="Avatar" />
        </Avatar>

        <h1 className="text-xl sm:text-3xl font-semibold">
          Hi I am Max, Your Executive Assistant!
        </h1>
      </div>
      <p className="text-gray-700 mb-8 sm:mb-12">
        Boost sales with our AI-driven sales employee chatbot. Deliver
        personalized recommendations, answer queries instantly, and convert
        leads 24/7 with seamless customer interactions.
      </p>
      {showCards && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10 mb-6 mt-32 sm:mt-64">
            <button
              className="p-3 bg-purple-500 text-white border rounded-xl"
              onClick={() =>
                handleButtonClick("What are the available services?")
              }
            >
              <h2 className="text-base font-medium mb-2">
                What are the available services?
              </h2>
              <p className="text-white text-sm">
                Takes you to the onboarding of the service
              </p>
            </button>
            <button
              className="p-3 bg-gray-100 border rounded-xl"
              onClick={() =>
                handleButtonClick("What is atlantiqAI?")
              }
            >
              <h2 className="text-base font-medium mb-2">
                What is atlantiqAI?
              </h2>
              <p className="text-gray-600 text-sm">
                Explains the company and its services
              </p>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
            <button
              className="p-3 bg-purple-500 text-white border rounded-xl"
              onClick={() =>
                handleButtonClick("Start an outreach for me")
              }
            >
              <h2 className="text-base font-medium mb-2">
                Start an outreach for me
              </h2>
              <p className="text-white text-sm">
                Starts an outreach with your personalized sales pitch
              </p>
            </button>
            <button
              className="p-3 bg-gray-100 border rounded-xl"
              onClick={() =>
                handleButtonClick("Follow up on Linkedin with my last contact?")
              }
            >
              <h2 className="text-base font-medium mb-2">
                Follow up on Linkedin with my last contact
              </h2>
              <p className="text-gray-600 text-sm">
                Follows up with your last contact on Linkedin
              </p>
            </button>
          </div>
        </>
      )}

      <div className="mt-8">{renderMessages()}</div>
      <div className="flex items-center p-4 bg-gray-100 border rounded gap-5 mb-6 mt-8">
        <PlusIcon className="text-gray-400 h-6 w-6 mr-2" />
        <Input
          placeholder="Send a message."
          className="flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button className="ml-2" onClick={handleSubmit}>
          <Send className="text-black h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
