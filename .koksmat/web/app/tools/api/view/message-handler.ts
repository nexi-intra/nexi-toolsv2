export const notimplemented = 1;
// import {
//   EntityType,
//   EntityTypeMap,
//   Message,
//   BackendServiceInterface,
// } from "./types";

// export class MessageHandler<T extends EntityType> {
//   private entity: T;
//   private backendService: BackendServiceInterface<T>;

//   constructor(entity: T, backendService: BackendServiceInterface<T>) {
//     this.entity = entity;
//     this.backendService = backendService;
//   }

//   async handleMessage(message: Message<T>): Promise<any> {
//     switch (message.type) {
//       case "CREATE":
//         return this.handleCreate(message.payload);
//       case "READ":
//         return this.handleRead(message.payload);
//       case "UPDATE":
//         return this.handleUpdate(message.payload);
//       case "PATCH":
//         return this.handlePatch(message.payload);
//       case "DELETE":
//         return this.handleDelete(message.payload);
//       case "QUERY":
//         return this.handleQuery(message.payload);
//       default:
//         throw new Error("Invalid message type");
//     }
//   }

//   private async handleCreate(
//     payload: Omit<
//       EntityTypeMap[T],
//       "id" | "createdDate" | "createdBy" | "updatedDate" | "updatedBy"
//     >
//   ): Promise<EntityTypeMap[T]> {
//     return this.backendService.create(payload);
//   }

//   private async handleRead(payload: {
//     id?: string;
//     page?: number;
//     pageSize?: number;
//   }): Promise<
//     EntityTypeMap[T] | { items: EntityTypeMap[T][]; totalCount: number }
//   > {
//     return this.backendService.read(payload);
//   }

//   private async handleUpdate(payload: {
//     id: string;
//     data: Partial<EntityTypeMap[T]>;
//   }): Promise<EntityTypeMap[T]> {
//     return this.backendService.update(payload.id, payload.data);
//   }

//   private async handlePatch(payload: {
//     id: string;
//     data: Partial<EntityTypeMap[T]>;
//   }): Promise<EntityTypeMap[T]> {
//     return this.backendService.patch(payload.id, payload.data);
//   }

//   private async handleDelete(payload: { id: string }): Promise<boolean> {
//     return this.backendService.delete(payload.id);
//   }

//   private async handleQuery(payload: {
//     sql: string;
//     page: number;
//     pageSize: number;
//   }): Promise<{ items: any[]; totalCount: number }> {
//     return this.backendService.query(
//       payload.sql,
//       payload.page,
//       payload.pageSize
//     );
//   }
// }
