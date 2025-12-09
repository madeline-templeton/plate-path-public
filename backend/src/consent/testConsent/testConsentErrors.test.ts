import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:8080";

// Check the endpoint to get the user consent 
test.describe("check get endpoint error messages", () => {
    test("no user id passed in returns 400", async ({ request }) => {

        const response = await request.get(`${BASE_URL}/getUserConsent/`);
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty("success");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("exists");

        expect(body.success).toBe(false);
        expect(body.exists).toBe(false);


    });

    // While this is technically not an error message, it is unsuccessful
    test("non-existent user id returns 200", async ({ request }) => {

        const response = await request.get(`${BASE_URL}/getUserConsent/jeff`);
        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty("success");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("exists");

        expect(body.success).toBe(true);
        expect(body.exists).toBe(false);


    });
});

// Here we test the put endpoint
// We had to use create a mock auth function specifically for testing
test.describe("put endpoint error messages",  () => {
    test("test input with no provided user id", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                sensitiveConsent: "granted",
                generalConsent: "granted"
            }, 
            headers: {
                'x-test-user-id': "'test-user-123'" // Mock user ID
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Incorrect input provided");
    });

    test("test input with no sensitive consent", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-123",
                generalConsent: "granted"
            }, 
            headers: {
                'x-test-user-id': 'test-user-123' // Mock user ID
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Incorrect input provided");
    });


    test("test input with no provided general consent", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-123",
                sensitiveConsent: "granted"
            }, 
            headers: {
                'x-test-user-id': 'test-user-123' // Mock user ID
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Incorrect input provided");
    });

    test("test correct input with no authentication", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-123",
                sensitiveConsent: "granted",
                generalConsent: "granted"
            }, 
            headers: {
                'x-test-user-id': "" 
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Unauthorised: No token provided");
    });


    test("test correct input with incorrect id", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "incorrectId",
                sensitiveConsent: "granted",
                generalConsent: "granted"
            }, 
            headers: {
                'x-test-user-id': "test-user-123"
            }
        });

        expect(response.status()).toBe(403);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("You may not edit another user's settings");
    });
});



