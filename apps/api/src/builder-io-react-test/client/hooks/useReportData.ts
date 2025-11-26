import { useEffect, useState } from "react";

export interface ReportData {
  coverPageData: {
    addressCommonName: string;
    reportDate: string;
  };
  propertyInfo: {
    yearBuilt: number;
    landArea: {
      value: number;
      unit: string;
    };
    floorArea: {
      value: number;
      unit: string;
    };
    frontageWidth: number;
    propertyType: string;
    council: string;
    nearbySchools: Array<{
      type: string;
      name: string;
      address: string;
      distance: string;
    }>;
    propertyImage: {
      url: string;
      alt: string;
      isPrimary: boolean;
    };
    estimatedValue: {
      low: number;
      mid: number;
      high: number;
      currency: string;
      source: string;
      confidence: number;
      updatedAt: string;
    };
    distanceFromCBD: {
      value: number;
      unit: string;
    };
    similarPropertiesForSale: Array<{
      address: string;
      price: string;
      bedrooms: number;
      bathrooms: number;
      parking: number;
      propertyType: string;
    }>;
    similarPropertiesForRent: Array<{
      address: string;
      pricePerWeek: number;
      bedrooms: number;
      bathrooms: number;
      parking: number;
      propertyType: string;
    }>;
    appraisalSummary: string;
  };
  planningZoningData: {
    regionalPlan: string;
    landUse: string;
    planningScheme: string;
    zone: string;
    zoneCode: string;
    overlays: Array<{
      overlayCode: string;
      overlayNumber: number;
      overlayDescription: string;
    }>;
    heritageOverlays: string[];
    localPlan: string;
  };
  environmentalData: {
    floodRisk: {
      hasRisk: boolean;
      riskLevel: string;
    };
    bushfireRisk: {
      hasRisk: boolean;
      riskLevel: string;
    };
    heritage: {
      isHeritage: boolean;
      heritageType: string;
    };
  };
  infrastructureData: {
    sewer: boolean;
    water: boolean;
    stormwater: boolean;
    electricity: boolean;
    publicTransport: {
      available: boolean;
      distance: number;
    };
    shoppingCenter: {
      available: boolean;
      distance: number;
    };
    parkAndPlayground: {
      available: boolean;
      distance: number;
    };
    emergencyServices: {
      available: boolean;
      distance: number;
    };
  };
  locationSuburbData: {
    suburb: string;
    state: string;
    distanceToCBD: number;
    population: number;
    populationGrowth: number;
    occupancyData: {
      purchaser: number;
      renting: number;
      other: number;
    };
    rentalYieldGrowth: number[];
  };
  pricelabsData: {
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
    annualRevenue: number;
    occupancyRate: number;
  };
}

let cachedData: ReportData | null = null;

export function useReportData() {
  const [data, setData] = useState<ReportData | null>(cachedData);
  const [isLoading, setIsLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      return;
    }

    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/report");

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const reportData: ReportData = await response.json();
        cachedData = reportData;
        setData(reportData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch report data";
        setError(errorMessage);
        console.error("Error fetching report data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  return { data, isLoading, error };
}
