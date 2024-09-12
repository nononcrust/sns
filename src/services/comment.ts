import { useMutation } from "@tanstack/react-query";
import { api } from "./shared";

export const commentService = {
  useReportComment: () => {
    return useMutation({
      mutationFn: api.comments[":id"].report.$post,
    });
  },
};
