import { X } from "lucide-react";
import React from "react";

const Modal = ({ open, close, className, children }) => {
  return (
    open && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col justify-center items-center z-10 p-8">
        <button
          className="absolute top-4 right-4 bg-white shadow-lg p-4 rounded-lg border"
          onClick={close}
        >
          <X size={24} />
        </button>
        <div className={className}>{children}</div>
      </div>
    )
  );
};

export default Modal;
