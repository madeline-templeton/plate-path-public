import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:8080";

// Check the endpoint to get the user consent 
test.describe("check actual firebase consent calls", () => {
    test("test creating user consent", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-123",
                consent: "granted"
            }, 
            headers: {
                'x-test-user-id': "test-user-123"
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.message).toBe("Consent granted successfully");
    });

    test("test creating and then updating user consent", async ({ request }) => {
        const creatingResponse = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-456",
                consent: "granted"
            }, 
            headers: {
                'x-test-user-id': "test-user-456"
            }
        });

        expect(creatingResponse.status()).toBe(200);

        const creatingBody = await creatingResponse.json();
        expect(creatingBody.success).toBe(true);
        expect(creatingBody.message).toBe("Consent granted successfully");


        const updatingResponse = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-456",
                consent: "revoked"
            }, 
            headers: {
                'x-test-user-id': "test-user-456"
            }
        });

        expect(updatingResponse.status()).toBe(200);

        const updatingBody = await updatingResponse.json();
        expect(updatingBody.success).toBe(true);
        expect(updatingBody.message).toBe("Consent updated successfully");
    });
});