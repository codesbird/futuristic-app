import { QueryClient, QueryFunction } from "@tanstack/react-query";
/// <reference types="vite/client" />
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    // throw new Error(`${res.status}: ${text}`);
    return Promise.reject(new Error(`${res.status}: ${text}`));
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log("api url is :",apiUrl)
  const fullUrl = apiUrl ? apiUrl.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url) : url;
  // console.log(`API Request: ${method} ${fullUrl}`, data);
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const urlPath = queryKey.join("/");
      const fullUrl = apiUrl ? apiUrl.replace(/\/$/, "") + (urlPath.startsWith("/") ? urlPath : "/" + urlPath) : urlPath;
      const res = await fetch(fullUrl, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
