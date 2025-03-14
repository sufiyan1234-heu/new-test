"use client";
import Stats from "@/components/Stats";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const params = useParams();
  const [url, setUrl] = useState();

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/shorten/${params.shorturl}/`
        );
        setUrl(response.data);
      } catch (error) {
        console.error(error);
        toast.error("error fetching url");
      }
    };
    fetchUrl();
  }, [params]);

  return (
    <div>
      {url ? (
        <>
          <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full mx-auto mt-8">
            <h2 className="text-xl font-bold text-blue-600 mb-2">
              Short URL Details
            </h2>

            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">Original URL:</span>{" "}
                <a
                  href={url.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline break-words"
                >
                  {url.url}
                </a>
              </p>
              <p>
                <span className="font-semibold">Short Code:</span>{" "}
                {url.shortCode}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(url.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Last Updated:</span>{" "}
                {new Date(url.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <Stats />
        </>
      ) : (
        "loading...."
      )}
    </div>
  );
};

export default page;
