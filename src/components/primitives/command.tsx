"use client";

import { createContextFactory } from "@/lib/context";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

const SELECTOR = {
  SELECTED_ITEM: `[data-selected="true"]`,
} as const;

const EVENT_KEY = {
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  ENTER: "Enter",
} as const;

type CommandContextValue = {
  selectedItem: HTMLElement | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  listRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
};

const [CommandContext, useCommandContext] = createContextFactory<CommandContextValue>("Command");

const CommandProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<HTMLElement | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <CommandContext.Provider value={{ selectedItem, setSelectedItem, listRef, inputRef }}>
      <CommandRoot>{children}</CommandRoot>
    </CommandContext.Provider>
  );
};

const CommandRoot = ({ children }: { children: React.ReactNode }) => {
  const { inputRef } = useCommandContext();

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="select-none" onMouseDown={onMouseDown}>
      {children}
    </div>
  );
};

interface CommandListProps extends React.ComponentPropsWithoutRef<"div"> {}

const CommandList = ({ className, children, ...props }: CommandListProps) => {
  const { listRef, setSelectedItem } = useCommandContext();
  const { getSelectedItem, getFirstItem } = useCommand();

  useEffect(() => {
    const selectedItem = getSelectedItem();

    if (!selectedItem) {
      const firstItem = getFirstItem();

      if (firstItem) {
        setSelectedItem(firstItem);
      }
    }
  }, [getFirstItem, getSelectedItem, setSelectedItem]);

  return (
    <div role="listbox" className={className} ref={listRef} {...props}>
      {children}
    </div>
  );
};

interface CommandItemProps extends React.ComponentPropsWithoutRef<"button"> {}

const CommandItem = ({ className, children, ...props }: CommandItemProps) => {
  const id = useId();

  const ref = useRef<HTMLButtonElement>(null);

  const { selectedItem, setSelectedItem } = useCommandContext();

  const isSelected = !!selectedItem && selectedItem.getAttribute("data-selectable-item-id") === id;

  const select = () => {
    if (!ref.current) return;

    setSelectedItem(ref.current);
  };

  return (
    <button
      onClick={select}
      className={className}
      ref={ref}
      role="option"
      data-selectable-item-id={id}
      data-selected={isSelected}
      aria-selected={isSelected}
      onPointerMove={select}
      {...props}
    >
      {children}
    </button>
  );
};

interface CommandInputProps extends React.ComponentPropsWithoutRef<"input"> {}

const CommandInput = ({ className, ...props }: CommandInputProps) => {
  const { inputRef } = useCommandContext();
  const { onKeyDown } = useCommand();

  return <input className={className} ref={inputRef} onKeyDown={onKeyDown} {...props} />;
};

export const useCommand = () => {
  const { setSelectedItem, listRef } = useCommandContext();

  const getSelectedItem = useCallback((): HTMLElement | null => {
    if (!listRef.current) return null;

    const selectedItem = listRef.current?.querySelector<HTMLElement>(SELECTOR.SELECTED_ITEM);
    return selectedItem;
  }, [listRef]);

  const getFirstItem = useCallback(() => {
    if (!listRef.current) return null;

    return listRef.current.firstElementChild as HTMLElement | null;
  }, [listRef]);

  const getNextItem = useCallback((): HTMLElement | null => {
    const selectedItem = getSelectedItem();

    if (!selectedItem) return null;

    const nextElement = selectedItem.nextElementSibling;

    if (nextElement instanceof HTMLElement) {
      return nextElement;
    }

    return null;
  }, [getSelectedItem]);

  const getPrevItem = useCallback(() => {
    const selectedItem = getSelectedItem();

    if (!selectedItem) return null;

    const prevElement = selectedItem.previousElementSibling;

    if (prevElement instanceof HTMLElement) {
      return prevElement;
    }

    return null;
  }, [getSelectedItem]);

  const selectItemWithKeyboard = (item: HTMLElement) => {
    setSelectedItem(item);

    item.scrollIntoView({ block: "nearest" });
  };

  const onArrowUp = useCallback(() => {
    const selectedItem = getSelectedItem();

    if (selectedItem === null) {
      const firstItem = getFirstItem();

      if (firstItem) {
        return selectItemWithKeyboard(firstItem);
      }
    }

    const prevItem = getPrevItem();

    if (prevItem) {
      selectItemWithKeyboard(prevItem);
    }
  }, [getFirstItem, getPrevItem, getSelectedItem, setSelectedItem]);

  const onEnter = useCallback(() => {
    const selectedItem = getSelectedItem();

    if (selectedItem) {
      selectedItem.click();
    }
  }, [getSelectedItem]);

  const onArrowDown = useCallback(() => {
    const selectedItem = getSelectedItem();

    if (selectedItem === null) {
      const firstItem = getFirstItem();

      if (firstItem) {
        return selectItemWithKeyboard(firstItem);
      }
    }

    const nextItem = getNextItem();

    if (nextItem) {
      selectItemWithKeyboard(nextItem);
    }
  }, [getFirstItem, getSelectedItem, getNextItem, setSelectedItem]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.key === EVENT_KEY.ARROW_DOWN && !event.nativeEvent.isComposing) {
        event.preventDefault();
        onArrowDown();
      }

      if (event.key === EVENT_KEY.ARROW_UP && !event.nativeEvent.isComposing) {
        event.preventDefault();
        onArrowUp();
      }

      if (event.key === EVENT_KEY.ENTER && !event.nativeEvent.isComposing) {
        event.preventDefault();
        onEnter();
      }
    },
    [onArrowDown, onArrowUp, onEnter],
  );

  return {
    onKeyDown,
    getSelectedItem,
    getFirstItem,
    getNextItem,
    getPrevItem,
  };
};

export const Command = Object.assign(CommandProvider, {
  Input: CommandInput,
  List: CommandList,
  Item: CommandItem,
});
