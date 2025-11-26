import { Effect, pipe } from "effect";
import * as O from "effect/Option";
import { z } from "zod";
import { Address } from "../../../../../../shared/types";
import { trySources } from "./getYearBuilt/trySources/trySources";
import { getReportCache } from "./utils/createReportCache";
import { PropertyInfo } from "./utils/types";
import { Fetcher } from "./utils/types/scraper";

type PropertyInfoFnArgs = {
  address: Address;
};

type PropertyInfoFn<TReturnData> = (
  args: PropertyInfoFnArgs
) => Effect.Effect<TReturnData, Error>;

export type DataName = keyof PropertyInfo;

type CreatePropertyInfoGetterArgs<TSchema extends z.ZodObject<any>> = {
  schema: TSchema;
  sourceFns: Fetcher<z.infer<TSchema>>[];
};

// Generic function creator
export const createPropertyInfoGetter = <TSchema extends z.ZodObject<any>>({
  schema,
  sourceFns,
}: CreatePropertyInfoGetterArgs<TSchema>): PropertyInfoFn<z.infer<TSchema>> => {
  return ({ address }) => {
    const cache = getReportCache();

    // Extract the single key from the schema at runtime
    const schemaKeys = Object.keys(schema.shape);
    if (schemaKeys.length !== 1) {
      throw new Error(
        `Schema must have exactly one key, but got ${schemaKeys.length}: ${schemaKeys.join(", ")}`
      );
    }
    const dataName = schemaKeys[0] as DataName;

    return pipe(
      trySources(cache, address, sourceFns, {
        dataName,
      }),
      Effect.flatMap((optionData) =>
        O.isSome(optionData)
          ? Effect.succeed(optionData.value)
          : Effect.succeed({ [dataName]: null })
      ),
      Effect.flatMap((data) =>
        Effect.try({
          try: () => schema.parse(data),
          catch: (error) =>
            new Error(`${dataName} validation failed: ${error}`),
        })
      )
    );
  };
};
