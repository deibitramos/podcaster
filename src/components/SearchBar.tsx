import { ChangeEventHandler } from 'react';
import { IconInput } from './ui/input';
import { SearchIcon } from 'lucide-react';

type Props = { filter: string; setFilter: (value: string) => void };

function SearchBar({ filter, setFilter }: Props) {
  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFilter(e.currentTarget.value);
  };

  return (
    <div className="p-2 flex flex-col gap-4 items-center justify-center">
      <IconInput
        name="search"
        parentClassName="w-full"
        placeholder="Search"
        icon={SearchIcon}
        value={filter}
        onChange={onChangeHandler}
      />
    </div>
  );
}

export default SearchBar;
