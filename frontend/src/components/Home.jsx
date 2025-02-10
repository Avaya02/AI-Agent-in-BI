import React, { useState } from "react";
import { WavyBackground } from "./ui/wavy-background";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState({});

  const fetchBotResponse = async (question) => {
    try {
      const response = await fetch("http://192.168.5.174:9112/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      console.log("Raw API Response:", data);

      return data && Object.keys(data).length > 0 ? data : "No data available.";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "An error occurred while fetching the response.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    const botReply = await fetchBotResponse(input);

    const newBotResponse = { text: botReply, sender: "bot" };
    setMessages((prev) => [...prev, newBotResponse]);

    setInput("");
  };

  const toggleDropdown = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatValue = (value) => {
    if (typeof value === "number") {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return value;
  };

  return (
    <div className="relative z-30 container flex flex-col h-screen bg-transparent text-white p-5">
      <div className="bg-black/30 backdrop-blur-sm rounded-xl mt-[-16px] p-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text">
            BI Agent
          </h1>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col gap-1">
            {msg.sender === "user" && (
              <div className="p-3 max-w-[70%] rounded-lg break-words animate-fade-in bg-blue-500 self-end text-white shadow-lg">
                {msg.text}
              </div>
            )}

            {msg.sender === "bot" && typeof msg.text === "object" ? (
              index === messages.length - 1 ? (
                <div className="overflow-x-auto border border-gray-500 rounded-lg inline-block">
                  <table className="bg-black bg-opacity-20 rounded-lg border-collapse">
                    <thead>
                      <tr className="bg-red-500">
                        {Object.keys(msg.text).map((column) => (
                          <th key={column} className="p-3 text-left border border-gray-500 whitespace-nowrap">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(msg.text[Object.keys(msg.text)[0]]).map((rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.keys(msg.text).map((column) => (
                            <td key={column} className="p-3 text-left border border-gray-500 whitespace-nowrap">
                              {formatValue(msg.text[column][rowIndex])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col">
                  <button
                    className="flex items-center justify-between w-64 px-4 py-2 bg-gray-700 rounded-lg shadow-md text-left text-white hover:bg-gray-600"
                    onClick={() => toggleDropdown(index)}
                  >
                    View Data for "{messages[index - 1]?.text}"
                    {expandedIndexes[index] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {expandedIndexes[index] && (
                    <div className="overflow-x-auto border border-gray-500 rounded-lg inline-block">
                      <table className="bg-black bg-opacity-20 rounded-lg border-collapse">
                        <thead>
                          <tr className="bg-red-500">
                            {Object.keys(msg.text).map((column) => (
                              <th key={column} className="p-3 text-left border border-gray-500 whitespace-nowrap">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(msg.text[Object.keys(msg.text)[0]]).map((rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.keys(msg.text).map((column) => (
                                <td key={column} className="p-3 text-left border border-gray-500 whitespace-nowrap">
                                  {formatValue(msg.text[column][rowIndex])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            ) : (
              msg.sender === "bot" && (
                <div className="p-3 bg-gray-700 rounded-lg mt-2">
                  <strong>Bot:</strong> {msg.text}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center p-3 bg-gray-800 bg-opacity-50 rounded-lg mt-3">
        <input
          type="text"
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white outline-none text-lg"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="ml-3 px-5 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-lg transition-transform hover:scale-105"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;
