import { FileInput, Label } from "flowbite-react";

export function Dropzone(props: {onUpload: (file: File) => void}) {
  return (
    <div className="flex w-fit items-center justify-center">
      <Label
        htmlFor="dropzone-file"
        className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            className="mb-4 h-8 w-8 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
          </p>
        </div>
        <FileInput
            id="dropzone-file"
            className="hidden"
            accept="image/*"
            onChange={e => {
                const fileInput = e.target as HTMLInputElement
                if (fileInput && fileInput?.files?.length === 1) {
                    props.onUpload(fileInput.files.item(0)!)
                }
            }}
        />
      </Label>
    </div>
  );
}