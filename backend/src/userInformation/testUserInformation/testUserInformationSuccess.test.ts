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



test.describe("Successful user information block", async () => {

    test.describe("test the update endpoint with valid input", async () => {
        test("successful user info creation", async ({ request }) => {
            const updatedInfo = {
                ...mockUserInfo,
                userId: "test-create-user-info"
            }
            const response = await request.put(`${BASE_URL}/updateUserInformation`, {
                data: {
                    userInfo: updatedInfo
                },
                headers: {
                    'x-test-user-id': 'test-create-user-info'
                }
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe("User Information doc created successfully");

            const deleteResponse = await request.delete(`${BASE_URL}/deleteUserInfo`, {
                headers: {
                    'x-test-user-id': "test-create-user-info"
                }
            });

            expect(deleteResponse.status()).toBe(200);
        });

        test("successful user info update", async ({ request }) => {
            const updatedInfo = {
                ...mockUserInfo,
                userId: "test-update-user-info"
            }
            // First create user info
            await request.put(`${BASE_URL}/updateUserInformation`, {
                data: {
                    userInfo: updatedInfo
                },
                headers: {
                    'x-test-user-id': 'test-update-user-info'
                }
            });

            // Then update it
            const updatedUserInfo = {
                ...updatedInfo,
                age: 30,
                weight: {
                    value: 175,
                    unit: "lb"
                }
            };

            const response = await request.put(`${BASE_URL}/updateUserInformation`, {
                data: {
                    userInfo: updatedUserInfo
                },
                headers: {
                    'x-test-user-id': 'test-update-user-info'
                }
            });

            

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe("User Information doc updated successfully");

            // Add small delay to ensure Firestore write completes
            await new Promise(resolve => setTimeout(resolve, 100));

            // Get the data and check that is was updated correctly
            const getResponse = await request.get(`${BASE_URL}/getUserInformation/test-update-user-info`);

            expect(getResponse.status()).toBe(200);

            const getBody = await getResponse.json();

            expect(getBody.userInfo.age).toBe(30);
            expect(getBody.userInfo.weight.value).toBe(175);
            expect(getBody.userInfo.weight.unit).toBe("lb");
            expect(getBody.userInfo.dietaryRestrictions).toStrictEqual(["vegetarian"]);

            const deleteResponse = await request.delete(`${BASE_URL}/deleteUserInfo`, {
                headers: {
                    'x-test-user-id': "test-update-user-info"
                }
            });

            expect(deleteResponse.status()).toBe(200);

        });
    });

    test.describe("test the endpoint to get the user information", async () => {
        test("successful get user information", async ({ request }) => {
            const updatedInfo = {
                ...mockUserInfo,
                userId: "test-get-user-info",
                age: 64
            }
            // First create user info
            await request.put(`${BASE_URL}/updateUserInformation`, {
                data: {
                    userInfo: updatedInfo
                },
                headers: {
                    'x-test-user-id': "test-get-user-info"
                }
            });

            // Add small delay to ensure Firestore write completes
            await new Promise(resolve => setTimeout(resolve, 100));

            // Then retrieve it
            const response = await request.get(`${BASE_URL}/getUserInformation/test-get-user-info`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body).toHaveProperty("userInfo");
            expect(body.userInfo.age).toBe(updatedInfo.age);
            expect(body.userInfo.sex).toBe("M");

            const deleteResponse = await request.delete(`${BASE_URL}/deleteUserInfo`, {
                headers: {
                    'x-test-user-id': "test-get-user-info"
                }
            });

            expect(deleteResponse.status()).toBe(200);
        });
    });


    test.describe("test the delete endpoint", async () => {

        test("successful delete user information", async ({ request }) => {
            const testUserId = 'test-user-delete-info';
            const testUserInfo = {
                ...mockUserInfo,
                userId: testUserId
            };

            // First create user info
            await request.put(`${BASE_URL}/updateUserInformation`, {
                data: {
                    userInfo: testUserInfo
                },
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            // Add small delay to ensure Firestore write completes
            await new Promise(resolve => setTimeout(resolve, 100));


            // Check that it is stored
            const initialGetResponse = await request.get(`${BASE_URL}/checkIfInfoInStorage/${testUserId}`);

            expect(initialGetResponse.status()).toBe(200);

            const initialGetBody = await initialGetResponse.json();
            expect(initialGetBody.success).toBe(true);
            expect(initialGetBody.exists).toBe(true);

            // Then delete it
            const response = await request.delete(`${BASE_URL}/deleteUserInfo`, {
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe("User information deleted successfully");

            // Add small delay to ensure Firestore write completes
            await new Promise(resolve => setTimeout(resolve, 100));

            // Check that it isn't in storage anymore
            const getResponse = await request.get(`${BASE_URL}/checkIfInfoInStorage/${testUserId}`);

            expect(getResponse.status()).toBe(200);

            const getBody = await getResponse.json();
            expect(getBody.success).toBe(true);
            expect(getBody.exists).toBe(false);

        });

    });


    test.describe("test the get endpoint that checks if userInfo is stored", async () => {
        test("existing user info returns exists true", async ({ request }) => {
            const testUserId = 'test-user-check-info-exists';
            const testUserInfo = {
                ...mockUserInfo,
                userId: testUserId
            };

            // First create user info
            await request.put(`${BASE_URL}/updateUserInformation`, {
                data: {
                    userInfo: testUserInfo
                },
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            // Then check it exists
            const response = await request.get(`${BASE_URL}/checkIfInfoInStorage/${testUserId}`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.exists).toBe(true);

            const deleteResponse = await request.delete(`${BASE_URL}/deleteUserInfo`, {
                headers: {
                    'x-test-user-id': testUserId
                }
            });

            expect(deleteResponse.status()).toBe(200);
        });
    });

});


