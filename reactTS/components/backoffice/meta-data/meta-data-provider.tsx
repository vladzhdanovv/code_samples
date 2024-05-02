import React, { useMemo } from "react";

import MetaDataContext, {
  ResourceSelectOptions,
  ReservationStatusSelectOptions,
  FacilityKindSelectOptions,
  ProductCategorySelectOptions,
} from "./meta-data-context";
import { useQuery } from "@tanstack/react-query";
import { allMetaDataRequest } from "@/api/backoffice/endpoints/meta-data/all";
import { Spin } from "antd";
import useAuth from "@/components/backoffice/auth/use-auth";

interface Props {
  children: React.ReactNode;
}

const MetaDataProvider: React.FC<Props> = ({ children }) => {
  const {authenticated} = useAuth();

  const metaDataQuery = useQuery({
    enabled: !!authenticated,
    queryKey: ['META_DATA'],
    queryFn: () => allMetaDataRequest()
  });

  const resourceSelectOptions: ResourceSelectOptions = useMemo(() => metaDataQuery.data ? metaDataQuery.data.resources.map(resource => ({
    value: resource.id,
    label: resource.name
  })) : [], [metaDataQuery.data])

  const reservationStatusSelectOptions: ReservationStatusSelectOptions = useMemo(() => metaDataQuery.data
    ? metaDataQuery.data.reservation_statuses.map(reservationStatus => ({
    value: reservationStatus.id,
    label: reservationStatus.name
  })) : [], [metaDataQuery.data])

  const facilityKindSelectOptions: FacilityKindSelectOptions = useMemo(() => metaDataQuery.data
    ? metaDataQuery.data.facility_kinds.map(facilityKind => ({
      value: facilityKind.id,
      label: facilityKind.name
    })) : [], [metaDataQuery.data])

  const productCategorySelectOptions: ProductCategorySelectOptions = useMemo(() => metaDataQuery.data
    ? metaDataQuery.data.product_categories.map(productCategory => ({
      value: productCategory.id,
      label: `[${productCategory.resource.name}]: ${productCategory.name}`
    })) : [], [metaDataQuery.data])

  if (metaDataQuery.isFetching) {
    return (
      <Spin tip={"Meta data loading..."} fullscreen/>
    )
  }

  return (
    <MetaDataContext.Provider
      value={{
        resourceSelectOptions,
        reservationStatusSelectOptions,
        facilityKindSelectOptions,
        productCategorySelectOptions,
      }}
    >
      {children}
    </MetaDataContext.Provider>
  );
};

export default MetaDataProvider;
