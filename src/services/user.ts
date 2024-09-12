import { GetUsersRequestQuery } from "@/server/user";
import { useQuery } from "@tanstack/react-query";
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
};
