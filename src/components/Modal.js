import React, { forwardRef, useEffect, useState } from "react";

const Modal = ({ footer, body, title, modalType }, ref) => {
  const [showModal, setShowModal] = useState(false);

  function onOpen() {
    setShowModal(true);
    document.body.style.overflow = "hidden";
    return true;
  }

  function onClose() {
    setShowModal(!showModal);
    document.body.style.overflow = "scroll";
    return false;
  }

  useEffect(() => {
    if (ref) ref.current = { onOpen, onClose, showModal };
  }, [showModal]);

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      if (showModal) onClose();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showModal]);

  return (
    <>
      {showModal ? (
        <>
          <div
            onClick={onClose}
            className="bg-slate-100 fixed inset-0  z-40 bg-grey-100 opacity-50"
          ></div>
          <div
            className={`fixed inset-0 z-50 m-auto flex  items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none ${
              modalType === "full" ? " max-w-[95vw]" : "w-full md:max-w-3xl"
            } `}
          >
            <div
              className={`fixed bottom-0  mx-auto rounded-t-2xl bg-white  md:relative   md:rounded-2xl  ${
                modalType === "full"
                  ? "w-screen "
                  : "w-full md:w-auto md:max-w-3xl"
              } `}
            >
              <div
                className={` bg-hero relative flex w-auto  flex-col rounded-lg
                border-0 bg-[length:40%] 	 bg-left-bottom bg-no-repeat 
                ${
                  modalType === "full" ? "bg-white" : ""
                }  shadow-lg outline-none focus:outline-none`}
              >
                {title && (
                  <div className="border-slate-200 flex items-center justify-between rounded-t border-b-1 border-solid border-grey-500 p-5 pb-4">
                    <h3 className="text-l font-semibold">{title}</h3>
                    <div
                      className="bg-transparent float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                      onClick={onClose}
                    >
                      <span className=" bg-transparent opacity-1 center flex h-6 w-6 cursor-pointer items-center justify-center text-xl font-bold text-black outline-none focus:outline-none ">
                        &#10005;
                      </span>
                    </div>
                  </div>
                )}
                <div
                  className={`relative ${
                    modalType === "full" ? "h-[95vh]" : " max-h-[calc(55vh)]"
                  }   flex-auto overflow-scroll`}
                >
                  {modalType === "full" ? (
                    <div className="p-6">
                      <div
                        className="bg-transparent float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                        onClick={onClose}
                      >
                        <span className=" bg-transparent opacity-1 center flex h-6 w-6 cursor-pointer items-center justify-center text-xl font-bold text-black outline-none focus:outline-none ">
                          close{" "}
                        </span>
                      </div>

                      {body}
                    </div>
                  ) : (
                    body
                  )}
                </div>
                {footer && (
                  <div className="border-slate-200 flex items-center justify-end rounded-b border-t-1 border-solid border-grey-500 p-6">
                    {footer}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default forwardRef(Modal);
