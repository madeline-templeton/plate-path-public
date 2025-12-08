import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:8080";

// Mock user information data for testing
const mockUserInfo = {
    userId: "test-user-info",
    age: 25,
    sex: "M",
    height: {
        value: [5, 10],
        unit: "ft-in"
    },
    weight: {
        value: 180,
        unit: "lb"
    },
    activityLevel: "moderately-active",
    weightGoal: "maintain",
    dietaryRestrictions: ["vegetarian"],
    weeks: 2,
    downvotedMealIds: [],
    preferredMealIds: [],
    date: {
        day: "1",
        month: "12",
        year: "2025"
    }
};

// Test PUT /updateUserInformation endpoint
test.describe("updateUserInformation endpoint error messages", () => {
    test("no authentication returns 401", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserInformation`, {
            data: {
                userInfo: mockUserInfo
            },
            headers: {
                'x-test-user-id': ''
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Unauthorised: No token provided");
    });

    test("invalid user info returns 400", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserInformation`, {
            data: {
                userInfo: {
                    userId: "test-user",
                    age: "invalid",  
                }
            },
            headers: {
                'x-test-user-id': 'test-user-info'
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Invalid user information provided");
    });

    test("mismatched userId returns 403", async ({ request }) => {
        const userInfoWithDifferentUser = {
            ...mockUserInfo,
            userId: "different-user"
        };

        const response = await request.put(`${BASE_URL}/updateUserInformation`, {
            data: {
                userInfo: userInfoWithDifferentUser
            },
            headers: {
                'x-test-user-id': 'test-user-info'
            }
        });
        const body = await response.json();
        console.log(body);

        expect(response.status()).toBe(403);

        
        expect(body.success).toBe(false);
        expect(body.message).toBe("Forbidden: You may not edit a user information that isn't yours");
    });

});

// Test GET /getUserInformation/:userId endpoint
test.describe("getUserInformation endpoint error messages", () => {
    test("empty userId returns 400", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/getUserInformation/`);

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Missing fields");
    });

    test("non-existent user info returns 404", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/getUserInformation/nonexistent-user-info`);

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("No information found for user nonexistent-user-info");
    });

});

// Test DELETE /deleteUserInformation endpoint
test.describe("deleteUserInformation endpoint error messages", () => {
    test("no authentication returns 401", async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/deleteUserInfo`, {
            headers: {
                'x-test-user-id': ''
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Unauthorised: No token provided");
    });

    test("non-existent user info returns 404", async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/deleteUserInfo`, {
            headers: {
                'x-test-user-id': 'user-with-no-info'
            }
        });

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("No doc found to delete for user user-with-no-info");
    });
});

// Test GET /checkUserInformationExists/:userId endpoint
test.describe("checkUserInformationExists endpoint error messages", () => {
    test("empty userId returns 400", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/checkIfInfoInStorage/`);

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("No userId provided");
    });

    test("non-existent user info returns exists false", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/checkIfInfoInStorage/user-with-no-info-check`);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.exists).toBe(false);
    });

});
