import { isRecord } from "./record";

// Information of a guest
// RI: min, max >= 0
export type Guest = {
  readonly name: string,
  readonly host: string,
  readonly isFamily: boolean,
  readonly guestConfirmed: string,
  readonly min: number,
  readonly max: number,
  readonly restrictions: string,
  readonly numGuest: string,
  readonly guestName: string,
  readonly guestRestrictions: string
};

// Summary of the guests of each host
export type GuestsOfHost = {
    readonly minGuestsMolly: number,
    readonly maxGuestsMolly: number,
    readonly minGuestsJames: number,
    readonly maxGuestsJames: number,
    readonly numFamilyMolly: number,
    readonly numFamilyJames: number
};

/** 
 * Manages the range of the number of guests
 * @param min the minimum possible number of guests for the host
 * @param max the maximum possible number of guests for the host
 * @returns the range of the number of guests
 */
export const manageRange = (min: number, max: number): string => {
  if (min === max) {
    return min.toString();
  } else {
    return min + "-" + max;
  }
};

/**
 * Parses unknown data into a Guest. Will log an error and return undefined
 * if it is not a valid Guest.
 * @param val unknown data to parse into a Guest
 * @return Guest if val is a valid Guest and undefined otherwise
 */
export const parseGuests = (val: unknown): undefined | Guest => {
  if (!isRecord(val)) {
    console.error("not a guest", val)
    return undefined;
  }

  if (typeof val.name !== "string") {
    console.error("not a guest: missing 'name'", val)
    return undefined;
  }

  if (typeof val.host !== "string") {
    console.error("not a guest: missing 'host'", val)
    return undefined;
  }

  if (typeof val.isFamily !== "boolean") {
    console.error("not a guest: missing 'isFamily'", val)
    return undefined;
  }

  if (typeof val.guestConfirmed !== "string") {
    console.error("not a guest: missing 'guestConfirmed'", val)
    return undefined;
  }

  if (typeof val.min !== "number") {
    console.error("not a guest: missing 'min'", val)
    return undefined;
  }

  if (typeof val.max !== "number") {
    console.error("not a guest: missing 'max'", val)
    return undefined;
  }

  if (typeof val.restrictions !== "string") {
    console.error("not a guest: missing 'restrictions'", val)
    return undefined;
  }

  if (typeof val.numGuest !== "string") {
    console.error("not a guest: missing or invalid 'numGuest'", val)
    return undefined;
  }

  if (typeof val.guestName !== "string") {
    console.error("not a guest: missing or invalid 'guestName'", val)
    return undefined;
  }

  if (typeof val.guestRestrictions !== "string") {
    console.error("not a guest: missing or invalid 'guestRestrictions'", val)
    return undefined;
  }

  return {
    name: val.name, host: val.host, isFamily: val.isFamily,
    guestConfirmed: val.guestConfirmed, min: val.min, max: val.max,
    restrictions: val.restrictions, numGuest: val.numGuest, guestName: val.guestName, guestRestrictions: val.guestRestrictions
  };
};

/**
 * Parses unknown data into a GuestsOfHost. Will log an error and return undefined
 * if it is not a valid GuestsOfHost.
 * @param val unknown data to parse into a GuestsOfHost
 * @return GuestsOfHost if val is a valid GuestsOfHost and undefined otherwise
 */
export const parseSummary = (val: unknown): undefined | GuestsOfHost => {
  if (!isRecord(val)) {
    console.error("not a guest", val)
    return undefined;
  }

  if (typeof val.minGuestsMolly !== "number") {
    console.error("not a guest: missing 'minGuestsMolly'", val)
    return undefined;
  }

  if (typeof val.maxGuestsMolly !== "number") {
    console.error("not a guest: missing 'maxGuestsMolly'", val)
    return undefined;
  }

  if (typeof val.minGuestsJames !== "number") {
    console.error("not a guest: missing 'minGuestsJames'", val)
    return undefined;
  }

  if (typeof val.maxGuestsJames !== "number") {
    console.error("not a guest: missing 'maxGuestsJames'", val)
    return undefined;
  }

  if (typeof val.numFamilyMolly !== "number") {
    console.error("not a guest: missing 'numFamilyMolly'", val)
    return undefined;
  }

  if (typeof val.numFamilyJames !== "number") {
    console.error("not a guest: missing 'numFamilyJames'", val)
    return undefined;
  }

  return {
    minGuestsMolly: val.minGuestsMolly, 
    maxGuestsMolly: val.maxGuestsMolly, 
    minGuestsJames: val.minGuestsJames, 
    maxGuestsJames: val.maxGuestsJames,
    numFamilyMolly: val.numFamilyMolly, 
    numFamilyJames: val.numFamilyJames
  };
};
