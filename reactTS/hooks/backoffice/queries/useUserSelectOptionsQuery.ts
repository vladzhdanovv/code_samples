import useSearch, { SEARCH_BY_OPTIONS } from "@/hooks/useSearch";
import { useQuery } from "@tanstack/react-query";
import { allUsersRequest, UserType } from "@/api/backoffice/endpoints/users/all";
import { useEffect, useMemo } from "react";
import { SelectOption } from "@/types/common";

interface UserSelectOptionsPropsType {
  selectedUserId: null | number;
  onSelect?: (User: null | UserType) => void
}

const useUserSelectOptionsQuery = (props: UserSelectOptionsPropsType) => {
  const search = useSearch();

  const { data, isFetching } = useQuery({
    enabled: !!search.debouncedQuery,
    queryKey: ["user-select-options", {
      page: 1,
      pageSize: 10,
      searchBy: search.debouncedSearchBy,
      searchQuery: search.debouncedQuery
    }],
    queryFn: () => allUsersRequest(1, 10, search.debouncedSearchBy, search.debouncedQuery)
  });

  const selectOptions: Array<SelectOption> = useMemo(() => {
    return data?.data ? data.data.map(customer => ({
      value: customer.id,
      label: customer.full_name
    })) : [];
  }, [data]);

  const selectedUser = useMemo(() => {
    return data?.data.find(item => item.id === props.selectedUserId) ?? null;
  }, [data]);

  useEffect(() => {
    if (!!props.selectedUserId) {
      search.set(SEARCH_BY_OPTIONS.ID, props.selectedUserId.toString());
    }
  }, [props.selectedUserId])

  useEffect(() => {
    props.onSelect && props.onSelect(selectedUser);
  }, [selectedUser])

  const handleSearch = (value: string) => {
    search.set(SEARCH_BY_OPTIONS.DEFAULT, value);
  };

  return {
    isFetching,
    selectedUser,
    selectOptions,
    handleSearch
  };
};

export default useUserSelectOptionsQuery;
