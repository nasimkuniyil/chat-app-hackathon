import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
      {children}
    </button>
  );
};

export default Button;
