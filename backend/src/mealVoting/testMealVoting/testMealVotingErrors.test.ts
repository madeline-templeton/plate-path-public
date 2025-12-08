import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:8080";

// Test PUT /updateUserMealVote endpoint
test.describe("updateUserMealVote endpoint error messages", () => {
    test("missing mealId returns 400", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserMealVote`, {
            data: {
                mealName: "Test Meal",
                liked: true
            },
            headers: {
                'x-test-user-id': 'test-user-123'
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Invalid fields");
    });

    test("missing mealName returns 400", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserMealVote`, {
            data: {
                mealId: "12345",
                liked: true
            },
            headers: {
                'x-test-user-id': 'test-user-123'
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Invalid fields");
    });

    test("missing liked field returns 400", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserMealVote`, {
            data: {
                mealId: "12345",
                mealName: "Test Meal"
            },
            headers: {
                'x-test-user-id': 'test-user-123'
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Invalid fields");
    });

    test("no authentication returns 401", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updateUserMealVote`, {
            data: {
                mealId: "12345",
                mealName: "Test Meal",
                liked: true
            },
            headers: {
                'x-test-user-id': ''
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthorised: No token provided");
    });

    
});

// Test GET /getUserMealVotes/:userId endpoint
test.describe("getUserMealVotes endpoint error messages", () => {
    test("empty userId returns 400", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/getUserMealVotes/`);

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Missing fields");
    });

    test("non-existent user returns 404", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/getUserMealVotes/nonexistent-user`);

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toContain("No preferences found for user nonexistent-user");
    });

});

// Test GET /checkIfMealVoted/:userId endpoint
test.describe("checkIfMealVoted endpoint error messages", () => {
    test("missing userId returns 400", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/checkIfMealVoted/?mealId=123`);

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Missing fields");
    });

    test("missing mealId returns 400", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/checkIfMealVoted/test-user-123`);

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Missing fields");
    });

    test("non-existent user returns no votes", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/checkIfMealVoted/nonexistent-user?mealId=123`);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.hasVotes).toBe(false);
        expect(body.mealPresent).toBe(false);
    });

});

// Test DELETE /deleteUserMealVotes endpoint
test.describe("deleteUserMealVotes endpoint error messages", () => {
    test("no authentication returns 401", async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/deleteUserMealVotes`, {
            headers: {
                'x-test-user-id': ''
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Unauthorised: No token provided");
    });

    test("non-existent votes returns 404", async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/deleteUserMealVotes`, {
            headers: {
                'x-test-user-id': 'user-with-no-votes'
            }
        });

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toContain("No votes to delete");
    });

});
