import { useState } from "react";

export const useRadioGroup = <T extends string>(defaultValue?: T) => {
  const [value, setValue] = useState<T>(defaultValue ?? ("" as T));

  const onChange = (value: string) => {
    setValue(value as T);
  };

  return {
    value,
    onChange,
  };
};
