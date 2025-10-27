import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer">
      {children}
    </button>
  );
};

export default Button;
