// hooks/useCurrentUser.ts
import useSWR from "swr";
import { api } from "@/lib/axios"; // your SWR Axios instance

const fetcher = (url: string) =>
  api.get(url, { withCredentials: true }).then(res => res.data.data);
export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR("/user/profile", fetcher, {
    shouldRetryOnError: false,
  });

  return {
    user: data,
    isLoading,
    isError: !!error,
    isAuthenticated: !!data,
    mutate,
  };
}
