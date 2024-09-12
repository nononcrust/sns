"use client";

import { useState } from "react";

const list = [
  "사과1",
  "사과2",
  "사과3",
  "바나나",
  "포도",
  "딸기",
  "수박",
  "참외",
  "키위",
  "복숭아",
  "망고",
  "파인애플",
];

export default function CommandPage() {
  const [event, setEvent] = useState<React.KeyboardEvent<HTMLInputElement>[]>([]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {};

  return (
    <main className="flex h-dvh items-center justify-center">
      <input className="border border-red-500" onKeyDown={onKeyDown} />
    </main>
  );
}
