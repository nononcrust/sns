import { useState } from "react";

export const useInput = (defaultValue?: string) => {
  const [value, setValue] = useState(defaultValue ?? "");

  const onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setValue(event.target.value);
  };

  return {
    value,
    onChange,
    setValue,
  };
};
