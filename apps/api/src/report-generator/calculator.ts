import { RentalUnit } from './schema';

export interface AppraisalResult {
  recommendedRent: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  adjustments: {
    name: string;
    amount: number;
    reason: string;
  }[];
  marketAnalysis: {
    positionInMarket: 'below' | 'at' | 'above';
    percentageDifference: number;
  };
}

export function calculateAppraisal(unit: RentalUnit): AppraisalResult {
  let baseRent = unit.averageRentInArea;
  const adjustments: AppraisalResult['adjustments'] = [];

  // Bedroom adjustment
  const bedroomDiff = unit.bedrooms - 2; // Assuming 2BR is baseline
  if (bedroomDiff !== 0) {
    const bedroomAdjustment = bedroomDiff * 150;
    adjustments.push({
      name: 'Bedroom Count',
      amount: bedroomAdjustment,
      reason: `${Math.abs(bedroomDiff)} ${bedroomDiff > 0 ? 'additional' : 'fewer'} bedroom(s)`
    });
    baseRent += bedroomAdjustment;
  }

  // Bathroom adjustment
  const bathroomDiff = unit.bathrooms - 1; // Assuming 1BA is baseline
  if (bathroomDiff !== 0) {
    const bathroomAdjustment = bathroomDiff * 100;
    adjustments.push({
      name: 'Bathroom Count',
      amount: bathroomAdjustment,
      reason: `${Math.abs(bathroomDiff)} ${bathroomDiff > 0 ? 'additional' : 'fewer'} bathroom(s)`
    });
    baseRent += bathroomAdjustment;
  }

  // Square footage adjustment (per 100 sq ft above/below 1000)
  const sqFtDiff = unit.squareFeet - 1000;
  if (Math.abs(sqFtDiff) > 50) {
    const sqFtAdjustment = (sqFtDiff / 100) * 50;
    adjustments.push({
      name: 'Square Footage',
      amount: Math.round(sqFtAdjustment),
      reason: `${Math.abs(Math.round(sqFtDiff))} sq ft ${sqFtDiff > 0 ? 'above' : 'below'} baseline`
    });
    baseRent += sqFtAdjustment;
  }

  // Parking adjustment
  if (unit.hasParking) {
    const parkingAdjustment = unit.parkingSpaces * 75;
    adjustments.push({
      name: 'Parking',
      amount: parkingAdjustment,
      reason: `${unit.parkingSpaces} parking space(s)`
    });
    baseRent += parkingAdjustment;
  }

  // Amenity adjustments
  if (unit.hasBalcony) {
    adjustments.push({ name: 'Balcony', amount: 50, reason: 'Private balcony' });
    baseRent += 50;
  }

  if (unit.hasAirConditioning) {
    adjustments.push({ name: 'Air Conditioning', amount: 75, reason: 'Central A/C' });
    baseRent += 75;
  }

  if (unit.hasLaundry) {
    adjustments.push({ name: 'In-Unit Laundry', amount: 100, reason: 'Washer/dryer in unit' });
    baseRent += 100;
  }

  // Condition adjustment
  const conditionMultipliers = {
    excellent: 1.1,
    good: 1.0,
    fair: 0.95,
    poor: 0.85
  };
  
  if (unit.condition !== 'good') {
    const multiplier = conditionMultipliers[unit.condition];
    const conditionAdjustment = baseRent * (multiplier - 1);
    adjustments.push({
      name: 'Property Condition',
      amount: Math.round(conditionAdjustment),
      reason: `Unit in ${unit.condition} condition`
    });
    baseRent *= multiplier;
  }

  // Age adjustment
  const age = new Date().getFullYear() - unit.yearBuilt;
  if (age > 30 && !unit.hasRenovations) {
    const ageAdjustment = -50;
    adjustments.push({
      name: 'Building Age',
      amount: ageAdjustment,
      reason: `Property ${age} years old without recent renovations`
    });
    baseRent += ageAdjustment;
  }

  // Recent renovations bonus
  if (unit.hasRenovations && unit.renovationYear) {
    const renovationAge = new Date().getFullYear() - unit.renovationYear;
    if (renovationAge <= 5) {
      adjustments.push({
        name: 'Recent Renovation',
        amount: 150,
        reason: `Renovated ${renovationAge} year(s) ago`
      });
      baseRent += 150;
    }
  }

  // Floor level adjustment (higher floors = premium)
  if (unit.floorNumber !== undefined && unit.floorNumber > 3) {
    const floorAdjustment = (unit.floorNumber - 3) * 25;
    adjustments.push({
      name: 'Floor Level',
      amount: floorAdjustment,
      reason: `Unit on floor ${unit.floorNumber}`
    });
    baseRent += floorAdjustment;
  }

  const recommendedRent = Math.round(baseRent);

  // Calculate market position
  const marketMidpoint = (unit.marketRentLow + unit.marketRentHigh) / 2;
  const percentageDifference = ((recommendedRent - marketMidpoint) / marketMidpoint) * 100;
  
  let positionInMarket: 'below' | 'at' | 'above';
  if (Math.abs(percentageDifference) < 5) {
    positionInMarket = 'at';
  } else if (recommendedRent < marketMidpoint) {
    positionInMarket = 'below';
  } else {
    positionInMarket = 'above';
  }

  // Determine confidence level
  const marketRange = unit.marketRentHigh - unit.marketRentLow;
  const isWithinRange = recommendedRent >= unit.marketRentLow && recommendedRent <= unit.marketRentHigh;
  
  let confidenceLevel: 'high' | 'medium' | 'low';
  if (isWithinRange && marketRange / marketMidpoint < 0.2) {
    confidenceLevel = 'high';
  } else if (isWithinRange || Math.abs(percentageDifference) < 15) {
    confidenceLevel = 'medium';
  } else {
    confidenceLevel = 'low';
  }

  return {
    recommendedRent,
    confidenceLevel,
    adjustments,
    marketAnalysis: {
      positionInMarket,
      percentageDifference: Math.round(percentageDifference * 100) / 100
    }
  };
}