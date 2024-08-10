import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import TypingAnimation from "@/components/TypingAnimation";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  // Submit Message Function
  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]); // When user types message and presses send

    sendMessage(inputValue);

    setInputValue(""); // Changes the box to blank
  };

  const sendMessage = (message) => {
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    };

    const data = {
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    };

    setisLoading(true);

    axios
      .post(url, data, { headers: headers })
      .then((response) => {
        console.log(response);
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: "bot", message: response.data.choices[0].message.content },
        ]);
        setisLoading(false);
      })
      .catch((error) => {
        setisLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="container mx-auto max-w-full h-screen">
      <div className="flex flex-col h-full bg-gray-900">
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
          {" "}
          Mohammed's Ai Chat 
        </h1>
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="flex flex-col space-y-5">
            {chatLog.map(
              (
                message, index // This is where we display all the messages
              ) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      message.type === "user" ? "bg-purple-500" : "bg-gray-800" // If the message type is user, display different colors accordingly
                    } rounded-lg p-4 text-white break-words max-w-full`}
                  >
                    {/* The Actual Message */}
                    {message.message} 
                  </div>
                </div>
              )
            )}
            {isLoading && (
              <div key={chatLog.length} className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-full">
                  <TypingAnimation />
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">
            <input
              className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
              type="text"
              placeholder="type your message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 duration-300"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
