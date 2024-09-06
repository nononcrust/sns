import { useState } from "react";

export const useDialog = (defaultIsOpen?: boolean) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen ?? false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  const onClose = () => {
    close();
  };

  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return {
    isOpen,
    open,
    close,
    toggle,
    onClose,
    onOpenChange,
  };
};
