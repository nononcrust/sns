import { GetUsersRequestQuery } from "@/server/user";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api, queryKey } from "./shared";

export const userService = {
  useUsers: (query: GetUsersRequestQuery = {}) => {
    return useQuery({
      queryKey: [queryKey.user.list, query],
      queryFn: async () => {
        const response = await api.users.$get({ query });
        return await response.json();
      },
    });
  },
  useUserDetail: (userId: string) => {
    return useQuery({
      queryKey: [queryKey.user.detail, userId],
      queryFn: async () => {
        const response = await api.users[":id"].$get({ param: { id: userId } });
        return await response.json();
      },
    });
  },
  useInfiniteUserPosts: (userId: string) => {
    return useInfiniteQuery({
      queryKey: ["infinite", queryKey.user.posts, userId],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await api.users[":id"].posts.$get({
          query: { page: String(pageParam) },
          param: { id: userId },
        });
        return await response.json();
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        const totalPage = lastPage.total / 10;

        return lastPageParam < totalPage ? lastPageParam + 1 : undefined;
      },
      select: (data) => data.pages.flatMap((page) => page.posts),
    });
  },
};
