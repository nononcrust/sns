import { useRadioGroup } from "@/hooks/use-radio-group";
import { objectEntries } from "@/lib/utils";
import { commentService } from "@/services/comment";
import { postService } from "@/services/post";
import { ReportType } from "@prisma/client";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { RadioGroup } from "../ui/radio-group";

type ReportDialogType = "post" | "comment";

const TYPE_LABEL: Record<ReportDialogType, string> = {
  post: "게시글",
  comment: "댓글",
};

const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  SPAM: "스팸/광고",
  ABUSIVE_LANGUAGE: "욕설/비속어",
  EXPLICIT_CONTENT: "음란물",
  INAPPROPRIATE_IMAGE: "부적절한 이미지",
  INAPPROPRIATE_NICKNAME: "부적절한 닉네임",
  OFF_TOPIC: "주제와 무관한 내용",
  PERSONAL_INFORMATION: "개인정보 유출",
};

interface ReportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  id: string;
  type: ReportDialogType;
}

export const ReportDialog = ({ isOpen, onOpenChange, id, type }: ReportDialogProps) => {
  const radioGroup = useRadioGroup<ReportType>(ReportType.SPAM);

  const reportPostMutation = postService.useReportPost();
  const reportCommentMutation = commentService.useReportComment();

  const onSuccess = () => {
    onOpenChange(false);
    toast.success("신고가 완료되었습니다.");
  };

  const reportPost = () => {
    if (reportPostMutation.isPending) return;

    reportPostMutation.mutate(
      {
        param: { id },
        json: {
          type: radioGroup.value,
        },
      },
      { onSuccess },
    );
  };

  const reportComment = () => {
    if (reportCommentMutation.isPending) return;

    reportCommentMutation.mutate(
      {
        param: { id },
        json: {
          type: radioGroup.value,
        },
      },
      { onSuccess },
    );
  };

  const onSubmit = () => {
    if (type === "post") {
      reportPost();
    }

    if (type === "comment") {
      reportComment();
    }
  };

  const submitButtonDisabled = reportPostMutation.isPending || reportCommentMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content className="w-[400px]">
        <Dialog.Title>{TYPE_LABEL[type]} 신고</Dialog.Title>
        <Dialog.Description>신고 사유를 선택해주세요.</Dialog.Description>
        <RadioGroup value={radioGroup.value} onChange={radioGroup.onChange}>
          {objectEntries(REPORT_TYPE_LABEL).map(([value, label]) => (
            <RadioGroup.Item key={value} value={value}>
              {label}
            </RadioGroup.Item>
          ))}
        </RadioGroup>
        <Dialog.Footer className="mt-2 justify-end gap-2">
          <Button variant="outlined" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={submitButtonDisabled}>
            신고하기
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
