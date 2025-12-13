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



test.describe("Successful Planner block", async () => {

    test.describe("test valid put endpoint calls", async () => {
        test("successful planner creation", async ({ request }) => {
            const updatedUser = "test-user-456";

            const testPlanner = {
                ...mockPlanner,
                userId: updatedUser
            };

            const response = await request.put(`${BASE_URL}/updatePlanner`, {
                data: {
                    planner: testPlanner
                },
                headers: {
                    'x-test-user-id': 'test-user-456'
                }
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe("New planner created successfully");
            expect(body.plannerId).toBe("test-user-456");

            const deleteResponse = await request.delete(`${BASE_URL}/deletePlannerForUser`, {
                headers: {
                    'x-test-user-id': updatedUser
                }
            });

            expect(deleteResponse.status()).toBe(200);
        });

        test("successful planner update", async ({ request }) => {
            const updatedUser = "test-user-123";

            const testPlanner = {
                ...mockPlanner,
                userId: updatedUser
            };

            // First create a planner
            await request.put(`${BASE_URL}/updatePlanner`, {
                data: {
                    planner: testPlanner
                },
                headers: {
                    'x-test-user-id': 'test-user-123'
                }
            });

            // Then update it
            const updatedPlanner = {
                ...mockPlanner,
                weeks: 4,
                userId: updatedUser
            };

            const response = await request.put(`${BASE_URL}/updatePlanner`, {
                data: {
                    planner: updatedPlanner
                },
                headers: {
                    'x-test-user-id': 'test-user-123'
                }
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe("Planner for user test-user-123 has been updated");

            const deleteResponse = await request.delete(`${BASE_URL}/deletePlannerForUser`, {
                headers: {
                    'x-test-user-id': updatedUser
                }
            });

            expect(deleteResponse.status()).toBe(200);
        });
    });

    test.describe("check the get endpoints", async () => {
        test("successfully get planner", async ({ request }) => {
            const testUserId = 'test-user-get-planner';
            const testPlanner = {
                ...mockPlanner,
                userId: testUserId  // Match the userId to the header
            };
            // First create a planner
            await request.put(`${BASE_URL}/updatePlanner`, {
                data: {
                    planner: testPlanner
                },
                headers: {
                    'x-test-user-id': 'test-user-get-planner'
                }
            });

            // Then retrieve it
            const response = await request.get(`${BASE_URL}/getPlannerForUser/test-user-get-planner`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body).toHaveProperty("planner");

            const deleteResponse = await request.delete(`${BASE_URL}/deletePlannerForUser`, {
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            expect(deleteResponse.status()).toBe(200);
        });

        test("add, get, update and get planner again", async ({ request }) => {
            // First create a planner
            await request.put(`${BASE_URL}/updatePlanner`, {
                data: {
                    planner: mockPlanner
                },
                headers: {
                    'x-test-user-id': 'test-user-planner'
                }
            });

            // Add small delay to ensure Firestore write completes
            await new Promise(resolve => setTimeout(resolve, 100));

            // Then retrieve it
            const initialResponse = await request.get(`${BASE_URL}/getPlannerForUser/test-user-planner`);

            expect(initialResponse.status()).toBe(200);

            const initialBody = await initialResponse.json();
            expect(initialBody.success).toBe(true);
            expect(initialBody.planner.startDate.day).toBe("1");
            expect(initialBody.planner.startDate.month).toBe("12");
            expect(initialBody.planner.startDate.year).toBe("2025");

            const updatedPlanner = {
                ...mockPlanner,
                startDate: {
                    day: "2",
                    month: "03",
                    year: "2034"
                }
            };

            // Update planner
            await request.put(`${BASE_URL}/updatePlanner`, {
                data: {
                    planner: updatedPlanner
                },
                headers: {
                    'x-test-user-id': 'test-user-planner'
                }
            });

            // Add small delay to ensure Firestore write completes
            await new Promise(resolve => setTimeout(resolve, 100));

            // Then retrieve updated one
            const updatedResponse = await request.get(`${BASE_URL}/getPlannerForUser/test-user-planner`);

            expect(updatedResponse.status()).toBe(200);

            const updatedBody = await updatedResponse.json();
            expect(updatedBody.success).toBe(true);
            expect(updatedBody.planner.startDate.day).toBe("2");
            expect(updatedBody.planner.startDate.month).toBe("03");
            expect(updatedBody.planner.startDate.year).toBe("2034");

            const deleteResponse = await request.delete(`${BASE_URL}/deletePlannerForUser`, {
                headers: {
                    'x-test-user-id': 'test-user-planner'
                }
            });

            expect(deleteResponse.status()).toBe(200);

        });
    });


    test.describe("check planner deletion", async () => {
        test("add and delete a planner", async ({ request }) => {
            const testUserId = 'test-user-delete-planner-1';
            const testPlanner = {
                ...mockPlanner,
                userId: testUserId
            };

            // First create a planner
            await request.put(`${BASE_URL}/updatePlanner`, {
                data: {
                    planner: testPlanner
                },
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            // Then delete it
            const response = await request.delete(`${BASE_URL}/deletePlannerForUser`, {
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe("Planner deleted successfully");

        });

        test("attempt to get a deleted plan", async ({ request }) => {
            const testUserId = 'random-user';
            const testPlanner = {
                ...mockPlanner,
                userId: testUserId
            };

            // First create a planner
            const putResponse = await request.put(`${BASE_URL}/updatePlanner`, {
                data: {
                    planner: testPlanner
                },
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            const putBody = await putResponse.json();


            // Then delete it
            const response = await request.delete(`${BASE_URL}/deletePlannerForUser`, {
                headers: {
                    'x-test-user-id': testUserId
                }
            });
            const body = await response.json();


            expect(response.status()).toBe(200);

            
            expect(body.success).toBe(true);
            expect(body.message).toBe("Planner deleted successfully");

            const getResponse = await request.get(`${BASE_URL}/checkUserPlannerExists/${testUserId}`);

            expect(getResponse.status()).toBe(200);
            const getBody = await getResponse.json();

            expect(getBody.success).toBe(true);
            expect(getBody.exists).toBe(false);

        });
    });


    test.describe("check the endpoint for checking if a planner is in storage", async () => {
        test("existing planner returns exists true", async ({ request }) => {
            const testUserId = 'test-user-check-exists';
            const testPlanner = {
                ...mockPlanner,
                userId: testUserId
            };

            // First create a planner
            await request.put(`${BASE_URL}/updatePlanner`, {
                data: {
                    planner: testPlanner
                },
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            // Then check it exists
            const response = await request.get(`${BASE_URL}/checkUserPlannerExists/${testUserId}`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.exists).toBe(true);

            const deleteResponse = await request.delete(`${BASE_URL}/deletePlannerForUser`, {
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            expect(deleteResponse.status()).toBe(200);
        });
    });

});
