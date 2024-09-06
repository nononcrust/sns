import { useState } from "react";

export const useFileInput = (defaultValue?: File) => {
  const [value, setValue] = useState(defaultValue ?? null);

  const onChange = (value: File) => {
    setValue(value);
  };

  return {
    value,
    onChange,
    setValue,
  };
};
