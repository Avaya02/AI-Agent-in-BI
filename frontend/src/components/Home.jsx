import React, { useState } from "react";
import { WavyBackground } from "./ui/wavy-background";
import { Sparkles } from "lucide-react";

const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [botResponse, setBotResponse] = useState(null);
  const [tableData, setTableData] = useState(null);

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

      if (data && Object.keys(data).length > 0) {
        setTableData(data);
        setBotResponse(null);
      } else {
        setTableData(null);
        setBotResponse("No data available.");
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setTableData(null);
      setBotResponse("An error occurred while fetching the response.");
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    await fetchBotResponse(input);

    setInput("");
  };

  // Function to format numeric values
  const formatValue = (value) => {
    if (typeof value === "number") {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return value;
  };

  // Dynamic table width calculation
  const tableWidth = tableData ? Math.min(100, Object.keys(tableData).length * 15) : 0;

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
          <div
            key={index}
            className={`p-3 max-w-[70%] rounded-lg break-words animate-fade-in ${
              msg.sender === "user"
                ? "bg-blue-500 self-end text-white shadow-lg"
                : "bg-gray-700 self-start text-white shadow-lg"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {botResponse && (
        <div className="p-3 bg-gray-700 rounded-lg mt-2">
          <strong>Bot:</strong> {botResponse}
        </div>
      )}

      {tableData && typeof tableData === "object" && Object.keys(tableData).length > 0 && (
        <div
          className="max-h-72 overflow-y-auto border border-gray-500 rounded-lg mt-3 mx-auto transition-all duration-300"
          style={{ width: `${tableWidth}%`, minWidth: "300px" }}
        >
          <table className="w-full border-collapse bg-black bg-opacity-20 rounded-lg">
            <thead>
              <tr className="bg-red-500">
                {Object.keys(tableData).map((column) => (
                  <th key={column} className="border border-gray-500 p-2">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableData[Object.keys(tableData)[0]]).map((rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(tableData).map((column) => (
                    <td key={column} className="border border-gray-500 p-2 text-center">
                      {formatValue(tableData[column][rowIndex])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
