"use client";

import { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchInputProps {
  onSearch: Dispatch<SetStateAction<string>>; // Pastikan tipe ini benar
}

const SearchInput = ({ onSearch }: SearchInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="relative flex justify-center md:w-1/2 mx-auto">
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input
        placeholder="Search"
        className="pl-10 bg-primary/10"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchInput;
export type { SearchInputProps }; // Ekspor tipe props
