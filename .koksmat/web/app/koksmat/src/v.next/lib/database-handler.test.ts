export const REMOVE_ME = 1;
// // databaseHandler.test.ts

// import { z } from "zod";

// import { kError, kInfo, kVerbose } from "@/lib/koksmat-logger-client";
// import { DatabaseHandler } from "./database-handler";

// // Mocking the logging functions
// jest.mock("@/lib/koksmat-logger-client", () => ({
//   kError: jest.fn(),
//   kInfo: jest.fn(),
//   kVerbose: jest.fn(),
// }));

// // Define a sample Zod schema
// const userSchema = z.object({
//   tenant: z.string(),
//   searchindex: z.string(),
//   name: z.string(),
//   description: z.string().optional(),
//   Translations: z.object({}).passthrough().optional(),
//   email: z.string().email(),
//   firstname: z.string(),
//   lastname: z.string(),
//   language_id: z.number().int(),
//   country_id: z.number().int(),
//   region_id: z.number().int(),
//   status: z.string(),
// });

// // Mock MessageProvider
// const mockMessageProvider = {
//   send: jest.fn(),
// };

// // Mock getToken function
// const mockGetToken = jest.fn(() => "mock-token");

// describe("DatabaseHandler", () => {
//   let handler: DatabaseHandler<typeof userSchema>;

//   beforeEach(() => {
//     handler = new DatabaseHandler(
//       userSchema,
//       mockMessageProvider,
//       mockGetToken
//     );
//     jest.clearAllMocks();
//   });

//   describe("create method", () => {
//     it("should create data successfully", async () => {
//       const validData = {
//         tenant: "tenant123",
//         searchindex: "index123",
//         name: "John Doe",
//         email: "john.doe@example.com",
//         firstname: "John",
//         lastname: "Doe",
//         language_id: 1,
//         country_id: 2,
//         region_id: 3,
//         status: "active",
//       };

//       mockMessageProvider.send.mockResolvedValueOnce({ success: true });

//       const response = await handler.create(validData);

//       expect(kVerbose).toHaveBeenCalledWith("Starting create operation");
//       expect(kVerbose).toHaveBeenCalledWith(
//         "Data validated successfully for create operation"
//       );
//       expect(kVerbose).toHaveBeenCalledWith(
//         "Dispatching create message via message provider"
//       );
//       expect(kInfo).toHaveBeenCalledWith(
//         "Create operation completed successfully"
//       );
//       expect(mockMessageProvider.send).toHaveBeenCalled();
//       expect(response).toEqual({ success: true });
//     });

//     it("should handle validation errors", async () => {
//       const invalidData = {
//         // Missing required fields
//         email: "not-an-email",
//         language_id: "not-a-number",
//       };

//       await expect(handler.create(invalidData as any)).rejects.toBeInstanceOf(
//         z.ZodError
//       );

//       expect(kVerbose).toHaveBeenCalledWith("Starting create operation");
//       expect(kVerbose).toHaveBeenCalledWith("Validation failed", invalidData);
//       expect(kError).toHaveBeenCalledWith(
//         "Validation error in create operation",
//         expect.any(z.ZodError)
//       );
//       expect(mockMessageProvider.send).not.toHaveBeenCalled();
//     });
//   });

//   describe("update method", () => {
//     it("should update data successfully", async () => {
//       const validData = {
//         tenant: "tenant123",
//         searchindex: "index123",
//         name: "Jane Doe",
//         email: "jane.doe@example.com",
//         firstname: "Jane",
//         lastname: "Doe",
//         language_id: 1,
//         country_id: 2,
//         region_id: 3,
//         status: "active",
//       };

//       mockMessageProvider.send.mockResolvedValueOnce({ success: true });

//       const response = await handler.update(1, validData);

//       expect(kVerbose).toHaveBeenCalledWith(
//         "Starting update operation for id 1"
//       );
//       expect(kVerbose).toHaveBeenCalledWith(
//         "Data validated successfully for update operation on id 1"
//       );
//       expect(kVerbose).toHaveBeenCalledWith(
//         "Dispatching update message via message provider for id 1"
//       );
//       expect(kInfo).toHaveBeenCalledWith(
//         "Update operation completed successfully for id 1"
//       );
//       expect(mockMessageProvider.send).toHaveBeenCalled();
//       expect(response).toEqual({ success: true });
//     });

//     it("should handle validation errors", async () => {
//       const invalidData = {
//         email: "invalid-email",
//       };

//       await expect(
//         handler.update(1, invalidData as any)
//       ).rejects.toBeInstanceOf(z.ZodError);

//       expect(kVerbose).toHaveBeenCalledWith(
//         "Starting update operation for id 1"
//       );
//       expect(kVerbose).toHaveBeenCalledWith("Validation failed", invalidData);
//       expect(kError).toHaveBeenCalledWith(
//         "Validation error in update operation for id 1",
//         expect.any(z.ZodError)
//       );
//       expect(mockMessageProvider.send).not.toHaveBeenCalled();
//     });
//   });

//   describe("patch method", () => {
//     it("should patch data successfully", async () => {
//       const partialData = {
//         firstname: "Johnny",
//       };

//       mockMessageProvider.send.mockResolvedValueOnce({ success: true });

//       const response = await handler.patch(1, partialData);

//       expect(kVerbose).toHaveBeenCalledWith(
//         "Starting patch operation for id 1"
//       );
//       expect(kVerbose).toHaveBeenCalledWith(
//         "Data validated successfully for patch operation on id 1"
//       );
//       expect(kVerbose).toHaveBeenCalledWith(
//         "Dispatching patch message via message provider for id 1"
//       );
//       expect(kInfo).toHaveBeenCalledWith(
//         "Patch operation completed successfully for id 1"
//       );
//       expect(mockMessageProvider.send).toHaveBeenCalled();
//       expect(response).toEqual({ success: true });
//     });

//     it("should handle validation errors", async () => {
//       const invalidData = {
//         email: "invalid-email",
//       };

//       await expect(handler.patch(1, invalidData)).rejects.toBeInstanceOf(
//         z.ZodError
//       );

//       expect(kVerbose).toHaveBeenCalledWith(
//         "Starting patch operation for id 1"
//       );
//       expect(kVerbose).toHaveBeenCalledWith("Validation failed", invalidData);
//       expect(kError).toHaveBeenCalledWith(
//         "Validation error in patch operation for id 1",
//         expect.any(z.ZodError)
//       );
//       expect(mockMessageProvider.send).not.toHaveBeenCalled();
//     });
//   });

//   describe("delete method", () => {
//     it("should perform soft delete successfully", async () => {
//       mockMessageProvider.send.mockResolvedValueOnce({ success: true });

//       const response = await handler.delete(1);

//       expect(kVerbose).toHaveBeenCalledWith(
//         "Starting delete operation for id 1 with softDelete=false"
//       );
//       expect(kVerbose).toHaveBeenCalledWith(
//         "Dispatching delete message via message provider for id 1 with softDelete=false"
//       );
//       expect(kInfo).toHaveBeenCalledWith(
//         "Delete operation completed successfully for id 1 with softDelete=false"
//       );
//       expect(mockMessageProvider.send).toHaveBeenCalled();
//       expect(response).toEqual({ success: true });
//     });

//     it("should perform hard delete successfully", async () => {
//       mockMessageProvider.send.mockResolvedValueOnce({ success: true });

//       const response = await handler.delete(1, true);

//       expect(kVerbose).toHaveBeenCalledWith(
//         "Starting delete operation for id 1 with softDelete=true"
//       );
//       expect(kVerbose).toHaveBeenCalledWith(
//         "Dispatching delete message via message provider for id 1 with softDelete=true"
//       );
//       expect(kInfo).toHaveBeenCalledWith(
//         "Delete operation completed successfully for id 1 with softDelete=true"
//       );
//       expect(mockMessageProvider.send).toHaveBeenCalled();
//       expect(response).toEqual({ success: true });
//     });
//   });

//   describe("restore method", () => {
//     it("should restore data successfully", async () => {
//       mockMessageProvider.send.mockResolvedValueOnce({ success: true });

//       const response = await handler.restore(1);

//       expect(kVerbose).toHaveBeenCalledWith(
//         "Starting restore operation for id 1"
//       );
//       expect(kVerbose).toHaveBeenCalledWith(
//         "Dispatching restore message via message provider for id 1"
//       );
//       expect(kInfo).toHaveBeenCalledWith(
//         "Restore operation completed successfully for id 1"
//       );
//       expect(mockMessageProvider.send).toHaveBeenCalled();
//       expect(response).toEqual({ success: true });
//     });
//   });

//   describe("error handling", () => {
//     it("should log and throw errors from messageProvider.send", async () => {
//       const validData = {
//         tenant: "tenant123",
//         searchindex: "index123",
//         name: "John Doe",
//         email: "john.doe@example.com",
//         firstname: "John",
//         lastname: "Doe",
//         language_id: 1,
//         country_id: 2,
//         region_id: 3,
//         status: "active",
//       };

//       const error = new Error("Message provider error");
//       mockMessageProvider.send.mockRejectedValueOnce(error);

//       await expect(handler.create(validData)).rejects.toThrow(
//         "Message provider error"
//       );

//       expect(kError).toHaveBeenCalledWith("Error in create operation", error);
//     });
//   });
// });
