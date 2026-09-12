import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

const serverFetchHelper = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { headers, body, ...restOptions } = options;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    cache: "no-store",
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...headers,
    },
    body: isFormData
      ? (body as FormData)
      : body
        ? JSON.stringify(body)
        : undefined,
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: result?.message || "Something went wrong",
      data: null,
    } as T;
  }

  return result;
};

const serverFetch = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    serverFetchHelper<T>(endpoint, {
      ...options,
      method: "GET",
    }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    serverFetchHelper<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    serverFetchHelper<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    serverFetchHelper<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    serverFetchHelper<T>(endpoint, {
      ...options,
      method: "DELETE",
    }),
};

export default serverFetch;
