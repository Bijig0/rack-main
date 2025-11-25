import { z } from 'zod';

export const RentalUnitSchema = z.object({
  // Property Details
  address: z.string().min(1, 'Address is required'),
  unitNumber: z.string().optional(),
  propertyType: z.enum(['apartment', 'house', 'townhouse', 'studio', 'condo']),
  
  // Unit Specifications
  bedrooms: z.number().int().min(0).max(10),
  bathrooms: z.number().min(0).max(10),
  squareFeet: z.number().positive(),
  
  // Amenities
  hasParking: z.boolean().default(false),
  parkingSpaces: z.number().int().min(0).default(0),
  hasBalcony: z.boolean().default(false),
  hasAirConditioning: z.boolean().default(false),
  hasHeating: z.boolean().default(false),
  hasLaundry: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  
  // Condition & Features
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  hasRenovations: z.boolean().default(false),
  renovationYear: z.number().int().optional(),
  
  // Location Factors
  floorNumber: z.number().int().min(0).optional(),
  distanceToTransit: z.number().positive().optional(), // in miles
  walkScore: z.number().int().min(0).max(100).optional(),
  
  // Market Data
  proposedRent: z.number().positive(),
  marketRentLow: z.number().positive(),
  marketRentHigh: z.number().positive(),
  averageRentInArea: z.number().positive(),
  
  // Additional Info
  notes: z.string().optional(),
  appraisalDate: z.string().datetime().default(() => new Date().toISOString()),
  appraiserName: z.string().min(1, 'Appraiser name is required'),
});

export type RentalUnit = z.infer<typeof RentalUnitSchema>;

// Helper function to validate rental unit data
export function validateRentalUnit(data: unknown): RentalUnit {
  return RentalUnitSchema.parse(data);
}