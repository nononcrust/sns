import { useState } from "react";

export const useTab = (defaultValue?: string) => {
  const [value, setValue] = useState<string>(defaultValue ?? "");

  const onChange = (value: string) => {
    setValue(value);
  };

  return {
    value,
    onChange,
  };
};
