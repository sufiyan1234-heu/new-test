"use client";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UrlForm = ({ onUrlAdded }) => {
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/shorten/', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 201) {
        toast.success("URL Shortened Successfully");
        setShortenedUrl(response.data.shortCode);
        onUrlAdded();
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to shorten URL");
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success("Copied to Clipboard");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-1/2 mx-auto mt-12">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Enter URL to shorten
          </label>
          <input
            {...register('url', {
              required: "Please enter a URL",
              pattern: {
                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
                message: "Please enter a valid URL",
              },
            })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
            disabled={loading}
          />
        </div>
        {errors.url && <p className="text-sm text-red-600">{errors.url.message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {shortenedUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md max-w-1/2 mx-auto">
          <p className="text-sm font-medium text-gray-700 mb-2">Shortened URL:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shortenedUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UrlForm;
