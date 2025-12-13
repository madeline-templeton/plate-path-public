import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:8080";




// Check the endpoint to get the user consent 
test.describe("check actual firebase consent calls", () => {


    test("test creating user consent", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-123",
                sensitiveConsent: "granted",
                generalConsent: "granted"
            }, 
            headers: {
                'x-test-user-id': "test-user-123"
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.message).toBe("Sensitive consent granted successfully; General Consent granted successfully");

        const deleteResponse = await request.delete(`${BASE_URL}/deleteUserConsent`, {
            headers: {
                'x-test-user-id': "test-user-123"
            }
        });

        expect(deleteResponse.status()).toBe(200);
    });

    test("test creating and then updating user consent while getting them", async ({ request }) => {
        const creatingResponse = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-456",
                sensitiveConsent: "granted",
                generalConsent: "granted"
            }, 
            headers: {
                'x-test-user-id': "test-user-456"
            }
        });

        expect(creatingResponse.status()).toBe(200);

        const creatingBody = await creatingResponse.json();
        expect(creatingBody.success).toBe(true);
        expect(creatingBody.message).toBe("Sensitive consent granted successfully; General Consent granted successfully");


        const getCreatingResponse = await request.get(`${BASE_URL}/getUserConsent/test-user-456`);

        expect(getCreatingResponse.status()).toBe(200);

        const getCreatingBody = await getCreatingResponse.json();

        expect(getCreatingBody.success).toBe(true);
        expect(getCreatingBody.exists).toBe(true);
        expect(getCreatingBody.sensitiveConsent).toBe("granted");
        expect(getCreatingBody.generalConsent).toBe("granted");



        const updatingResponse = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-456",
                sensitiveConsent: "granted",
                generalConsent: "revoked"
            }, 
            headers: {
                'x-test-user-id': "test-user-456"
            }
        });

        expect(updatingResponse.status()).toBe(200);

        const updatingBody = await updatingResponse.json();
        expect(updatingBody.success).toBe(true);
        expect(updatingBody.message).toBe("Consent updated successfully");

        const getUpdatingResponse = await request.get(`${BASE_URL}/getUserConsent/test-user-456`);

        expect(getUpdatingResponse.status()).toBe(200);

        const getUpdatingBody = await getUpdatingResponse.json();

        expect(getUpdatingBody.success).toBe(true);
        expect(getUpdatingBody.exists).toBe(true);
        expect(getUpdatingBody.sensitiveConsent).toBe("granted");
        expect(getUpdatingBody.generalConsent).toBe("revoked");


        const deleteResponse = await request.delete(`${BASE_URL}/deleteUserConsent`, {
            headers: {
                'x-test-user-id': "test-user-456"
            }
        });

        expect(deleteResponse.status()).toBe(200);
    });

    test("test creating and then updating both at the same time", async ({ request }) => {
        const creatingResponse = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-789",
                sensitiveConsent: "revoked",
                generalConsent: "revoked"
            }, 
            headers: {
                'x-test-user-id': "test-user-789"
            }
        });


        expect(creatingResponse.status()).toBe(200);

        const creatingBody = await creatingResponse.json();
        expect(creatingBody.success).toBe(true);
        expect(creatingBody.message).toBe("Sensitive consent revoked successfully; General Consent revoked successfully");


        const getCreatingResponse = await request.get(`${BASE_URL}/getUserConsent/test-user-789`);

        expect(getCreatingResponse.status()).toBe(200);

        const getCreatingBody = await getCreatingResponse.json();

        expect(getCreatingBody.success).toBe(true);
        expect(getCreatingBody.exists).toBe(true);
        expect(getCreatingBody.sensitiveConsent).toBe("revoked");
        expect(getCreatingBody.generalConsent).toBe("revoked");



        const updatingResponse = await request.put(`${BASE_URL}/updateUserConsent`,  {
            data: {
                providedUserId: "test-user-789",
                sensitiveConsent: "granted",
                generalConsent: "granted"
            }, 
            headers: {
                'x-test-user-id': "test-user-789"
            }
        });

        expect(updatingResponse.status()).toBe(200);

        const updatingBody = await updatingResponse.json();
        expect(updatingBody.success).toBe(true);
        expect(updatingBody.message).toBe("Consent updated successfully");

        const getUpdatingResponse = await request.get(`${BASE_URL}/getUserConsent/test-user-789`);

        expect(getUpdatingResponse.status()).toBe(200);

        const getUpdatingBody = await getUpdatingResponse.json();

        expect(getUpdatingBody.success).toBe(true);
        expect(getUpdatingBody.exists).toBe(true);
        expect(getUpdatingBody.sensitiveConsent).toBe("granted");
        expect(getUpdatingBody.generalConsent).toBe("granted");

        const deleteResponse = await request.delete(`${BASE_URL}/deleteUserConsent`, {
            headers: {
                'x-test-user-id': "test-user-789"
            }
        });

        expect(deleteResponse.status()).toBe(200);

    });
});