"use client";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import axios from "axios";

import Swal from "sweetalert2";

export default function Table({ urls ,onDelete }) {
  const router = useRouter();
  


const handleEdit = async (shortCode, currentUrl) => {
  const { value: newUrl } = await Swal.fire({
    title: `Edit URL for: <code>${shortCode}</code>`,
    html: `
      <p class="text-sm text-gray-500 mb-2">Current URL:</p>
      <p class="bg-gray-100 p-2 rounded text-sm break-words">${currentUrl}</p>
    `,
    input: "url",
    inputLabel: "Enter new destination URL",
    inputPlaceholder: "https://example.com",
    inputValue: currentUrl,
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Update",
    showLoaderOnConfirm: true,
    preConfirm: async (newUrl) => {
      if (!newUrl || !/^https?:\/\/.+/i.test(newUrl)) {
        Swal.showValidationMessage("Please enter a valid URL starting with http or https");
        return;
      }

      try {
        const apiUrl = `http://localhost:8000/api/shorten/${shortCode}/`;
        const response = await axios.put(apiUrl, { url: newUrl });

        if (response.status !== 200) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return response.data;
      } catch (error) {
        Swal.showValidationMessage(
          `Update failed: ${error.response?.data?.message || error.message}`
        );
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });

  if (newUrl) {
    Swal.fire({
      title: "Updated!",
      text: "The URL has been successfully updated.",
      icon: "success",
    })
  }
};


  const handleDelete = async (shortCode) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `http://localhost:8000/api/shorten/${shortCode}/`
          );
          if (res.status === 204) { 
            onDelete(); 
          }
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "An error occurred while deleting the URL.",
            icon: "error",
          });
          return;
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        })
      }
    });
  };


  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Sr#
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              ShortUrl
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Created At
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Updated At
            </th>

            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {urls.map((item ,idx) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {idx+1}
              </td>

              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {item.shortCode}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {new Date(item.createdAt).toUTCString()}
              </td>

              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {new Date(item.updatedAt).toUTCString()}
              </td>

              <td className="whitespace-nowrap px-4 py-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push(`/shorten/${item.shortCode}`)}
                    className="inline-block rounded bg-blue-100 p-1.5 text-blue-600 hover:bg-blue-200"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(item.shortCode,item.url)}
                    className="inline-block rounded bg-yellow-100 p-1.5 text-yellow-600 hover:bg-yellow-200"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.shortCode)}
                    className="inline-block rounded bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
