import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold text-blue-600 mb-4">Simplify Your Links</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Shorten long, messy URLs into clean, easy-to-share links. Fast, simple, and free.
      </p>
      <Link href='/shorten' className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
        Get Started
      </Link>
    </div>
  );
}
