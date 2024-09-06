import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/editor";
import { initialEditorValue, useEditor } from "@/features/editor/use-editor";
import { cn } from "@/lib/utils";
import { postService } from "@/services/post";
import { ImageIcon } from "lucide-react";

interface CommentInputProps {
  className?: string;
  postId: string;
}

export const CommentInput = ({ className, postId }: CommentInputProps) => {
  const editor = useEditor();

  const createCommentMutation = postService.useCreateComment();

  const onSubmit = () => {
    if (createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      {
        json: {
          content: editor.value,
        },
        param: {
          id: postId,
        },
      },
      {
        onSuccess: () => {
          editor.reset();
        },
      },
    );
  };

  const canSubmit = editor.value !== initialEditorValue && !createCommentMutation.isPending;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="rounded-xl bg-content p-3 px-4">
        <Editor value={editor.value} onChange={editor.onChange} key={editor.key} />
        <div className="mt-4 flex items-center justify-between">
          <ImageIcon className="text-subtle size-6" />
          <div className="flex gap-2">
            <Button disabled={!canSubmit} variant="outlined" onClick={onSubmit}>
              댓글 달기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
