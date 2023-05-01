import { upload_txt_file } from "@/api/upload-file";
import dynamic from "next/dynamic";
import { useState } from "react";

type Props = {
  content: string;
  onClose: () => void;
};
const FileViewModel = (prop: Props) => {
  return (
    <>
      <div className="fixed h-screen w-screen bg-black/50"></div>
      <div className="h-full w-full fixed overflow-scroll pb-36">
        <div className="mx-auto w-4/5 my-5 bg-gray-900 px-8 py-5 rounded-lg mt-28">
          <p>{prop.content}</p>
          <button
            type="button"
            onClick={prop.onClose}
            className="text-white w-44 ml-10 mt-5 mb-11 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(FileViewModel), {
  ssr: false,
});
