import { create_folder } from "@/api/create-folder";
import { FileRes, GetFilesRes, get_folders } from "@/api/get-folders";
import { decrypt, encrypt } from "@/encryption/tools";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Model from "./components/UploadModel";
import Script from "next/script";
import FileViewModel from "./components/FileViewModel";
import axios from "axios";
import { axios_instance } from "@/api/axios";

const Showcase = () => {
  const [files, setFiles] = useState<FileRes[]>([]);
  const router = useRouter();
  let { path } = router.query;

  const [name_input, set_name_input] = useState("");
  const [file_content, set_file_content] = useState("");
  const [model_active, set_modal_active] = useState(false);
  const [view_file_model_active, set_view_file_modal_active] = useState(false);

  const create_dir = () => {
    const new_path = path as string[];
    create_folder(new_path.join("/") + "/" + encrypt(name_input));
  };
  useEffect(() => {
    let constructed_path: string = "/";
    const path_array = path as string[];
    if (path_array) constructed_path = path_array.join("/");
    get_folders(constructed_path).then((e) => {
      setFiles(e.data.payload);
    });
  }, [path]);
  return (
    <div className="p-4">
      <Script src="https://code.iconify.design/3/3.1.0/iconify.min.js" />
      {view_file_model_active && (
        <FileViewModel
          content={file_content}
          onClose={() => set_view_file_modal_active(false)}
        ></FileViewModel>
      )}
      {model_active && (
        <Model
          fileName={name_input}
          path={(path as string[]).join("/")}
          onClose={() => set_modal_active(false)}
        ></Model>
      )}
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
                        filePath: o_path + "/" + e.name,
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

                  router.push(o_path + "/" + e.name);
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
export default Showcase;
