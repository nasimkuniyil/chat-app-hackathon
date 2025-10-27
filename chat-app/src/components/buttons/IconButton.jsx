import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group cursor-pointer">
      {children}
    </button>
  );
};

export default Button;
