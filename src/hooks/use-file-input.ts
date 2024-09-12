import { useState } from "react";

export const useFileInput = (defaultValue?: File) => {
  const [value, setValue] = useState(defaultValue ?? null);

  const onChange = (value: File | null) => {
    setValue(value);
  };

  return {
    value,
    onChange,
    setValue,
  };
};
