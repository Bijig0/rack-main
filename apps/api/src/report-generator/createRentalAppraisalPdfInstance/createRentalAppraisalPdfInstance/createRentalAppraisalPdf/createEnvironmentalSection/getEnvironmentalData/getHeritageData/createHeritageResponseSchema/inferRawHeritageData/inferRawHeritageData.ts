import z from "zod";
import { HeritageFeature, InferredHeritageData } from "./types";

type Args = {
  features: HeritageFeature[];
};

type Return = {
  inferredHeritageData: InferredHeritageData[];
};

const stringToDate = z.string().pipe(z.coerce.date());

const numberToString = z.coerce.string();

export function inferRawHeritageData({ features }: Args): Return {
  const inferredHeritageData = features.map((feature) => {
    const { properties } = feature;

    const dateRegistered = properties.ufi_created;
    const parsedDateRegistered = stringToDate.parse(dateRegistered);
    const heritageObject = properties.heritage_object;
    const siteName = properties.site_name;
    const vhiNumber = properties.vhi_num;
    const heritageManagementNumber = numberToString.parse(properties.id);
    const ufiNumber = numberToString.parse(properties.ufi);
    const vdpId = numberToString.parse(properties.vdpid);

    return {
      dateRegistered: parsedDateRegistered,
      heritageObject,
      siteName,
      vhiNumber,
      heritageManagementNumber,
      ufiNumber,
      vdpId,
    } satisfies InferredHeritageData;
  });

  return {
    inferredHeritageData,
  };
}
