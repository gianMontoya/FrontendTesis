// eslint-disable-next-line no-unused-vars
import React from 'react';

// eslint-disable-next-line react/prop-types
function Modal({ children, showModal, setShowModal }) {

  const handleClose = () => {
    setShowModal(false);
  };

  return (
      <>
        {showModal && (

            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                onClick={handleClose}
            >
              <div
                  className="bg-white p-6 rounded-md shadow-md"
                  onClick={e => e.stopPropagation()} // Prevent click-outside from closing
              >
                <div className="relative">
                  <button
                      onClick={handleClose}
                      className="absolute right-0 px-2 py-1 bg-gray-400 hover:bg-gray-600 text-white rounded-md"
                  >
                    x
                  </button>
                </div>
                {children}
              </div>
            </div>
        )}
      </>
  );
}

export default Modal;