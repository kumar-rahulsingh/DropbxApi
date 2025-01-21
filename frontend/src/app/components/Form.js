"use client";
import React, { useState, useEffect } from "react";

export default function Form() {
    const [participants, setParticipants] = useState([{ name: "", email: "" }]);
    const [signingType, setSigningType] = useState("regular");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [isClient, setIsClient] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const handleParticipantChange = (index, field, value) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index][field] = value;
        setParticipants(updatedParticipants);
    };

    const addParticipant = () => {
        setParticipants([...participants, { name: "", email: "" }]);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === "application/pdf") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFile(reader.result); // base64 encoded PDF
                    setMessage("");
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setMessage("Only PDF files are allowed.");
                e.target.value = ""; // Clear invalid file
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage(""); // Clear previous messages
        try {
            const response = await fetch(backendUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    participants,
                    signingType,
                    file,
                }),
            });

            if (!response.ok) {
                // Throw an error if the response status is not OK (e.g., 400, 500)
                const errorData = await response.json();
                throw new Error(errorData.message || "An unexpected error occurred.");
            }

            const data = await response.json();
            console.log("Response:", data);
            setMessage(data.message || "Form submitted successfully!");
        } catch (error) {
            console.error("Error:", error);
            setMessage(error.message || "An error occurred while sending the request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <main className="flex-grow flex justify-center items-center px-4 py-8">
                <form className="w-full max-w-md p-8 rounded-lg shadow-xl space-y-6" onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold text-gray-700 text-center">Send Agreement for Signature</h2>

                    {participants.map((participant, index) => (
                        <div key={index} className="flex flex-col gap-4 mb-6">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-gray-50 w-1/2"
                                    value={participant.name}
                                    onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-gray-50 w-1/2"
                                    value={participant.email}
                                    onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="w-full p-3 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-800 mb-4"
                        onClick={addParticipant}
                    >
                        Add Participant
                    </button>

                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-gray-50 mb-6"
                        value={signingType}
                        onChange={(e) => setSigningType(e.target.value)}
                    >
                        <option value="regular">Regular Signing</option>
                        <option value="notary">Notary Signing</option>
                    </select>

                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-gray-50 mb-6"
                    />

                    <button
                        type="submit"
                        className={`w-full p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors ${loading ? "opacity-50" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>

                    {message && (
                        <p className={`text-sm mt-4 text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </p>
                    )}
                </form>
            </main>
        </div>
    );
}
