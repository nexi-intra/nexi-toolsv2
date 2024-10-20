export type EntityType = 'countries' | 'tools' | 'purposes' | 'tags' | 'toolGroups' | 'users'

export interface BaseEntity {
  id: string
  createdDate: string
  createdBy: string
  updatedDate: string
  updatedBy: string
}

export interface Country extends BaseEntity {
  name: string
  code: string
  continent: string
  currency: string
  phoneCode: string
}

export interface Tool extends BaseEntity {
  name: string
  description: string
  url: string
  groupId: string
  purposeIds: string[]
  tagIds: string[]
  version: string
  lastUpdated: string
  status: 'active' | 'inactive' | 'deprecated'
}

export interface Purpose extends BaseEntity {
  name: string
  description: string
  category: string
}

export interface Tag extends BaseEntity {
  name: string
  color: string
}

export interface ToolGroup extends BaseEntity {
  name: string
  description: string
  parentGroupId: string | null
}

export interface User extends BaseEntity {
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  countryId: string
  lastLogin: string
  status: 'active' | 'inactive' | 'suspended'
}

export type EntityTypeMap = {
  countries: Country
  tools: Tool
  purposes: Purpose
  tags: Tag
  toolGroups: ToolGroup
  users: User
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface QueryParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filter?: Record<string, string>
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface ErrorResponse {
  error: string
  statusCode: number
}

export type MessageType = 'CREATE' | 'READ' | 'UPDATE' | 'PATCH' | 'DELETE' | 'QUERY'

export interface Message<T extends EntityType> {
  type: MessageType
  entity: T
  payload: any
}

export interface BackendServiceInterface<T extends EntityType> {
  create(data: Omit<EntityTypeMap[T], 'id' | 'createdDate' | 'createdBy' | 'updatedDate' | 'updatedBy'>): Promise<EntityTypeMap[T]>
  read(params: { id?: string, page?: number, pageSize?: number }): Promise<EntityTypeMap[T] | PaginatedResponse<EntityTypeMap[T]>>
  update(id: string, data: Partial<EntityTypeMap[T]>): Promise<EntityTypeMap[T]>
  patch(id: string, data: Partial<EntityTypeMap[T]>): Promise<EntityTypeMap[T]>
  delete(id: string): Promise<boolean>
  query(sql: string, page: number, pageSize: number): Promise<PaginatedResponse<any>>
}

export interface BackendServiceFactory {
  getService<T extends EntityType>(entity: T): BackendServiceInterface<T>
}