import * as assert from 'assert';
import { manageRange, parseGuests, parseSummary } from './guest';


describe('guests', function() {

  it('manageRange', function() {
    // 1st branch (min = max)
    assert.deepStrictEqual(manageRange(0, 0), "0");
    assert.deepStrictEqual(manageRange(3, 3), "3");

    // 2nd branch (min != max)
    assert.deepStrictEqual(manageRange(1, 2), "1-2");
    assert.deepStrictEqual(manageRange(2, 3), "2-3");

    assert.deepStrictEqual(manageRange(3, 5), "3-5");
    assert.deepStrictEqual(manageRange(4, 8), "4-8");
  });

  it('parseGuests', function() {
    // 1st branch
    assert.deepStrictEqual(parseGuests(false), undefined);
    assert.deepStrictEqual(parseGuests("hello"), undefined);

    // 2nd branch (name: string)
    assert.deepStrictEqual(parseGuests({a: 0}), undefined);
    assert.deepStrictEqual(parseGuests({a: true}), undefined);

    // 3rd branch (host: string)
    assert.deepStrictEqual(parseGuests({name: "kyle", b: 0}), undefined);
    assert.deepStrictEqual(parseGuests({name: "kevin", b: true}), undefined);

    // 4th branch (isFamily: boolean)
    assert.deepStrictEqual(parseGuests({name: "kyle", host: "molly", c: 0}), undefined);
    assert.deepStrictEqual(parseGuests({name: "kevin", host: "james", c: "what"}), undefined);

    // 5th branch (guestConfirmed: string)
    assert.deepStrictEqual(parseGuests({name: "kyle", host: "molly", isFamily: true, d: 0}), undefined);
    assert.deepStrictEqual(parseGuests({name: "kevin", host: "james", isFamily: false, d: true}), undefined);

    // 6th branch (min: number)
    assert.deepStrictEqual(parseGuests({name: "kyle", host: "molly", isFamily: true, guestConfirmed: "+1", e: "what"}), undefined);
    assert.deepStrictEqual(parseGuests({name: "kevin", host: "james", isFamily: false, guestConfirmed: "+0", e: true}), undefined);

    // 7th branch (max: number)
    assert.deepStrictEqual(parseGuests({name: "kyle", host: "molly", isFamily: true, guestConfirmed: "+1", min: 2, f: "what"}), undefined);
    assert.deepStrictEqual(parseGuests({name: "kevin", host: "james", isFamily: false, guestConfirmed: "+0", min: 1, f: true}), undefined);

    // 8th branch (restrictions: string)
    assert.deepStrictEqual(parseGuests({name: "kyle", host: "molly", isFamily: true, guestConfirmed: "+1", min: 2, max: 2, g: 0}), undefined);
    assert.deepStrictEqual(parseGuests({name: "kevin", host: "james", isFamily: false, guestConfirmed: "+0", min: 1, max: 2, g: true}), undefined);

    // 9th branch (numGuest: string)
    assert.deepStrictEqual(parseGuests({name: "kyle", host: "molly", isFamily: true, guestConfirmed: "+1", min: 2, max: 2, restrictions: "none", h: 0}), undefined);
    assert.deepStrictEqual(parseGuests({name: "kevin", host: "james", isFamily: false, guestConfirmed: "+0", min: 1, max: 2, restrictions: "dairy", h: true}), undefined);

    // 10th branch (guestName: string)
    assert.deepStrictEqual(parseGuests({name: "kyle", host: "molly", isFamily: true, guestConfirmed: "+1", min: 2, max: 2, restrictions: "none", numGuest: "1", i: 0}), undefined);
    assert.deepStrictEqual(parseGuests({name: "kevin", host: "james", isFamily: false, guestConfirmed: "+0", min: 1, max: 2, restrictions: "dairy", numGuest:"0", i: true}), undefined);
});

  it('parseSummary', function() {
    // 1st branch
    assert.deepStrictEqual(parseSummary(true), undefined);
    assert.deepStrictEqual(parseSummary("bye"), undefined);

    // 2nd branch (minGuestsMolly: number)
    assert.deepStrictEqual(parseSummary({a: "bello"}), undefined);
    assert.deepStrictEqual(parseSummary({a: false}), undefined);

    // 3rd branch (maxGuestsMolly: number)
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 1, b: "bello"}), undefined);
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 2, b: false}), undefined);

    // 4th branch (minGuestsJames: number)
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 1, maxGuestsMolly: 2, c: "bello"}), undefined);
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 2, maxGuestsMolly: 4, c: false}), undefined);

    // 5th branch (maxGuestsJames: number)
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 3, d: "bello"}), undefined);
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 2, maxGuestsMolly: 4, minGuestsJames: 5, d: false}), undefined);

    // 6th branch (numFamilyMolly: number)
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 3, maxGuestsJames: 5, e: "bello"}), undefined);
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 2, maxGuestsMolly: 4, minGuestsJames: 5, maxGuestsJames: 8, e: false}), undefined);

    // 7th branch (numFamilyJames: number)
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 3, maxGuestsJames: 5, numFamilyMolly: 0, f: "bello"}), undefined);
    assert.deepStrictEqual(parseSummary({minGuestsMolly: 2, maxGuestsMolly: 4, minGuestsJames: 5, maxGuestsJames: 8, numFamilyMolly: 3, f: false}), undefined);
  });

});
