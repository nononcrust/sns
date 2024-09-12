import { ImageInput } from "@/components/shared/image-input";
import { ImagePreview } from "@/components/shared/image-preview";
import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/editor";
import { initialEditorValue, useEditor } from "@/features/editor/use-editor";
import { useImageInput } from "@/hooks/use-image-input";
import { cn } from "@/lib/utils";
import { postService } from "@/services/post";

interface CommentInputProps {
  className?: string;
  postId: string;
}

export const CommentInput = ({ className, postId }: CommentInputProps) => {
  const editor = useEditor();

  const imageInput = useImageInput();

  const createCommentMutation = postService.useCreateComment();

  const onSubmit = () => {
    if (createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      {
        form: {
          content: editor.value,
          ...(imageInput.value && { image: imageInput.value }),
        },
        param: {
          id: postId,
        },
      },
      {
        onSuccess: () => {
          editor.reset();
          imageInput.reset();
        },
      },
    );
  };

  const isEmpty = editor.value === initialEditorValue && !imageInput.value;

  const canSubmit = !isEmpty && !createCommentMutation.isPending;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="rounded-xl bg-content p-3 px-4">
        <Editor value={editor.value} onChange={editor.onChange} key={editor.key} />
        <ImagePreview
          className="mt-4 w-1/2"
          value={imageInput.value}
          onRemove={imageInput.onRemove}
          buttonRef={imageInput.buttonRef}
        />
        <div className="mt-4 flex items-center justify-between">
          <ImageInput onChange={imageInput.onChange} buttonRef={imageInput.buttonRef} />
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
