import React from "react";
import MetaDataContext, { MetaDataProps } from "./meta-data-context";

export default function useMetaData(): MetaDataProps {
  const context = React.useContext(MetaDataContext);

  if (!context)
    throw new Error("useMetaData should only be used inside <MetaDataProvider />");

  return context;
}
