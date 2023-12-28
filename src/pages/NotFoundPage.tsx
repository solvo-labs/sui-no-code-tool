import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectHome = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(redirectHome);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-sky-500">404 Not Found</h1>
        <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
        <p className="mt-4 text-gray-600">You will be redirected to the home page in 5 seconds.</p>
      </div>
    </div>
  );
};

export default NotFound;
