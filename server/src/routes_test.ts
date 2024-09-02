import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addGuestUpdate, addUpdate, addGuest, saveGuestInfo, resetForTesting } from './routes';
// import { addGuestUpdate, addUpdate, saveUpdate, findGuests, addGuest, saveGuestInfo, getGuestInfo, listGuests, resetForTesting } from './routes';


describe('routes', function() {
    it('addGuestUpdate', function() {
        // 1st branch (numGuest = 0) -> only one possible
        assert.deepStrictEqual(addGuestUpdate("0"), {guestConfirmed: "+0", min: 1, max: 1});
    
        // 2nd branch (numGuest = 1) -> only one possible
        assert.deepStrictEqual(addGuestUpdate("1"), {guestConfirmed: "+1", min: 2, max: 2});

        // 3rd branch (numGuest = unknown) -> only one possible
        assert.deepStrictEqual(addGuestUpdate("unknown"), {guestConfirmed: "+1?", min: 1, max: 2});
    });

    it('addUpdate', function() {
        // 1st branch (host = "Molly" && isFamily)
        assert.deepStrictEqual(addUpdate({minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
                                            maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0}, "Molly", true), 
                                            {minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 0, 
                                                maxGuestsJames: 0, numFamilyMolly: 1, numFamilyJames: 0});
        assert.deepStrictEqual(addUpdate({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 1, 
                                            maxGuestsJames: 1, numFamilyMolly: 0, numFamilyJames: 1}, "Molly", true), 
                                            {minGuestsMolly: 2, maxGuestsMolly: 4, minGuestsJames: 1, 
                                                maxGuestsJames: 1, numFamilyMolly: 1, numFamilyJames: 1});
    
        // 2nd branch (host = "Molly" && !isFamily)
        assert.deepStrictEqual(addUpdate({minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
                                            maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0}, "Molly", false), 
                                            {minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 0, 
                                                maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0});
        assert.deepStrictEqual(addUpdate({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 1, 
                                            maxGuestsJames: 1, numFamilyMolly: 0, numFamilyJames: 1}, "Molly", false), 
                                            {minGuestsMolly: 2, maxGuestsMolly: 4, minGuestsJames: 1, 
                                                maxGuestsJames: 1, numFamilyMolly: 0, numFamilyJames: 1});

        // 3rd branch (host = "James" && isFamily)
        assert.deepStrictEqual(addUpdate({minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
                                            maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0}, "James", true), 
                                            {minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 1, 
                                                maxGuestsJames: 2, numFamilyMolly: 0, numFamilyJames: 1});
        assert.deepStrictEqual(addUpdate({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 1, 
                                            maxGuestsJames: 1, numFamilyMolly: 0, numFamilyJames: 1}, "James", true), 
                                            {minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 2, 
                                                maxGuestsJames: 3, numFamilyMolly: 0, numFamilyJames: 2});

        // 4th branch (host = "James" && !isFamily)
        assert.deepStrictEqual(addUpdate({minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
                                            maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0}, "James", false), 
                                            {minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 1, 
                                                maxGuestsJames: 2, numFamilyMolly: 0, numFamilyJames: 0});
        assert.deepStrictEqual(addUpdate({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 1, 
                                            maxGuestsJames: 1, numFamilyMolly: 0, numFamilyJames: 1}, "James", false), 
                                            {minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 2, 
                                                maxGuestsJames: 3, numFamilyMolly: 0, numFamilyJames: 1});
    });

    // it('saveUpdate', function() {
    //     // 1st branch (host = "Molly")
    //     assert.deepStrictEqual(saveUpdate({minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
    //                                         maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0}, "Molly"), 
    //                                         {minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
    //                                             maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0});
    //     assert.deepStrictEqual(saveUpdate({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 1, 
    //                                         maxGuestsJames: 1, numFamilyMolly: 0, numFamilyJames: 1}, "Molly"), 
    //                                         {minGuestsMolly: 2, maxGuestsMolly: 4, minGuestsJames: 1, 
    //                                             maxGuestsJames: 1, numFamilyMolly: 1, numFamilyJames: 1});

    //     // 2nd branch (host = "James")
    //     assert.deepStrictEqual(saveUpdate({minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
    //                                         maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0}, "James"), 
    //                                         {minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 1, 
    //                                             maxGuestsJames: 2, numFamilyMolly: 0, numFamilyJames: 1});
    //     assert.deepStrictEqual(saveUpdate({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 1, 
    //                                         maxGuestsJames: 1, numFamilyMolly: 0, numFamilyJames: 1}, "James"), 
    //                                         {minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 2, 
    //                                             maxGuestsJames: 3, numFamilyMolly: 0, numFamilyJames: 2});
    // });

    // it('findGuest', function() {
    //     // 1st branch (host = "Molly")
    //     assert.deepStrictEqual(saveUpdate({minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
    //                                         maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0}, "Molly"), 
    //                                         {minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
    //                                             maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0});
    //     assert.deepStrictEqual(saveUpdate({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 1, 
    //                                         maxGuestsJames: 1, numFamilyMolly: 0, numFamilyJames: 1}, "Molly"), 
    //                                         {minGuestsMolly: 2, maxGuestsMolly: 4, minGuestsJames: 1, 
    //                                             maxGuestsJames: 1, numFamilyMolly: 1, numFamilyJames: 1});

    //     // 2nd branch (host = "James")
    //     assert.deepStrictEqual(saveUpdate({minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, 
    //                                         maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0}, "James"), 
    //                                         {minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 1, 
    //                                             maxGuestsJames: 2, numFamilyMolly: 0, numFamilyJames: 1});
    //     assert.deepStrictEqual(saveUpdate({minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 1, 
    //                                         maxGuestsJames: 1, numFamilyMolly: 0, numFamilyJames: 1}, "James"), 
    //                                         {minGuestsMolly: 1, maxGuestsMolly: 2, minGuestsJames: 2, 
    //                                             maxGuestsJames: 3, numFamilyMolly: 0, numFamilyJames: 2});
    // });

    it('addGuest', function() {
    // Separate domain for each branch:
    // 1. Missing name
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {}});
    const res1 = httpMocks.createResponse();
    addGuest(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
    'required argument "name" was missing');

    // 2. Missing host
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "Kevin"}});
    const res2 = httpMocks.createResponse();
    addGuest(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
    'required argument "host" was missing');

    // 3. Missing isFamily
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "Kevin", host: "James"}});
    const res3 = httpMocks.createResponse();
    addGuest(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
    'required argument "isFamily" was missing');

    // 4. Correctly added
    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "Kyle", host: "Molly", isFamily: false}});
    const res4 = httpMocks.createResponse();
    addGuest(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().guest.name, "Kyle");
    assert.deepStrictEqual(res4._getData().guest.host, "Molly");
    assert.deepStrictEqual(res4._getData().guest.isFamily, false);
    assert.deepStrictEqual(res4._getData().guest.guestConfirmed, "+1?");
    assert.deepStrictEqual(res4._getData().guest.min, 1);
    assert.deepStrictEqual(res4._getData().guest.max, 2);
    assert.deepStrictEqual(res4._getData().guest.restrictions, "");
    assert.deepStrictEqual(res4._getData().guest.numGuest, "unknown");
    assert.deepStrictEqual(res4._getData().guest.guestName, "");
    assert.deepStrictEqual(res4._getData().guest.guestRestrictions, "");

    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "Sam", host: "James", isFamily: true}});
    const res5 = httpMocks.createResponse();
    addGuest(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData().guest.name, "Sam");
    assert.deepStrictEqual(res5._getData().guest.host, "James");
    assert.deepStrictEqual(res5._getData().guest.isFamily, true);
    assert.deepStrictEqual(res5._getData().guest.guestConfirmed, "+1?");
    assert.deepStrictEqual(res5._getData().guest.min, 1);
    assert.deepStrictEqual(res5._getData().guest.max, 2);
    assert.deepStrictEqual(res5._getData().guest.restrictions, "");
    assert.deepStrictEqual(res5._getData().guest.numGuest, "unknown");
    assert.deepStrictEqual(res5._getData().guest.guestName, "");
    assert.deepStrictEqual(res5._getData().guest.guestRestrictions, "");

    // 5. Invalid name
    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "Kyle", host: "Molly", isFamily: false}});
    const res6 = httpMocks.createResponse();
    addGuest(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
    "'Kyle' already exists...");

    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "Sam", host: "James", isFamily: true}});
    const res7 = httpMocks.createResponse();
    addGuest(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
    "'Sam' already exists...");

    resetForTesting();
  });

  it('saveGuestInfo', function() {
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "Kyle", host: "Molly", isFamily: false}});
    const res1 = httpMocks.createResponse();
    addGuest(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData().guest.name, "Kyle");
    assert.deepStrictEqual(res1._getData().guest.host, "Molly");
    assert.deepStrictEqual(res1._getData().guest.isFamily, false);
    assert.deepStrictEqual(res1._getData().guest.guestConfirmed, "+1?");
    assert.deepStrictEqual(res1._getData().guest.min, 1);
    assert.deepStrictEqual(res1._getData().guest.max, 2);
    assert.deepStrictEqual(res1._getData().guest.restrictions, "");
    assert.deepStrictEqual(res1._getData().guest.numGuest, "unknown");
    assert.deepStrictEqual(res1._getData().guest.guestName, "");
    assert.deepStrictEqual(res1._getData().guest.guestRestrictions, "");

    // Separate domain for each branch:
    // 1. Missing name
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {}});
    const res2 = httpMocks.createResponse();
    saveGuestInfo(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
    'required argument "name" was missing');

    // 2. Missing restrictions
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {name: "Kevin"}});
    const res3 = httpMocks.createResponse();
    saveGuestInfo(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
    'required argument "restrictions" was missing');

    // 3. Missing numGuest
    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save',
         body: {name: "Kevin", restrictions: "none"}});
    const res6 = httpMocks.createResponse();
    saveGuestInfo(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
    'required argument "numGuest" was missing');

    // 4. Missing guestName
    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save',
         body: {name: "Kevin", restrictions: "none", numGuest: "1"}});
    const res7 = httpMocks.createResponse();
    saveGuestInfo(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
    'required argument "guestName" was missing');

    // 5. Missing guestRestrictions
    const req9 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save',
         body: {name: "Kevin", restrictions: "none", numGuest: "1", guestName: "Lucas"}});
    const res9 = httpMocks.createResponse();
    saveGuestInfo(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 400);
    assert.deepStrictEqual(res9._getData(),
    'required argument "guestRestrictions" was missing');

    resetForTesting();
  });

//   it('get', function() {
//     const req1 = httpMocks.createRequest(
//         {method: 'POST', url: '/api/add',
//          body: {name: "couch", seller: "Fred", description: "the cozy couch",
//                 minBid: 10, minutes: 5}});
//     const res1 = httpMocks.createResponse();
//     addAuction(req1, res1);
//     assert.strictEqual(res1._getStatusCode(), 200);
//     assert.deepStrictEqual(res1._getData().auction.name, "couch");
//     assert.deepStrictEqual(res1._getData().auction.maxBid, 9);

//     const req2 = httpMocks.createRequest(
//         {method: 'POST', url: '/api/add',
//          body: {name: "chair", seller: "Barney", description: "the comfy chair",
//                 minBid: 5, minutes: 10}});
//     const res2 = httpMocks.createResponse();
//     addAuction(req2, res2);
//     assert.strictEqual(res2._getStatusCode(), 200);
//     assert.deepStrictEqual(res2._getData().auction.name, "chair");
//     assert.deepStrictEqual(res2._getData().auction.maxBid, 4);

//     // Separate domain for each branch:
//     // 1. Missing name
//     // 1. Missing name
//     const req3 = httpMocks.createRequest(
//         {method: 'GET', url: '/api/get', query: {}});
//     const res3 = httpMocks.createResponse();
//     getAuction(req3, res3);
//     assert.strictEqual(res3._getStatusCode(), 400);
//     assert.deepStrictEqual(res3._getData(), "missing 'name' parameter");

//     // 2. Invalid name
//     const req4 = httpMocks.createRequest(
//         {method: 'GET', url: '/api/get', query: {name: "fridge"}});
//     const res4 = httpMocks.createResponse();
//     getAuction(req4, res4);
//     assert.strictEqual(res4._getStatusCode(), 400);
//     assert.deepStrictEqual(res4._getData(), "no auction with name 'fridge'");

//     const req5 = httpMocks.createRequest(
//         {method: 'GET', url: '/api/get', query: {name: "stool"}});
//     const res5 = httpMocks.createResponse();
//     getAuction(req5, res5);
//     assert.strictEqual(res5._getStatusCode(), 400);
//     assert.deepStrictEqual(res5._getData(), "no auction with name 'stool'");

//     // 3. Auction found
//     const req6 = httpMocks.createRequest(
//         {method: 'GET', url: '/api/get', query: {name: "couch"}});
//     const res6 = httpMocks.createResponse();
//     getAuction(req6, res6);
//     assert.strictEqual(res6._getStatusCode(), 200);
//     assert.deepStrictEqual(res6._getData().auction.name, "couch");
//     assert.deepStrictEqual(res6._getData().auction.maxBid, 9);
//     assert.deepStrictEqual(res6._getData().auction.maxBidder, "Fred");

//     const req7 = httpMocks.createRequest(
//         {method: 'GET', url: '/api/get', query: {name: "chair"}});
//     const res7 = httpMocks.createResponse();
//     getAuction(req7, res7);
//     assert.strictEqual(res7._getStatusCode(), 200);
//     assert.deepStrictEqual(res7._getData().auction.name, "chair");
//     assert.deepStrictEqual(res7._getData().auction.maxBid, 4);
//     assert.deepStrictEqual(res7._getData().auction.maxBidder, "Barney");

//     resetForTesting();
//   });

//   it('list', function() {
//     const req1 = httpMocks.createRequest(
//         {method: 'GET', url: '/api/list', query: {}});
//     const res1 = httpMocks.createResponse();
//     listAuctions(req1, res1);
//     assert.strictEqual(res1._getStatusCode(), 200);
//     assert.deepStrictEqual(res1._getData(), {auctions: []});

//     const req2 = httpMocks.createRequest(
//         {method: 'POST', url: '/api/add',
//          body: {name: "couch", seller: "Fred", description: "a couch",
//                 minBid: 10, minutes: 10}});
//     const res2 = httpMocks.createResponse();
//     addAuction(req2, res2);
//     assert.strictEqual(res2._getStatusCode(), 200);
//     assert.deepStrictEqual(res2._getData().auction.name, "couch");
//     assert.deepStrictEqual(res2._getData().auction.maxBid, 9);

//     const req3 = httpMocks.createRequest(
//         {method: 'POST', url: '/api/add',
//          body: {name: "chair", seller: "Barney", description: "comfy couch",
//                 minBid: 5, minutes: 5}});
//     const res3 = httpMocks.createResponse();
//     addAuction(req3, res3);
//     assert.strictEqual(res3._getStatusCode(), 200);
//     assert.deepStrictEqual(res3._getData().auction.name, "chair");
//     assert.deepStrictEqual(res3._getData().auction.maxBid, 4);

//     const req4 = httpMocks.createRequest(
//         {method: 'POST', url: '/api/add',
//          body: {name: "stool", seller: "Kevin", description: "correctness stool",
//                 minBid: 15, minutes: 15}});
//     const res4 = httpMocks.createResponse();
//     addAuction(req4, res4);
//     assert.strictEqual(res4._getStatusCode(), 200);
//     assert.deepStrictEqual(res4._getData().auction.name, "stool");
//     assert.deepStrictEqual(res4._getData().auction.maxBid, 14);

//     // NOTE: chair goes first because it finishes sooner
//     const req5 = httpMocks.createRequest(
//         {method: 'GET', url: '/api/list', query: {}});
//     const res5 = httpMocks.createResponse();
//     listAuctions(req5, res5);
//     assert.strictEqual(res5._getStatusCode(), 200);
//     assert.deepStrictEqual(res5._getData().auctions.length, 3);
//     assert.deepStrictEqual(res5._getData().auctions[0].name, "chair");
//     assert.deepStrictEqual(res5._getData().auctions[1].name, "couch");
//     assert.deepStrictEqual(res5._getData().auctions[2].name, "stool");

//    // Push time forward by over 5 minutes
//    advanceTimeForTesting(5 * 60 * 1000 + 50); 
         
//    // NOTE: chair goes after because it has finished
//    const req6 = httpMocks.createRequest(
//        {method: 'GET', url: '/api/list', query: {}});
//    const res6 = httpMocks.createResponse();
//    listAuctions(req6, res6);
//    assert.strictEqual(res6._getStatusCode(), 200);
//    assert.deepStrictEqual(res6._getData().auctions.length, 3);
//    assert.deepStrictEqual(res6._getData().auctions[0].name, "couch");
//    assert.deepStrictEqual(res6._getData().auctions[1].name, "stool");
//    assert.deepStrictEqual(res6._getData().auctions[2].name, "chair");
       
//    // Push time forward by another 5 minutes
//    advanceTimeForTesting(5 * 60 * 1000);
   
//    // NOTE: chair stays after because it finished first
//    const req7 = httpMocks.createRequest(
//        {method: 'GET', url: '/api/list', query: {}});
//    const res7 = httpMocks.createResponse();
//    listAuctions(req7, res7);
//    assert.strictEqual(res7._getStatusCode(), 200);
//    assert.deepStrictEqual(res7._getData().auctions.length, 3);
//    assert.deepStrictEqual(res7._getData().auctions[0].name, "stool");
//    assert.deepStrictEqual(res7._getData().auctions[1].name, "couch");
//    assert.deepStrictEqual(res7._getData().auctions[2].name, "chair");

//    // Push time forward by another 20 minutes (all are completed)
//    advanceTimeForTesting(20 * 60 * 1000);
   
//    // NOTE: chair stays after because it finished first
//    const req8 = httpMocks.createRequest(
//        {method: 'GET', url: '/api/list', query: {}});
//    const res8 = httpMocks.createResponse();
//    listAuctions(req8, res8);
//    assert.strictEqual(res8._getStatusCode(), 200);
//    assert.deepStrictEqual(res8._getData().auctions.length, 3);
//    assert.deepStrictEqual(res8._getData().auctions[0].name, "stool");
//    assert.deepStrictEqual(res8._getData().auctions[1].name, "couch");
//    assert.deepStrictEqual(res8._getData().auctions[2].name, "chair");

//     resetForTesting();
//   });
});
