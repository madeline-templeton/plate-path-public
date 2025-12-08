import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:8080";

// Mock planner data for testing
const mockPlanner = {
    userId: "test-user-planner",
    startDate: {
        day: "1",
        month: "12",
        year: "2025"
    },
    weeks: 2,
    meals: [
        {
            date: {
                day: "1",
                month: "12",
                year: "2025"
            },
            breakfast: {
                id: 1,
                name: "Oatmeal",
                mealTime: "breakfast",
                diet: "vegetarian",
                calories: 300,
                ingredients: "oats, milk, honey",
                website: "http://example.com"
            },
            lunch: {
                id: 2,
                name: "Salad",
                mealTime: "lunch",
                diet: "vegan",
                calories: 250,
                ingredients: "lettuce, tomato, cucumber",
                website: "http://example.com"
            },
            dinner: {
                id: 3,
                name: "Pasta",
                mealTime: "dinner",
                diet: "vegetarian",
                calories: 500,
                ingredients: "pasta, tomato sauce, cheese",
                website: "http://example.com"
            }
        }
    ]
};

// Test PUT /updatePlanner endpoint
test.describe("updatePlanner endpoint error messages", () => {
    test("no authentication returns 401", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updatePlanner`, {
            data: {
                planner: mockPlanner
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

    test("invalid planner data returns 400", async ({ request }) => {
        const response = await request.put(`${BASE_URL}/updatePlanner`, {
            data: {
                planner: {
                    userId: "test-user",
                    // Missing required fields
                }
            },
            headers: {
                'x-test-user-id': "test-user"
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Input does not conform to specifications");
    });

    test("mismatched userId returns 403", async ({ request }) => {
        const plannerWithDifferentUser = {
            ...mockPlanner,
            userId: "different-user"
        };

        const response = await request.put(`${BASE_URL}/updatePlanner`, {
            data: {
                planner: plannerWithDifferentUser
            },
            headers: {
                'x-test-user-id': "test-user-planner"
            }
        });

        expect(response.status()).toBe(403);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toContain("Forbidden: You may not edit a planner that isn't yours");
    });

});

// Test GET /getPlannerForUser/:userId endpoint
test.describe("getPlannerForUser endpoint error messages", () => {
    test("empty userId returns 400", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/getPlannerForUser/`);

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Missing userId");
    });

    test("non-existent planner returns 404", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/getPlannerForUser/nonexistent-planner-user`);

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.error).toBe("No planner for user nonexistent-planner-user");
    });

});

// Test DELETE /deletePlannerForUser endpoint
test.describe("deletePlannerForUser endpoint error messages", () => {
    test("no authentication returns 401", async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/deletePlannerForUser`, {
            headers: {
                'x-test-user-id': ''
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Unauthorised: No token provided");
    });


    test("non-existent planner returns 404", async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/deletePlannerForUser`, {
            headers: {
                'x-test-user-id': 'user-with-no-planner'
            }
        });

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("No doc found to delete");
    });

});

// Test GET /checkUserPlannerExists/:userId endpoint
test.describe("checkUserPlannerExists endpoint error messages", () => {
    test("empty userId returns 400", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/checkUserPlannerExists/`);

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe("Missing userId");
    });

    test("non-existent planner returns exists false", async ({ request }) => {
        const response = await request.get(`${BASE_URL}/checkUserPlannerExists/user-with-no-planner-check`);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.exists).toBe(false);
    });

});
