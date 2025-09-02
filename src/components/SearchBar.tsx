import { ChangeEventHandler } from 'react';
import { IconInput } from './ui/input';
import { SearchIcon } from 'lucide-react';

type Props = {
  filter: string;
  setFilter: (value: string) => void;
  placeholder?: string;
};

function SearchBar({ filter, setFilter, placeholder = 'Search' }: Props) {
  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFilter(e.currentTarget.value);
  };

  return (
    <div className="py-2 w-full flex flex-col gap-4 items-center justify-center">
      <IconInput
        name="search"
        parentClassName="w-full"
        placeholder={placeholder}
        icon={SearchIcon}
        value={filter}
        onChange={onChangeHandler}
      />
    </div>
  );
}

export default SearchBar;
