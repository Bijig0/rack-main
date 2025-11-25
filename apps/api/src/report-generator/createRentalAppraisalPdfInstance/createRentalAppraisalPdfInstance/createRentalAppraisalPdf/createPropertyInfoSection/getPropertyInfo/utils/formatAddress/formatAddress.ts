import { Address } from "../../../../../../../../shared/types";

type Args = {
  address: Address;
};

type AddressLine = Address["addressLine"] & {};
type Suburb = Address["suburb"] & {};
type State = Address["state"] & {};
type Postcode = Address["postcode"] & {};

type FormattedAddress = `${AddressLine} ${Suburb} ${State} ${Postcode}`;

type Return = {
  formattedAddress: FormattedAddress;
};

/**
 * Produces a formatted address string like:
 * `${addressLine} ${suburb} ${state} ${postcode}`
 */
export function formatAddress({ address }: Args): Return {
  const { addressLine, suburb, state, postcode } = address;
  const formattedAddress =
    `${addressLine} ${suburb} ${state} ${postcode}` as const;
  return { formattedAddress };
}
