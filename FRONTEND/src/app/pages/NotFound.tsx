import { Link } from "react-router";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-black text-purple-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/home" 
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition"
      >
        <Home className="size-5" />
        Back to Home
      </Link>
    </div>
  );
}
