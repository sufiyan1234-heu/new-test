"use client";
import Table from "@/components/Table";
import UrlForm from "@/components/UrlForm";
import axios from "axios";
import { useEffect, useState } from "react";

const URLShortenerForm = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUrls = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/urls/");
      setUrls(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="">
      <UrlForm onUrlAdded={fetchUrls} />
      <div className="w-full p-9">
        <h2 className="mt-12 text-lg font-medium text-gray-900">
          Recently Shortened URLs
        </h2>
        {loading ? (
          <p className="flex justify-center items-center text-3xl text-gray-400 font-bold">
            loading...
          </p>
        ) : (
          <Table urls={urls} onDelete={fetchUrls} />
        )}
      </div>
    </div>
  );
};

export default URLShortenerForm;
