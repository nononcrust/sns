import { useState } from "react";

export const usePagination = () => {
  const [value, setValue] = useState(1);

  const onChange = (page: number) => {
    setValue(page);
  };

  return {
    value,
    onChange,
  };
};
