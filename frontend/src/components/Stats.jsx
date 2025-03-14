"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Stats() {
  const params = useParams();
  const shortCode = params.shorturl;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/shorten/${shortCode}/stats/`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (shortCode) {
      fetchData();
    }
  }, [shortCode]);

  const chartData = data ? [{ name: "Clicks", clicks: data.accessCount }] : [];

  return (
    <div className="w-full flex justify-center items-center mt-6">
      <div className="bg-white p-6 rounded-xl shadow max-w-md w-full">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-blue-600 text-center">
              Stats for {data.shortCode}
            </h1>
            <p className="text-center text-gray-600 mb-6 break-words">
              {data.url}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center mt-4 text-gray-700">
              Total Clicks: {data.accessCount}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
