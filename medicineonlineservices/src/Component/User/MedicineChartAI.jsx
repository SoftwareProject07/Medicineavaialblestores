import React, { useState } from "react";
import axios from "axios";

export default function MedicineChartAI() {

    const [customerName, setCustomerName] = useState("");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "👋 Welcome! Ask me anything about medicines, products or order status."
        }
    ]);

    const askAI = async () => {

        if (question.trim() === "") {
            alert("Please enter your question.");
            return;
        }

        // Show user message
        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: question
            }
        ]);

        setLoading(true);

        try {

            const res = await axios.post(
              //  "http://localhost:5256/api/MedicineChatAPI/AskQuestion",
               // "https://ecommerceserviceapi.azurewebsites.net/api/MedicineChatAPI/AskQuestion", 
               "https://ecommerencesite.onrender.com/api/MedicineChatAPI/AskQuestion",   
                {
                    customerName,
                    question
                });

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text: res.data.answer
                }
            ]);

        }
        catch {

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text: "Unable to connect to API."
                }
            ]);

        }

        setQuestion("");
        setLoading(false);
    };

    return (

        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                        💊 Medicine AI ChatBot
                    </h4>
                </div>

                <div
                    className="card-body"
                    style={{
                        height: "450px",
                        overflowY: "auto",
                        background: "#f5f5f5"
                    }}
                >

                    {
                        messages.map((item, index) => (

                            <div
                                key={index}
                                className={
                                    item.sender === "user"
                                        ? "text-end mb-3"
                                        : "text-start mb-3"
                                }
                            >

                                <div
                                    style={{
                                        display: "inline-block",
                                        padding: "10px 15px",
                                        borderRadius: "12px",
                                        background:
                                            item.sender === "user"
                                                ? "#0d6efd"
                                                : "#ffffff",
                                        color:
                                            item.sender === "user"
                                                ? "#fff"
                                                : "#000",
                                        maxWidth: "75%"
                                    }}
                                >
                                    {item.text}
                                </div>

                            </div>

                        ))
                    }

                </div>

                <div className="card-footer">

                    {/* <input
                        className="form-control mb-2"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    /> */}

                    <div className="d-flex">

                        <input
                            className="form-control"
                            placeholder="Ask your question..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    askAI();
                                }
                            }}
                        />

                        <button
                            className="btn btn-primary ms-2"
                            onClick={askAI}
                            disabled={loading}
                        >
                            {loading ? "..." : "Send"}
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}