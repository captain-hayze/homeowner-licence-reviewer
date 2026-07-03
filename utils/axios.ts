import axios from "axios";
import { getRequestSignature } from "./get-request-signature";
import { getAuthToken } from "./get-auth-token";

const API_URL = process.env.NEXT_PUBLIC_BASEURL;

const axiosConfig = axios.create({
  baseURL: API_URL || "https://staging-api.materialspro.ng/api/v1",
});

axiosConfig?.interceptors?.request?.use(
  function (config) {
    const token = getAuthToken();
    const headers = new axios.AxiosHeaders(config.headers || {});
    headers.set("Authorization", "Bearer " + token);
    headers.set("X-Signature", getRequestSignature(
      String(config.method).toUpperCase(),
      !config.data ? "" : JSON.stringify({ ...config.data })
    ));
    config.headers = headers;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosConfig?.interceptors?.response?.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export async function fetcher(url: string) {
  try {
    const { data } = await axiosConfig.get(url);
    return data;
  } catch (error) {
    console.error(`error fetching form ${url}:`, error)
  }
}

export const handleMutation = async (url:string, { arg }: {arg?: Record<string, unknown>}) => {
  try {

    const {data} = await axiosConfig.post(url, arg)
    return data
  } catch (error) {
    throw error
  }
}

export const handleUpdates = async (url:string, {arg}:{arg: Record<string, unknown>}) => {
  try {
    const {data} = await axiosConfig.put(url, arg)
    return data
  } catch (error) {
    throw error
  }
}

export default axiosConfig;
