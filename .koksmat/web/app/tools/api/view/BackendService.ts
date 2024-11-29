/**
 * EntityHandler
 *
 * This file contains the route handlers for dynamic entity endpoints.
 * It supports GET, POST, PUT, and DELETE operations for various entities
 * defined in the Magic Links API schema.
 */

export interface BackendService {
  getAll: (entityType: string, page: number, pageSize: number) => Promise<any>;
  getById: (entityType: string, id: string) => Promise<any>;
}
