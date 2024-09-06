import { format } from "date-fns";

export const formatRelativeTime = (isoDateString: string) => {
  const date = new Date(isoDateString);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "방금 전";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)}주 전`;
  }

  if (diffInDays < 365) {
    return `${Math.floor(diffInDays / 30)}달 전`;
  }

  return `${Math.floor(diffInDays / 365)}년 전`;
};

export const formatDateTime = (isoDateString: string) => {
  return format(new Date(isoDateString), "yyyy.MM.dd HH:mm");
};
