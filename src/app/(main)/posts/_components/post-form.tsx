"use client";

import { ImageInput } from "@/components/shared/image-input";
import { ImagePreview } from "@/components/shared/image-preview";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { route } from "@/constants/route";
import { testId } from "@/constants/test";
import { Editor } from "@/features/editor/editor";
import { initialEditorValue } from "@/features/editor/use-editor";
import { useImageInput } from "@/hooks/use-image-input";
import { postService } from "@/services/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요" }),
  content: z
    .string()
    .refine((value) => value !== initialEditorValue, { message: "내용을 입력해주세요" }),
  tags: z.array(z.string()),
});

interface PostFormProps {
  mode: "create" | "edit";
  defaultValues?: {
    title?: string;
    content?: string;
    tags?: string[];
  };
}

export const PostForm = ({ mode, defaultValues }: PostFormProps) => {
  const createPostMutation = postService.useCreatePost();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: initialEditorValue,
      tags: [],
      ...defaultValues,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (createPostMutation.isPending) return;

    createPostMutation.mutate(
      {
        form: {
          title: data.title,
          content: data.content,
          ...(imageInput.value && { image: imageInput.value }),
          ...(imageInput.alt.value.length > 0 && { alt: imageInput.alt.value }),
        },
      },
      {
        onSuccess: () => {
          router.push(route.post.list);
        },
      },
    );
  });

  const canSubmit =
    !createPostMutation.isPending && !createPostMutation.isSuccess && form.formState.isValid;

  const imageInput = useImageInput();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col px-page pb-8">
      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
        <Form {...form}>
          <div className="flex justify-end">
            <Button
              variant="outlined"
              type="submit"
              disabled={!canSubmit}
              data-testid={testId.post.create.submitButton}
            >
              {mode === "create" && "작성하기"}
              {mode === "edit" && "수정하기"}
            </Button>
          </div>
          <Form.Field
            name="title"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Control>
                  <input
                    className="text-2xl font-semibold focus:outline-none"
                    placeholder="제목을 입력해주세요."
                    {...field}
                    data-testid={testId.post.create.titleInput}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <Form.Field
            name="content"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Control>
                  <Editor
                    className="min-h-24"
                    value={field.value}
                    onChange={field.onChange}
                    data-testid={testId.post.create.contentInput}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
        </Form>
      </form>
      <ImagePreview
        className="mt-4"
        value={imageInput.value}
        onRemove={imageInput.onRemove}
        buttonRef={imageInput.buttonRef}
        alt={{
          value: imageInput.alt.value,
          onChange: imageInput.alt.setValue,
        }}
      />
      <ImageInput
        className="mt-4"
        onChange={imageInput.onChange}
        buttonRef={imageInput.buttonRef}
      />
    </main>
  );
};
