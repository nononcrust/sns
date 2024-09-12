import { useState } from "react";

export const useRadioGroup = (defaultValue?: string) => {
  const [value, setValue] = useState(defaultValue ?? "");

  const onChange = (value: string) => {
    setValue(value);
  };

  return {
    value,
    onChange,
  };
};
