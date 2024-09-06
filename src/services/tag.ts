import { useQuery } from "@tanstack/react-query";
import { queryKey } from "./shared";

export const tagService = {
  useTags: () => {
    return useQuery({
      queryKey: [queryKey.tag],
      queryFn: async () => {
        return Promise.resolve([]);
      },
    });
  },
};
