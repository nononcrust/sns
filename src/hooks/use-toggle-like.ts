import { postService } from "@/services/post";
import { useState } from "react";

interface UseToggleLikeProps {
  initialIsLiked: boolean;
  initialLikeCount: number;
  postId: string;
}

export const useToggleLike = ({ initialIsLiked, initialLikeCount, postId }: UseToggleLikeProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const likeMutation = postService.useLikePost();
  const unlikeMutation = postService.useUnlikePost();

  const toggleLike = () => {
    if (isLiked) {
      unlikeMutation.mutate(
        {
          param: { id: postId },
        },
        {
          onError: () => {
            setIsLiked(true);
            setLikeCount((prev) => prev + 1);
          },
        },
      );

      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    }

    if (!isLiked) {
      likeMutation.mutate(
        {
          param: { id: postId },
        },
        {
          onError: () => {
            setIsLiked(false);
            setLikeCount((prev) => prev - 1);
          },
        },
      );

      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  return { isLiked, likeCount, toggleLike };
};
