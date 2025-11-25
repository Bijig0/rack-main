"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// TODO: Import these from your actual schema file
// For now, creating placeholders - replace with your actual imports
const AustralianStateSchema = z.enum([
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "NT",
  "ACT",
]);

const PostcodeSchema = z
  .string()
  .min(4, "Postcode must be 4 digits")
  .max(4, "Postcode must be 4 digits")
  .regex(/^\d{4}$/, "Postcode must be 4 digits");

// Placeholder validation functions - replace with your actual implementations
function isPostcodeValidForState(postcode: number, state: string): boolean {
  // Add your actual validation logic here
  return true;
}

function getPostcodeErrorMessage(state: string): string {
  return `Please enter a valid postcode for ${state}`;
}

export const AddressSchema = z
  .object({
    addressLine: z.string().min(1, "Address is required"),
    suburb: z.string().min(1, "Suburb is required"),
    state: AustralianStateSchema,
    postcode: PostcodeSchema,
  })
  .refine(
    (data) => {
      const postcode = parseInt(data.postcode, 10);
      return isPostcodeValidForState(postcode, data.state);
    },
    (data) => ({
      message: getPostcodeErrorMessage(data.state),
      path: ["postcode"],
    })
  );

export type Address = z.infer<typeof AddressSchema>;

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(AddressSchema),
  });

  const onSubmit = (data: Address) => {
    console.log("Form data:", data);
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="addressLine" className="block text-sm font-medium mb-1">
          Address Line
        </label>
        <input
          id="addressLine"
          type="text"
          {...register("addressLine")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.addressLine && (
          <p className="text-red-500 text-sm mt-1">{errors.addressLine.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="suburb" className="block text-sm font-medium mb-1">
          Suburb
        </label>
        <input
          id="suburb"
          type="text"
          {...register("suburb")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.suburb && (
          <p className="text-red-500 text-sm mt-1">{errors.suburb.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium mb-1">
          State
        </label>
        <select
          id="state"
          {...register("state")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a state</option>
          <option value="NSW">NSW</option>
          <option value="VIC">VIC</option>
          <option value="QLD">QLD</option>
          <option value="SA">SA</option>
          <option value="WA">WA</option>
          <option value="TAS">TAS</option>
          <option value="NT">NT</option>
          <option value="ACT">ACT</option>
        </select>
        {errors.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="postcode" className="block text-sm font-medium mb-1">
          Postcode
        </label>
        <input
          id="postcode"
          type="text"
          {...register("postcode")}
          maxLength={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.postcode && (
          <p className="text-red-500 text-sm mt-1">{errors.postcode.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
}
