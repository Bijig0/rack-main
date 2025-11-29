import * as turf from "@turf/turf";
import { EasementFeature, Measurement } from "../../types";

type Args = {
  feature: EasementFeature;
  decimalPlaces?: number;
};

type Return = {
  measurement: Measurement;
  measurementText: string;
};

/**
 * Computes the length or area of an easement feature based on its geometry type.
 *
 * @param feature - The easement feature to measure
 * @param decimalPlaces - Number of decimal places for rounding (default: 2)
 * @returns Measurement object with value and unit, plus human-readable text
 * @throws Error if geometry is missing or unsupported, or if calculation fails
 */
export function computeEasementMeasurement({
  feature,
  decimalPlaces = 2,
}: Args): Return {
  const { geometry, id } = feature;

  if (!geometry) {
    throw new Error(
      `Feature ${id || "unknown"} is missing geometry and cannot be measured`
    );
  }

  // Linear geometries - calculate length
  if (geometry.type === "LineString" || geometry.type === "MultiLineString") {
    try {
      const lengthKm = turf.length(feature as any);
      const lengthMetres = lengthKm * 1000;
      const roundedLength = Number(lengthMetres.toFixed(decimalPlaces));

      return {
        measurement: {
          value: roundedLength,
          unit: "metres",
          type: "length",
        },
        measurementText: `, approximately ${roundedLength} metres in length`,
      };
    } catch (error) {
      throw new Error(
        `Failed to calculate length for feature ${id || "unknown"}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // Area geometries - calculate area
  if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
    try {
      const areaSqMetres = turf.area(feature as any);
      const roundedArea = Number(areaSqMetres.toFixed(decimalPlaces));

      return {
        measurement: {
          value: roundedArea,
          unit: "square metres",
          type: "area",
        },
        measurementText: `, covering roughly ${roundedArea} square metres`,
      };
    } catch (error) {
      throw new Error(
        `Failed to calculate area for feature ${id || "unknown"}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // Unsupported geometry type
  throw new Error(
    `Unsupported geometry type "${geometry.type}" for feature ${
      id || "unknown"
    }. Only LineString, MultiLineString, Polygon, and MultiPolygon are supported.`
  );
}

export default computeEasementMeasurement;
