import type { Address } from "../../../../../../../../shared/types";

/**
 * Water service provider coverage areas in Victoria
 */
const WATER_SERVICE_AREAS = {
  "Yarra Valley Water": {
    suburbs: [
      // Northern suburbs
      "Epping", "South Morang", "Mernda", "Doreen", "Whittlesea", "Mill Park",
      "Bundoora", "Reservoir", "Thomastown", "Lalor", "Coburg", "Preston",
      "Northcote", "Thornbury", "Heidelberg", "Rosanna", "Macleod", "Greensborough",
      // Eastern suburbs
      "Eltham", "Diamond Creek", "Hurstbridge", "Wattle Glen", "Warrandyte",
      "Doncaster", "Templestowe", "Bulleen", "Balwyn", "Kew", "Hawthorn",
      "Ivanhoe", "Eaglemont", "Alphington", "Fairfield", "Clifton Hill",
      // Inner city
      "Richmond", "Collingwood", "Fitzroy", "Carlton", "Parkville",
      "Brunswick", "Coburg North", "Pascoe Vale", "Strathmore", "Essendon",
      // Western suburbs (partial)
      "Moonee Ponds", "Ascot Vale", "Travancore", "Flemington", "Kensington",
      // More comprehensive list
      "Yallambie", "Viewbank", "Briar Hill", "Montmorency", "Lower Plenty",
      "St Helena", "Research", "North Warrandyte", "Park Orchards", "Donvale",
      "Warrandyte South", "Wonga Park", "Kangaroo Ground", "Plenty",
      "Yarrambat", "Nutfield", "Cottles Bridge", "Arthurs Creek",
      "Panton Hill", "Smiths Gully", "St Andrews", "Christmas Hills",
      "Kinglake West", "Eden Park", "Cottles Bridge", "Strathewen",
      "Kinglake", "Pheasant Creek", "Flowerdale", "Strath Creek",
      "Kinglake Central", "Glenburn", "Toolangi", "Castella", "Murrindindi",
      // Add more YVW suburbs
      "Blackburn", "Forest Hill", "Vermont", "Mitcham", "Nunawading",
      "Ringwood", "Croydon", "Mooroolbark", "Lilydale", "Chirnside Park",
      "Kilsyth", "Montrose", "Mount Evelyn", "Wandin North", "Seville",
      "Woori Yallock", "Launching Place", "Yarra Glen", "Coldstream",
      "Gruyere", "Yarra Junction", "Wesburn", "Millgrove", "Warburton",
      "East Warburton", "McMahons Creek", "Reefton", "Matlock",
      "Cambarville", "Powelltown", "Three Bridges", "Gilderoy",
      "Badger Creek", "Healesville", "Chum Creek", "Toolangi", "Castella",
    ],
    postcodes: [
      "3000", "3002", "3003", "3004", "3006", "3010",
      "3040", "3041", "3042", "3043", "3044", "3046", "3047", "3048", "3049",
      "3050", "3051", "3052", "3053", "3054", "3055", "3056", "3057", "3058",
      "3060", "3061", "3062", "3063", "3064", "3065", "3066", "3067", "3068",
      "3070", "3071", "3072", "3073", "3074", "3075", "3076", "3078", "3079",
      "3081", "3082", "3083", "3084", "3085", "3086", "3087", "3088", "3089",
      "3090", "3091", "3093", "3094", "3095", "3096", "3097", "3099",
      "3108", "3109", "3111", "3113", "3114", "3121", "3122", "3123", "3124",
      "3125", "3126", "3127", "3128", "3129", "3130", "3131", "3132", "3133",
      "3134", "3135", "3136", "3137", "3138", "3139", "3140", "3141", "3759",
      "3777", "3778", "3779", "3781", "3782", "3783", "3785", "3786", "3787",
      "3788", "3789", "3791", "3792", "3793", "3795", "3796", "3797", "3799",
    ],
  },
  "South East Water": {
    suburbs: [
      // South Eastern suburbs
      "Dandenong", "Noble Park", "Springvale", "Clayton", "Oakleigh",
      "Mulgrave", "Wheelers Hill", "Glen Waverley", "Mount Waverley",
      "Chadstone", "Malvern", "Toorak", "Armadale", "Prahran", "Windsor",
      "St Kilda", "Elwood", "Brighton", "Sandringham", "Beaumaris",
      "Cheltenham", "Mentone", "Mordialloc", "Parkdale", "Aspendale",
      "Edithvale", "Chelsea", "Bonbeach", "Carrum", "Seaford", "Frankston",
      "Langwarrin", "Karingal", "Skye", "Carrum Downs", "Cranbourne",
      "Narre Warren", "Berwick", "Beaconsfield", "Officer", "Pakenham",
      // Mornington Peninsula
      "Somerville", "Tyabb", "Hastings", "Bittern", "Crib Point",
      "Mornington", "Mount Martha", "Mount Eliza", "Rosebud", "Rye",
      "Blairgowrie", "Sorrento", "Portsea", "Dromana", "McCrae",
      "Safety Beach", "Flinders", "Red Hill", "Main Ridge", "Merricks",
    ],
    postcodes: [
      "3122", "3142", "3143", "3144", "3145", "3146", "3147", "3148", "3149",
      "3150", "3162", "3163", "3165", "3166", "3167", "3168", "3169", "3170",
      "3171", "3172", "3173", "3174", "3175", "3177", "3178", "3179", "3180",
      "3181", "3182", "3183", "3184", "3185", "3186", "3187", "3188", "3189",
      "3190", "3191", "3192", "3193", "3194", "3195", "3196", "3197", "3198",
      "3199", "3200", "3201", "3202", "3204", "3930", "3931", "3933", "3934",
      "3936", "3937", "3938", "3939", "3940", "3941", "3942", "3943", "3944",
    ],
  },
  "City West Water": {
    suburbs: [
      // Western suburbs
      "Footscray", "Seddon", "Yarraville", "Williamstown", "Newport",
      "Spotswood", "Altona", "Altona North", "Altona Meadows", "Laverton",
      "Seabrook", "Point Cook", "Werribee", "Hoppers Crossing", "Tarneit",
      "Truganina", "Williams Landing", "Wyndham Vale", "Manor Lakes",
      "Sunshine", "Sunshine West", "Sunshine North", "Albion", "Ardeer",
      "Deer Park", "St Albans", "Keilor", "Keilor Downs", "Taylors Lakes",
      "Sydenham", "Hillside", "Delahey", "Caroline Springs", "Burnside",
      "Ravenhall", "Derrimut", "Rockbank", "Melton", "Melton South",
      "Melton West", "Kurunjang", "Brookfield", "Exford", "Eynesbury",
      "Toolern Vale", "Diggers Rest", "Bulla", "Sunbury", "Wildwood",
    ],
    postcodes: [
      "3011", "3012", "3013", "3015", "3016", "3018", "3019", "3020", "3021",
      "3022", "3023", "3024", "3025", "3026", "3027", "3028", "3029", "3030",
      "3031", "3032", "3033", "3034", "3036", "3037", "3038", "3039", "3040",
      "3335", "3336", "3337", "3338", "3427", "3428", "3429", "3750", "3751",
    ],
  },
};

type Args = {
  address: Address;
};

type Return = {
  isInServiceArea: boolean;
  provider: string | null;
  useYVW: boolean;
};

/**
 * Determines which water service provider covers a given address
 *
 * @param address - The address to check
 * @returns Information about the water service provider
 *
 * @example
 * ```typescript
 * const result = checkWaterServiceArea({
 *   address: {
 *     addressLine: "7 English Place",
 *     suburb: "Kew",
 *     state: "VIC",
 *     postcode: "3101"
 *   }
 * });
 * // Returns: { isInServiceArea: true, provider: "Yarra Valley Water", useYVW: true }
 * ```
 */
export const checkWaterServiceArea = ({ address }: Args): Return => {
  const { suburb, postcode } = address;

  // Normalize suburb name (remove spaces, convert to lowercase for comparison)
  const normalizedSuburb = suburb.toLowerCase().trim();

  // Check each provider
  for (const [providerName, coverage] of Object.entries(WATER_SERVICE_AREAS)) {
    // Check if suburb matches
    const suburbMatch = coverage.suburbs.some(
      (coverageSuburb) =>
        coverageSuburb.toLowerCase() === normalizedSuburb
    );

    // Check if postcode matches
    const postcodeMatch = coverage.postcodes.includes(postcode);

    // If either suburb or postcode matches, we found the provider
    if (suburbMatch || postcodeMatch) {
      return {
        isInServiceArea: true,
        provider: providerName,
        useYVW: providerName === "Yarra Valley Water",
      };
    }
  }

  // If not found in any known provider, default to checking if it's in Victoria
  // and assume regional water provider
  if (address.state === "VIC") {
    return {
      isInServiceArea: true,
      provider: "Regional Water Authority",
      useYVW: false,
    };
  }

  return {
    isInServiceArea: false,
    provider: null,
    useYVW: false,
  };
};

if (import.meta.main) {
  console.log("\n=== WATER SERVICE AREA CHECKER ===\n");

  // Test addresses
  const testAddresses = [
    {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC" as const,
      postcode: "3101",
    },
    {
      addressLine: "1 Collins Street",
      suburb: "Melbourne",
      state: "VIC" as const,
      postcode: "3000",
    },
    {
      addressLine: "123 Main Street",
      suburb: "Frankston",
      state: "VIC" as const,
      postcode: "3199",
    },
    {
      addressLine: "456 High Street",
      suburb: "Footscray",
      state: "VIC" as const,
      postcode: "3011",
    },
    {
      addressLine: "789 Test Road",
      suburb: "Geelong",
      state: "VIC" as const,
      postcode: "3220",
    },
  ];

  testAddresses.forEach((address) => {
    const result = checkWaterServiceArea({ address });
    console.log(`Address: ${address.suburb} ${address.postcode}`);
    console.log(`  Provider: ${result.provider || "Unknown"}`);
    console.log(`  In Service Area: ${result.isInServiceArea}`);
    console.log(`  Use YVW API: ${result.useYVW}\n`);
  });
}
