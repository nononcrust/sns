"use client";

import { useParams } from "next/navigation";

export default function PasswordResetFormPage() {
  const params = useParams<{ token: string }>();

  return (
    <main>
      <input />
    </main>
  );
}
