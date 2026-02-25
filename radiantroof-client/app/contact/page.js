"use client";
import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to an API
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      
      {submitted && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          Thank you for your message! We'll get back to you soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded" 
            placeholder="Your name" 
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input 
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded" 
            placeholder="your@email.com" 
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded" 
            placeholder="Your message" 
            rows="4"
            required
          />
        </div>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}