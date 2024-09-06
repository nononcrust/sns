"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { route } from "@/constants/route";
import { testId } from "@/constants/test";
import { Editor } from "@/features/editor/editor";
import { postService } from "@/services/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요" }),
  content: z.string().min(1, { message: "내용을 입력해주세요" }),
  tags: z.array(z.string()),
});

export default function PostAddPage() {
  const createPostMutation = postService.useCreatePost();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (createPostMutation.isPending) return;

    createPostMutation.mutate(
      {
        json: {
          title: data.title,
          content: data.content,
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

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col">
      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
        <Form {...form}>
          <div className="flex justify-end">
            <Button
              variant="outlined"
              type="submit"
              disabled={!canSubmit}
              data-testid={testId.post.create.submitButton}
            >
              작성하기
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
    </main>
  );
}
