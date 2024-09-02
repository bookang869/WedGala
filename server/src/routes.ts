import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Information of a guest
// RI: min, max >= 0
type Guest = {
  name: string,
  host: string,
  isFamily: boolean,
  guestConfirmed: string,
  min: number,
  max: number,
  restrictions: string,
  numGuest: string,
  guestName: string,
  guestRestrictions: string
};

// Information related to whether the 
// guest is bringing an extra guest or not
type AdditionalGuest = {
  guestConfirmed: string,
  min: number,
  max: number
};

// Summary of the guests of each host
export type GuestsOfHost = {
  minGuestsMolly: number,
  maxGuestsMolly: number,
  minGuestsJames: number,
  maxGuestsJames: number,
  numFamilyMolly: number,
  numFamilyJames: number
};

// Map from guest name to guest information
const guests: Map<String, Guest> = new Map();

let summary: GuestsOfHost = {
  minGuestsMolly: 0,
  maxGuestsMolly: 0,
  minGuestsJames: 0,
  maxGuestsJames: 0,
  numFamilyMolly: 0,
  numFamilyJames: 0
};

/** 
 * Updates according to whether the guest has an additional guest or not
 * @param numGuest the number of additional guest or unknown
 * @returns AdditionalGuest informaton which consists of the
 *          state of the additional guest and minimum and maximum
 *          number of guests
 */
export const addGuestUpdate = (numGuest: string): AdditionalGuest => {
  if (numGuest === "0") {
    return {guestConfirmed: "+0", min: 1, max: 1};
  } else if (numGuest === "1") {
    return {guestConfirmed: "+1", min: 2, max: 2};
  } else {
    return {guestConfirmed: "+1?", min: 1, max: 2}
  }
};

/** 
 * Updates the number of guests for the hosts from adding
 * @param guestsOfHost the record of guests of the hosts
 * @param host Molly or James
 * @param isFamily guest is a family or not
 * @returns the updated version of summary
 */
export const addUpdate = (guestsOfHost: GuestsOfHost, host: string, isFamily: boolean): GuestsOfHost => {
  if (host === "Molly") {
    if (isFamily) {
      return {minGuestsMolly: guestsOfHost.minGuestsMolly + 1, 
              maxGuestsMolly: guestsOfHost.maxGuestsMolly + 2,
              minGuestsJames: guestsOfHost.minGuestsJames,
              maxGuestsJames: guestsOfHost.maxGuestsJames,
              numFamilyMolly: guestsOfHost.numFamilyMolly + 1,
              numFamilyJames: guestsOfHost.numFamilyJames};
    } else {
      return {minGuestsMolly: guestsOfHost.minGuestsMolly + 1, 
              maxGuestsMolly: guestsOfHost.maxGuestsMolly + 2,
              minGuestsJames: guestsOfHost.minGuestsJames,
              maxGuestsJames: guestsOfHost.maxGuestsJames,
              numFamilyMolly: guestsOfHost.numFamilyMolly,
              numFamilyJames: guestsOfHost.numFamilyJames};
    }
  } else {
    if (isFamily) {
      return {minGuestsMolly: guestsOfHost.minGuestsMolly, 
              maxGuestsMolly: guestsOfHost.maxGuestsMolly,
              minGuestsJames: guestsOfHost.minGuestsJames + 1,
              maxGuestsJames: guestsOfHost.maxGuestsJames + 2,
              numFamilyMolly: guestsOfHost.numFamilyMolly,
              numFamilyJames: guestsOfHost.numFamilyJames + 1};
    } else {
      return {minGuestsMolly: guestsOfHost.minGuestsMolly, 
              maxGuestsMolly: guestsOfHost.maxGuestsMolly,
              minGuestsJames: guestsOfHost.minGuestsJames + 1,
              maxGuestsJames: guestsOfHost.maxGuestsJames + 2,
              numFamilyMolly: guestsOfHost.numFamilyMolly,
              numFamilyJames: guestsOfHost.numFamilyJames};
    }
  }
};

/** 
 * Updates the number of guests for the hosts from saving
 * @param guestsOfHost summary of the guests of each host
 * @param host Molly or James
 * @returns the updated version of summary
 */
export const saveUpdate = (guestsOfHost: GuestsOfHost, host: string): GuestsOfHost => {
  const guestsRange = findGuests(Array.from(guests.values()), host, 0);
  if (host === "Molly") {
      return {minGuestsMolly: guestsRange[0], 
              maxGuestsMolly: guestsRange[1],
              minGuestsJames: guestsOfHost.minGuestsJames,
              maxGuestsJames: guestsOfHost.maxGuestsJames,
              numFamilyMolly: guestsOfHost.numFamilyMolly,
              numFamilyJames: guestsOfHost.numFamilyJames};
  } else {
      return {minGuestsMolly: guestsOfHost.minGuestsMolly, 
              maxGuestsMolly: guestsOfHost.maxGuestsMolly,
              minGuestsJames: guestsRange[0],
              maxGuestsJames: guestsRange[1],
              numFamilyMolly: guestsOfHost.numFamilyMolly,
              numFamilyJames: guestsOfHost.numFamilyJames};
  }
};

/** 
 * Calculates and updates the minimum and maximum number of guests for a given host
 * @param guests array of guest information
 * @param host Molly or James
 * @param index counter that keeps track of which index we are at
 * @returns the minimum and maximum number of guests for the given host
 */
export const findGuests = (guests: Guest[], host: string, index: number): [number, number] => {
  if (index >= guests.length) {
    return [0, 0];
  } else {
    const currentGuest = guests[index];
    const nextValues = findGuests(guests, host, index + 1);
  
    if (currentGuest.host === host) {
      return [currentGuest.min + nextValues[0], currentGuest.max + nextValues[1]];
    } else {
      return nextValues;
    }
  }
};

/** 
 * Adds the guest information (name, host, isFamily) under the guest name
 * @param req request to respond to
 * @param res object to send response with
 */
export const addGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  
  const host = req.body.host;
  if (host === undefined || typeof host !== 'string') {
    res.status(400).send('required argument "host" was missing');
    return;
  }

  const isFamily = req.body.isFamily;
  if (isFamily === undefined || typeof isFamily !== 'boolean') {
    res.status(400).send('required argument "isFamily" was missing');
    return;
  }

  if (guests.has(name)) {
    res.status(400).send(`'${name}' already exists...`);
    return;
  }

  const guest: Guest = {
    name: name,
    host: host,
    isFamily: isFamily,
    guestConfirmed: '+1?',
    min: 1,
    max: 2,
    restrictions: '',
    numGuest: 'unknown',
    guestName: '',
    guestRestrictions: ''
  };

  summary = addUpdate(summary, guest.host, guest.isFamily);

  guests.set(guest.name, guest);
  res.send({guest: guest, summary: summary});
  return;
};

/** 
 * Saves the guest information under the given guest name
 * @param req request to respond to
 * @param res object to send response with
 */
export const saveGuestInfo = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const restrictions = req.body.restrictions;
  if (restrictions === undefined || typeof restrictions !== 'string') {
    res.status(400).send('required argument "restrictions" was missing');
    return;
  }
  
  const numGuest = req.body.numGuest;
  if (numGuest === undefined || typeof numGuest !== 'string') {
    res.status(400).send('required argument "numGuest" was missing');
    return;
  }

  const guestName = req.body.guestName;
  if (guestName === undefined || typeof guestName !== 'string') {
    res.status(400).send('required argument "guestName" was missing');
    return;
  }
  
  const guestRestrictions = req.body.guestRestrictions;
  if (guestRestrictions === undefined || typeof guestRestrictions !== 'string') {
    res.status(400).send('required argument "guestRestrictions" was missing');
    return;
  }

  const guest = guests.get(name);
  if (guest === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }

  const newAdditionalGuest = addGuestUpdate(numGuest);

  guest.guestConfirmed = newAdditionalGuest.guestConfirmed;
  guest.min = newAdditionalGuest.min;
  guest.max = newAdditionalGuest.max;
  guest.restrictions = restrictions;
  guest.numGuest = numGuest;
  guest.guestName = guestName;
  guest.guestRestrictions = guestRestrictions;

  summary = saveUpdate(summary, guest.host);

  res.send({guest: guest, summary: summary});
  return;
};

/** 
 * Gets the last-saved guest information with a given guest name
 * @param req request to respond to
 * @param res object to send response with
 */
export const getGuestInfo = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const guest = guests.get(name);
  if (guest === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }

  res.send({guest: guest});
  return;
};

/**
 * Lists the guest information currently saved.
 * @param _req request to respond to
 * @param res object to send response with
 */
export const listGuests = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(guests.values());
  res.send({guests: vals, summary: summary});
  return;
};


/** Testing function to remove all the added guests. */
export const resetForTesting = (): void => {
  guests.clear();
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
