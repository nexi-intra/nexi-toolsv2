/**
 * EntityHandler
 *
 * This file contains the route handlers for dynamic entity endpoints.
 * It supports GET, POST, PUT, and DELETE operations for various entities
 * defined in the Nexi Tools API schema.
 */

export interface BackendService {
  getAll: (entityType: string, page: number, pageSize: number) => Promise<any>;
  getById: (entityType: string, id: string) => Promise<any>;
  create: (entityType: string, data: any) => Promise<any>;
  update: (entityType: string, id: string, data: any) => Promise<any>;
  delete: (entityType: string, id: string) => Promise<any>;
}
