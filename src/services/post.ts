import { GetPostsRequestQuery } from "@/server/utils";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, queryKey } from "./shared";

export const postService = {
  useInfinitePosts: () => {
    return useInfiniteQuery({
      queryKey: ["infinite", queryKey.post],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await api.posts.$get({ query: { page: String(pageParam) } });
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
  usePosts: (query: GetPostsRequestQuery = {}) => {
    return useQuery({
      queryKey: [queryKey.post, query],
      queryFn: async () => {
        const response = await api.posts.$get({ query });
        return await response.json();
      },
    });
  },
  usePostDetail: (postId: string) => {
    return useQuery({
      queryKey: [queryKey.post, postId],
      queryFn: async () => {
        const response = await api.posts[":id"].$get({ param: { id: postId } });
        return await response.json();
      },
    });
  },
  useCreatePost: () => {
    return useMutation({
      mutationFn: api.posts.$post,
    });
  },
  useUpdatePost: () => {
    return useMutation({
      mutationFn: api.posts[":id"].$put,
    });
  },
  useDeletePost: () => {
    return useMutation({
      mutationFn: api.posts[":id"].$delete,
    });
  },
  useComments: (postId: string) => {
    return useQuery({
      queryKey: [queryKey.comment, postId],
      queryFn: async () => {
        const response = await api.posts[":id"].comments.$get({
          param: { id: postId },
        });
        return await response.json();
      },
    });
  },
  useCreateComment: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.posts[":id"].comments.$post,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [queryKey.comment],
        });
      },
    });
  },
  useDeleteComment: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.posts[":id"].comments[":commentId"].$delete,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [queryKey.comment],
        });
      },
    });
  },
  useReportPost: () => {
    return useMutation({
      mutationFn: api.posts[":id"].report.$post,
    });
  },
  useLikePost: () => {
    return useMutation({
      mutationFn: api.posts[":id"].like.$post,
    });
  },
  useUnlikePost: () => {
    return useMutation({
      mutationFn: api.posts[":id"].like.$delete,
    });
  },
};
