import { formatRelativeTime } from "@/lib/date";
import { describe, expect, it } from "vitest";

describe("formatRelativeTime", () => {
  it("방금 전을 반환해야 한다", () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe("방금 전");
  });

  it("몇 분 전을 반환해야 한다", () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5); // 5분 전
    expect(formatRelativeTime(date.toISOString())).toBe("5분 전");
  });

  it("몇 시간 전을 반환해야 한다", () => {
    const date = new Date();
    date.setHours(date.getHours() - 3); // 3시간 전
    expect(formatRelativeTime(date.toISOString())).toBe("3시간 전");
  });

  it("몇 일 전을 반환해야 한다", () => {
    const date = new Date();
    date.setDate(date.getDate() - 2); // 2일 전
    expect(formatRelativeTime(date.toISOString())).toBe("2일 전");
  });

  it("몇 주 전을 반환해야 한다", () => {
    const date = new Date();
    date.setDate(date.getDate() - 10); // 1주 전
    expect(formatRelativeTime(date.toISOString())).toBe("1주 전");
  });

  it("몇 달 전을 반환해야 한다", () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 2); // 2달 전
    expect(formatRelativeTime(date.toISOString())).toBe("2달 전");
  });

  it("몇 년 전을 반환해야 한다", () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 3); // 3년 전
    expect(formatRelativeTime(date.toISOString())).toBe("3년 전");
  });
});
