import { EntityType, EntityTypeMap, PaginatedResponse } from './types'

export class ApiClient<T extends EntityType> {
  private entity: T
  private baseUrl: string
  private getToken: () => string | Promise<string>

  constructor(entity: T, getToken: () => string | Promise<string>) {
    this.entity = entity
    this.baseUrl = `/api/${entity}`
    this.getToken = getToken
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await Promise.resolve(this.getToken())
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
    return fetch(url, { ...options, headers })
  }

  async getAll(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<EntityTypeMap[T]>> {
    const response = await this.fetchWithAuth(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`)
    if (!response.ok) throw new Error('Failed to fetch data')
    return await response.json()
  }

  async getOne(id: string): Promise<EntityTypeMap[T]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}?id=${id}`)
    if (!response.ok) throw new Error('Failed to fetch data')
    return await response.json()
  }

  async create(data: Omit<EntityTypeMap[T], 'id' | 'createdDate' | 'createdBy' | 'updatedDate' | 'updatedBy'>): Promise<EntityTypeMap[T]> {
    const response = await this.fetchWithAuth(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create data')
    return await response.json()
  }

  async update(id: string, data: Partial<EntityTypeMap[T]>): Promise<EntityTypeMap[T]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update data')
    return await response.json()
  }

  async patch(id: string, data: Partial<EntityTypeMap[T]>): Promise<EntityTypeMap[T]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to patch data')
    return await response.json()
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.fetchWithAuth(`${this.baseUrl}?id=${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete data')
    return await response.json()
  }

  async query<R>(sql: string, page: number = 1, pageSize: number = 10, mapFunction: (row: any) => R): Promise<PaginatedResponse<R>> {
    const response = await this.fetchWithAuth(`${this.baseUrl}?sql=${encodeURIComponent(sql)}&page=${page}&pageSize=${pageSize}`)
    if (!response.ok) throw new Error('Failed to execute query')
    const data = await response.json()
    return {
      items: data.items.map(mapFunction),
      totalCount: data.totalCount,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
    }
  }
}