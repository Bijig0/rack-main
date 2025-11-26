// schemas/property-valuation.schema.ts
import { z } from "zod";

const API_URL =
  "https://propertyhub.corelogic.asia/clspa-gateway/propertyhub/user/property/16062963/insights";

// Sale Record Schema
export const SaleRecordSchema = z.object({
  price: z.number().positive(),
  contractDate: z.string(), // Format: YYYY-MM-DD
  isAgentsAdvice: z.boolean(),
  settlementDate: z.string().optional().nullable(), // Format: YYYY-MM-DD
  transferId: z.number(),
  type: z.string(), // e.g., "Unknown", "Sale", "Private Treaty"
});

// Rental AVM Detail Schema
export const RentalAvmDetailSchema = z.object({
  rentalAvmEstimate: z.number().positive(),
  rentalAvmEstimateFsdScore: z.number().min(0).max(100),
  rentalAvmEstimateHigh: z.number().positive(),
  rentalAvmEstimateLow: z.number().positive(),
  rentalAvmPeriod: z.enum(["W", "M", "Y"]), // W = Weekly, M = Monthly, Y = Yearly
  rentalAvmRunDate: z.string().datetime(),
  rentalAvmScore: z.number().min(0).max(100),
  rentalAvmValuationDate: z.string(), // Format: YYYY-MM-DD
  rentalAvmYield: z.number(),
  rentalAvmYieldFsdScore: z.number().min(0).max(100),
});

// Site Information Schema
export const SiteSchema = z.object({
  landUsePrimary: z.string(),
  maoriLand: z.boolean().nullable(),
  zoneCodeLocal: z.string(),
  zoneDescriptionLocal: z.string(),
  siteValueList: z.array(z.unknown()).nullable(), // Define based on actual structure
});

// Static Consumer AVM Schema
export const StaticConsumerAvmSchema = z.object({
  estimate: z.number().positive(),
  lowEstimate: z.number().positive(),
  highEstimate: z.number().positive(),
  fsd: z.number().min(0).max(100), // Forecast Standard Deviation
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  valuationDate: z.string(), // Format: YYYY-MM-DD
});

// Complete Property Valuation Schema
export const PropertyValuationSchema = z.object({
  propertyId: z.number(),
  propertyType: z.enum([
    "HOUSE",
    "APARTMENT",
    "UNIT",
    "TOWNHOUSE",
    "VILLA",
    "LAND",
    "OTHER",
  ]),
  saleList: z.array(SaleRecordSchema),
  rentalAvmDetail: RentalAvmDetailSchema.optional().nullable(),
  site: SiteSchema.optional().nullable(),
  staticConsumerAVM: StaticConsumerAvmSchema.optional().nullable(),
});

// Extended Property Valuation with additional computed fields
export const ExtendedPropertyValuationSchema = PropertyValuationSchema.extend({
  mostRecentSale: SaleRecordSchema.optional(),
  saleHistory: z
    .object({
      totalSales: z.number(),
      averagePrice: z.number().optional(),
      priceAppreciation: z.number().optional(), // Percentage
      firstSaleDate: z.string().optional(),
      lastSaleDate: z.string().optional(),
    })
    .optional(),
  valuationSummary: z
    .object({
      estimatedValue: z.number(),
      estimatedRentWeekly: z.number().optional(),
      estimatedRentMonthly: z.number().optional(),
      rentalYield: z.number().optional(),
      confidenceLevel: z.enum(["HIGH", "MEDIUM", "LOW"]),
      lastValuationDate: z.string(),
    })
    .optional(),
});

// Simplified Valuation Summary (for reports)
export const ValuationSummarySchema = z.object({
  propertyId: z.number(),
  currentEstimate: z.object({
    value: z.number(),
    lowRange: z.number(),
    highRange: z.number(),
    confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
    valuationDate: z.string(),
  }),
  rentalEstimate: z
    .object({
      weeklyRent: z.number(),
      lowRange: z.number(),
      highRange: z.number(),
      monthlyRent: z.number(),
      annualRent: z.number(),
      yield: z.number(),
      confidence: z.number(), // Score 0-100
    })
    .optional(),
  saleHistory: z
    .object({
      lastSalePrice: z.number(),
      lastSaleDate: z.string(),
      totalSales: z.number(),
    })
    .optional(),
  zoning: z
    .object({
      code: z.string(),
      description: z.string(),
      landUse: z.string(),
    })
    .optional(),
});

// Type exports
export type SaleRecord = z.infer<typeof SaleRecordSchema>;
export type RentalAvmDetail = z.infer<typeof RentalAvmDetailSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type StaticConsumerAvm = z.infer<typeof StaticConsumerAvmSchema>;
export type PropertyValuation = z.infer<typeof PropertyValuationSchema>;
export type ExtendedPropertyValuation = z.infer<
  typeof ExtendedPropertyValuationSchema
>;
export type ValuationSummary = z.infer<typeof ValuationSummarySchema>;

// Validation functions
export function validatePropertyValuation(data: unknown): PropertyValuation {
  return PropertyValuationSchema.parse(data);
}

export function validateExtendedPropertyValuation(
  data: unknown
): ExtendedPropertyValuation {
  return ExtendedPropertyValuationSchema.parse(data);
}

export function validateValuationSummary(data: unknown): ValuationSummary {
  return ValuationSummarySchema.parse(data);
}

// Helper functions
export function getMostRecentSale(sales: SaleRecord[]): SaleRecord | undefined {
  if (sales.length === 0) return undefined;

  return sales.reduce((latest, current) => {
    const latestDate = new Date(latest.contractDate);
    const currentDate = new Date(current.contractDate);
    return currentDate > latestDate ? current : latest;
  });
}

export function calculateAveragePrice(sales: SaleRecord[]): number {
  if (sales.length === 0) return 0;

  const total = sales.reduce((sum, sale) => sum + sale.price, 0);
  return Math.round(total / sales.length);
}

export function calculatePriceAppreciation(sales: SaleRecord[]): number | null {
  if (sales.length < 2) return null;

  const sorted = [...sales].sort(
    (a, b) =>
      new Date(a.contractDate).getTime() - new Date(b.contractDate).getTime()
  );

  const firstSale = sorted[0];
  const lastSale = sorted[sorted.length - 1];

  const appreciation =
    ((lastSale.price - firstSale.price) / firstSale.price) * 100;
  return Math.round(appreciation * 100) / 100;
}

export function convertRentalPeriod(
  amount: number,
  fromPeriod: "W" | "M" | "Y"
): { weekly: number; monthly: number; yearly: number } {
  let weekly: number;

  switch (fromPeriod) {
    case "W":
      weekly = amount;
      break;
    case "M":
      weekly = amount / 4.33;
      break;
    case "Y":
      weekly = amount / 52;
      break;
  }

  return {
    weekly: Math.round(weekly),
    monthly: Math.round(weekly * 4.33),
    yearly: Math.round(weekly * 52),
  };
}

export function calculateRentalYield(
  annualRent: number,
  propertyValue: number
): number {
  return Math.round((annualRent / propertyValue) * 10000) / 100;
}

// Transform function to create extended valuation with computed fields
export function extendPropertyValuation(
  valuation: PropertyValuation
): ExtendedPropertyValuation {
  const mostRecentSale = getMostRecentSale(valuation.saleList);
  const averagePrice = calculateAveragePrice(valuation.saleList);
  const priceAppreciation = calculatePriceAppreciation(valuation.saleList);

  const sorted = [...valuation.saleList].sort(
    (a, b) =>
      new Date(a.contractDate).getTime() - new Date(b.contractDate).getTime()
  );

  const rentalPeriods = valuation.rentalAvmDetail
    ? convertRentalPeriod(
        valuation.rentalAvmDetail.rentalAvmEstimate,
        valuation.rentalAvmDetail.rentalAvmPeriod
      )
    : undefined;

  return {
    ...valuation,
    mostRecentSale,
    saleHistory: {
      totalSales: valuation.saleList.length,
      averagePrice: valuation.saleList.length > 0 ? averagePrice : undefined,
      priceAppreciation: priceAppreciation ?? undefined,
      firstSaleDate: sorted[0]?.contractDate,
      lastSaleDate: sorted[sorted.length - 1]?.contractDate,
    },
    valuationSummary: valuation.staticConsumerAVM
      ? {
          estimatedValue: valuation.staticConsumerAVM.estimate,
          estimatedRentWeekly: rentalPeriods?.weekly,
          estimatedRentMonthly: rentalPeriods?.monthly,
          rentalYield: valuation.rentalAvmDetail?.rentalAvmYield,
          confidenceLevel: valuation.staticConsumerAVM.confidence,
          lastValuationDate: valuation.staticConsumerAVM.valuationDate,
        }
      : undefined,
  };
}

// Create a simple summary for reports
export function createValuationSummary(
  valuation: PropertyValuation
): ValuationSummary {
  const mostRecentSale = getMostRecentSale(valuation.saleList);
  const rentalPeriods = valuation.rentalAvmDetail
    ? convertRentalPeriod(
        valuation.rentalAvmDetail.rentalAvmEstimate,
        valuation.rentalAvmDetail.rentalAvmPeriod
      )
    : undefined;

  return {
    propertyId: valuation.propertyId,
    currentEstimate: {
      value: valuation.staticConsumerAVM?.estimate ?? 0,
      lowRange: valuation.staticConsumerAVM?.lowEstimate ?? 0,
      highRange: valuation.staticConsumerAVM?.highEstimate ?? 0,
      confidence: valuation.staticConsumerAVM?.confidence ?? "LOW",
      valuationDate: valuation.staticConsumerAVM?.valuationDate ?? "",
    },
    rentalEstimate:
      valuation.rentalAvmDetail && rentalPeriods
        ? {
            weeklyRent: rentalPeriods.weekly,
            lowRange: Math.round(
              convertRentalPeriod(
                valuation.rentalAvmDetail.rentalAvmEstimateLow,
                valuation.rentalAvmDetail.rentalAvmPeriod
              ).weekly
            ),
            highRange: Math.round(
              convertRentalPeriod(
                valuation.rentalAvmDetail.rentalAvmEstimateHigh,
                valuation.rentalAvmDetail.rentalAvmPeriod
              ).weekly
            ),
            monthlyRent: rentalPeriods.monthly,
            annualRent: rentalPeriods.yearly,
            yield: valuation.rentalAvmDetail.rentalAvmYield,
            confidence: valuation.rentalAvmDetail.rentalAvmScore,
          }
        : undefined,
    saleHistory: mostRecentSale
      ? {
          lastSalePrice: mostRecentSale.price,
          lastSaleDate: mostRecentSale.contractDate,
          totalSales: valuation.saleList.length,
        }
      : undefined,
    zoning: valuation.site
      ? {
          code: valuation.site.zoneCodeLocal,
          description: valuation.site.zoneDescriptionLocal,
          landUse: valuation.site.landUsePrimary,
        }
      : undefined,
  };
}
