import React from "react";

export const Textarea = ({ value, onChange, placeholder, className }) => {
  return (
    <textarea
      className={`p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
    />
  );
};
