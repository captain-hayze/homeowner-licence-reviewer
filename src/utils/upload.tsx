
// import { Buffer } from "buffer";
import axios, { AxiosError } from "axios";

// window.Buffer = Buffer;

const API_URL = import.meta.env.VITE_BASEURL!;

type UploadFile = {
    file: File;
    filename: string;
    onSuccess?: (url: string, file: File) => void;
    onError?: (error: AxiosError) => void;
}

export default async function uploadToS3({
  file,
  onSuccess,
  onError,
  filename,
}: UploadFile) {
  try {
    const formData: FormData = new FormData();

    // // Update the formData object
    formData.append("file", file!, filename);

    const { data } = await axios.post(`${API_URL}/upload`, formData);

    onSuccess?.(
      data.location,
      file
    );
    return data.location;
  } catch (error) {
    onError?.(error as AxiosError);
  }
}