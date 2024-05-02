import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

export const DEFAULT_SEARCH_BY_OPTION = "all";

export const SEARCH_BY_OPTIONS = {
  DEFAULT: 'all',
  ID: 'id',
}

interface SearchPropsType {
  delay?: number;
  onChange?: (searchBy: string, query: string) => void
}

const defaultProps: SearchPropsType = {
  delay: 1000,
}

const DEFAULT_DELAY = 1000;

const useSearch = (props: SearchPropsType = defaultProps) => {
  const [searchBy, setSearchBy] = useState(DEFAULT_SEARCH_BY_OPTION);
  const [query, setQuery] = useState("");

  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [debouncedSearchBy, setDebouncedSearchBy] = useState(DEFAULT_SEARCH_BY_OPTION);

  const handleDebounce = (newSearchBy: string, newQuery: string) => {
    setDebouncedSearchBy(newSearchBy);
    setDebouncedQuery(newQuery);
    props.onChange && props.onChange(newSearchBy, newQuery);
  };

  const onQueryDebounced = useCallback(debounce(handleDebounce, props.delay ?? DEFAULT_DELAY), [props.delay]);

  useEffect(() => {
    onQueryDebounced(searchBy, query);
  }, [searchBy, query]);

  const set = (searchBy: string, query: string) => {
    setSearchBy(searchBy);
    setQuery(query);
  }

  const reset = () => {
    setQuery("");
    setSearchBy(DEFAULT_SEARCH_BY_OPTION);
  };

  return {
    debouncedQuery,
    query,
    setQuery,
    debouncedSearchBy,
    searchBy,
    setSearchBy,
    set,
    reset
  };
};

export default useSearch;
