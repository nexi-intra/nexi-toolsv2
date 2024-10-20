import { EntityType, EntityTypeMap, BackendServiceInterface, BackendServiceFactory, PaginatedResponse } from './types'

class BackendService<T extends EntityType> implements BackendServiceInterface<T> {
  private entity: T

  constructor(entity: T) {
    this.entity = entity
  }

  async create(data: Omit<EntityTypeMap[T], 'id' | 'createdDate' | 'createdBy' | 'updatedDate' | 'updatedBy'>): Promise<EntityTypeMap[T]> {
    // Implement actual server-to-server create logic here
    console.log(`Creating ${this.entity}:`, data)
    return { id: 'new-id', ...data } as EntityTypeMap[T]
  }

  async read(params: { id?: string, page?: number, pageSize?: number }): Promise<EntityTypeMap[T] | PaginatedResponse<EntityTypeMap[T]>> {
    // Implement actual server-to-server read logic here
    console.log(`Reading ${this.entity}:`, params)
    if (params.id) {
      return { id: params.id } as EntityTypeMap[T]
    } else {
      return {
        items: [],
        totalCount: 0,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        totalPages: 0
      }
    }
  }

  async update(id: string, data: Partial<EntityTypeMap[T]>): Promise<EntityTypeMap[T]> {
    // Implement actual server-to-server update logic here
    console.log(`Updating ${this.entity}:`, { id, data })
    return { id, ...data } as EntityTypeMap[T]
  }

  async patch(id: string, data: Partial<EntityTypeMap[T]>): Promise<EntityTypeMap[T]> {
    // Implement actual server-to-server patch logic here
    console.log(`Patching ${this.entity}:`, { id, data })
    return { id, ...data } as EntityTypeMap[T]
  }

  async delete(id: string): Promise<boolean> {
    // Implement actual server-to-server delete logic here
    console.log(`Deleting ${this.entity}:`, id)
    return true
  }

  async query(sql: string, page: number, pageSize: number): Promise<PaginatedResponse<any>> {
    // Implement actual server-to-server query logic here
    console.log(`Querying ${this.entity}:`, { sql, page, pageSize })
    return {
      items: [],
      totalCount: 0,
      page,
      pageSize,
      totalPages: 0
    }
  }
}

export const backendServiceFactory: BackendServiceFactory = {
  getService<T extends EntityType>(entity: T): BackendServiceInterface<T> {
    return new BackendService(entity)
  }
}