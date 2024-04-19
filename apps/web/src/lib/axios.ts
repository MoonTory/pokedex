import axios, { AxiosRequestConfig } from "axios";

export async function fetchUrl<T = any>(
  url: string,
  config?: AxiosRequestConfig
) {
  const { data } = await axios.get<T>(url, config);
  return data;
}

export async function postUrl<T = any>(
  url: string,
  body: any,
  config?: AxiosRequestConfig
) {
  const { data } = await axios.post<T>(url, body, config);
  return data;
}

export async function putUrl<T = any>(
  url: string,
  body: any,
  config?: AxiosRequestConfig
) {
  const { data } = await axios.put<T>(url, body, config);
  return data;
}

export async function patchUrl<T = any>(
  url: string,
  body: any,
  config?: AxiosRequestConfig
) {
  const { data } = await axios.patch<T>(url, body, config);
  return data;
}

export async function deleteUrl<T = any>(
  url: string,
  config?: AxiosRequestConfig
) {
  const { data } = await axios.delete<T>(url, config);
  return data;
}
