import { test, expect } from '@playwright/test';

const BASE_URL = "http://localhost:8080";




test.describe("Successful voting information block", async () => {
    test.afterAll(async ({ request }) => {
        console.log('Done with tests');

        const users = ["test-user-456", "test-user-123", "test-user-789", "test-user-abc", "test-user-def", "test-user-check"]

        for (const user of users){
            const response = await request.delete(`${BASE_URL}/deleteUserMealVotes`, {
                headers: {
                    'x-test-user-id': user
                }
            });
            const body = await response.json();
            if (!body.success){
                console.log("Problem");
            }
        }
        
    });

    // Test PUT endpoint 
    test.describe("updateUserMealVote successful updating", () => {
        test("successful liked meal vote creation", async ({ request }) => {
            const response = await request.put(`${BASE_URL}/updateUserMealVote`, {
                data: {
                    mealId: "67890",
                    mealName: "Pasta Primavera",
                    liked: true
                },
                headers: {
                    'x-test-user-id': 'test-user-456'
                }
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe(`Meal voting for user test-user-456 created successfully`);
        });

        test("successful disliked meal vote creation", async ({ request }) => {
            const response = await request.put(`${BASE_URL}/updateUserMealVote`, {
                data: {
                    mealId: "67890",
                    mealName: "Pasta Primavera",
                    liked: false
                },
                headers: {
                    'x-test-user-id': 'test-user-123'
                }
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe(`Meal voting for user test-user-123 created successfully`);
        });


        test("create a vote and then update it", async ({ request }) => {
            const creatingResponse = await request.put(`${BASE_URL}/updateUserMealVote`, {
                data: {
                    mealId: "12345",
                    mealName: "Kung Pao Chicken",
                    liked: false
                },
                headers: {
                    'x-test-user-id': 'test-user-789'
                }
            });

            expect(creatingResponse.status()).toBe(200);

            const creatingBody = await creatingResponse.json();
            expect(creatingBody.success).toBe(true);
            expect(creatingBody.message).toBe(`Meal voting for user test-user-789 created successfully`);

            const updatingResponse = await request.put(`${BASE_URL}/updateUserMealVote`, {
                data: {
                    mealId: "12345",
                    mealName: "Kung Pao Chicken",
                    liked: true
                },
                headers: {
                    'x-test-user-id': 'test-user-789'
                }
            });

            expect(updatingResponse.status()).toBe(200);

            const updatingBody = await updatingResponse.json();
            expect(updatingBody.success).toBe(true);
            expect(updatingBody.alreadyExisted).toBe(false);
            expect(updatingBody.message).toBe("Liked meal updated successfully");
        });

        test("create a vote and then remove it", async ({ request }) => {
            const creatingResponse = await request.put(`${BASE_URL}/updateUserMealVote`, {
                data: {
                    mealId: "12345",
                    mealName: "Kung Pao Chicken",
                    liked: true
                },
                headers: {
                    'x-test-user-id': 'test-user-abc'
                }
            });

            expect(creatingResponse.status()).toBe(200);

            const creatingBody = await creatingResponse.json();
            expect(creatingBody.success).toBe(true);
            expect(creatingBody.message).toBe(`Meal voting for user test-user-abc created successfully`);

            const updatingResponse = await request.put(`${BASE_URL}/updateUserMealVote`, {
                data: {
                    mealId: "12345",
                    mealName: "Kung Pao Chicken",
                    liked: true
                },
                headers: {
                    'x-test-user-id': 'test-user-abc'
                }
            });

            expect(updatingResponse.status()).toBe(200);

            const updatingBody = await updatingResponse.json();
            expect(updatingBody.success).toBe(true);
            expect(updatingBody.alreadyExisted).toBe(true);
            expect(updatingBody.message).toBe("Liked meal updated successfully");
        });
    });


    // Test the /getUserMealVotesSuccess GET endpoint
    test.describe("getUserMealVotes success", () => {
        test("successful get meal votes", async ({ request }) => {
            // First create a vote
            await request.put(`${BASE_URL}/updateUserMealVote`, {
                data: {
                    mealId: "111",
                    mealName: "Test Meal",
                    liked: true
                },
                headers: {
                    'x-test-user-id': 'test-user-def'
                }
            });

            // Then retrieve it
            const response = await request.get(`${BASE_URL}/getUserMealVotes/test-user-def`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body).toHaveProperty("liked");
            expect(body).toHaveProperty("disliked");
        });
    });


    test.describe("checkIfMealVoted success", () => {
        test("successful check meal voted", async ({ request }) => {
            // First create a vote
            await request.put(`${BASE_URL}/updateUserMealVote`, {
                data: {
                    mealId: "999",
                    mealName: "Check Test Meal",
                    liked: true
                },
                headers: {
                    'x-test-user-id': 'test-user-check'
                }
            });

            // Then check it
            const response = await request.get(`${BASE_URL}/checkIfMealVoted/test-user-check?mealId=999`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.hasVotes).toBe(true);
            expect(body.mealPresent).toBe(true);
            expect(body.liked).toBe(true);
        });
    });

    test.describe("delete meal vote successfully", () => {
        test("successful delete meal votes", async ({ request }) => {
            // First create votes
            await request.put(`${BASE_URL}/updateUserMealVote`, {
                data: {
                    mealId: "delete-test",
                    mealName: "Delete Test Meal",
                    liked: true
                },
                headers: {
                    'x-test-user-id': 'test-user-delete'
                }
            });

            // Then delete them
            const response = await request.delete(`${BASE_URL}/deleteUserMealVotes`, {
                headers: {
                    'x-test-user-id': 'test-user-delete'
                }
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe("Successfully deleted voted meals for user test-user-delete");
        });
    });


});

