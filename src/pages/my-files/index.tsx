import { create_folder } from "@/api/create-folder";
import { FileRes, GetFilesRes, get_folders } from "@/api/get-folders";
import { upload_txt_file } from "@/api/upload-file";
import { decrypt, encrypt, LOCAL_KEY } from "@/encryption/tools";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Model from "./components/Model";
import Script from "next/script";
import { axios_instance } from "@/api/axios";
import FileViewModel from "./components/FileViewModel";

const MyFiles = () => {
  const [files, setFiles] = useState<FileRes[]>([]);
  const router = useRouter();
  let { path } = router.query;
  const [name_input, set_name_input] = useState("");
  const [key_input, set_key_input] = useState("");
  const [file_content, set_file_content] = useState("");
  const [view_file_model_active, set_view_file_modal_active] = useState(false);

  const [model_active, set_modal_active] = useState(false);
  useEffect(() => {
    get_folders("/").then((e) => {
      setFiles(e.data.payload);
    });
  }, []);

  const create_dir = () => {
    create_folder(encrypt(name_input));
  };
  return (
    <div className="p-4">
      {view_file_model_active && (
        <FileViewModel
          content={file_content}
          onClose={() => set_view_file_modal_active(false)}
        ></FileViewModel>
      )}
      {model_active && (
        <Model
          fileName={name_input}
          path={"/"}
          onClose={() => set_modal_active(false)}
        ></Model>
      )}
      <Script src="https://code.iconify.design/3/3.1.0/iconify.min.js" />
      <div>
        <input
          type="text"
          placeholder="Name"
          className="mr-4 p-2"
          value={name_input}
          onChange={(e) => set_name_input(e.target.value)}
        />
        <button
          className="bg-green-700 p-3 rounded-sm text-white mr-4"
          onClick={() => set_modal_active(true)}
        >
          Create file
        </button>
        <button
          className="bg-green-700 p-3 rounded-sm text-white"
          onClick={create_dir}
        >
          Create folder
        </button>
      </div>
      <div>
        <input
          type="password"
          placeholder="Key"
          className="mr-4 p-2"
          value={key_input}
          onChange={(e) => set_key_input(e.target.value)}
        />
        <button
          className="bg-green-700 p-3 rounded-sm text-white ml-4 mt-4"
          onClick={() => localStorage.setItem(LOCAL_KEY, key_input)}
        >
          Set key
        </button>
      </div>
      <div>
        {files?.map((e, i) => {
          return (
            <div key={e.name} className="relative inline-flex">
              <div className="pl-1.5 text-8xl text-blue-600">
                {e.isDir ? (
                  <span
                    className="iconify"
                    data-icon="material-symbols:folder"
                  ></span>
                ) : (
                  <span
                    className="iconify"
                    data-icon="ic:baseline-insert-drive-file"
                  ></span>
                )}
              </div>

              <div
                className="text-white p-10 inline-flex flex-col rounded-lg absolute top-0 left-0"
                onClick={() => {
                  let o_path = path as string;
                  if (Array.isArray(path)) {
                    o_path = path.join("/");
                  }
                  if (!e.isDir) {
                    axios_instance
                      .post("/get-file", {
                        filePath: e.name,
                      })
                      .then((response) => {
                        var element = document.createElement("a");
                        element.setAttribute(
                          "href",
                          "data:text/plain;charset=utf-8," +
                            encodeURIComponent(decrypt(response.data))
                        );
                        element.setAttribute("download", decrypt(e.name));

                        element.style.display = "none";
                        document.body.appendChild(element);

                        element.click();

                        document.body.removeChild(element);
                      });
                    set_file_content(e.name);
                    return;
                  }

                  router.push("/my-files/" + e.name);
                }}
              >
                <p className="cursor-pointer">{decrypt(e.name)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MyFiles;
