import React from "react";
import { SelectOption } from "@/types/common";

export type ResourceSelectOptions = Array<SelectOption>;
export type ReservationStatusSelectOptions = Array<SelectOption>;
export type FacilityKindSelectOptions = Array<SelectOption>;
export type ProductCategorySelectOptions = Array<SelectOption>;

export interface MetaDataProps {
  resourceSelectOptions: ResourceSelectOptions;
  reservationStatusSelectOptions: ReservationStatusSelectOptions;
  facilityKindSelectOptions: FacilityKindSelectOptions;
  productCategorySelectOptions: ProductCategorySelectOptions;
}

const MetaDataContext = React.createContext<MetaDataProps | undefined>(undefined);

export default MetaDataContext;
