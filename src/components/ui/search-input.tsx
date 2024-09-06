import { Input } from "./input";

interface SearchInputProps {
  onSearch: (search: string) => void;
}

export const SearchInput = ({ onSearch }: SearchInputProps) => {
  return <Input />;
};
