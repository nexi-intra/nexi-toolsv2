import { EntityType, EntityTypeMap, BackendServiceInterface, PaginatedResponse } from './types'

const mockData: { [K in EntityType]: EntityTypeMap[K][] } = {
  countries: [
    { id: '1', name: 'United States', code: 'US', continent: 'North America', currency: 'USD', phoneCode: '+1', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
    { id: '2', name: 'United Kingdom', code: 'UK', continent: 'Europe', currency: 'GBP', phoneCode: '+44', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
    { id: '3', name: 'Japan', code: 'JP', continent: 'Asia', currency: 'JPY', phoneCode: '+81', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
  ],
  tools: [
    { id: '1', name: 'Jira', description: 'Project management tool', url: 'https://www.atlassian.com/software/jira', groupId: '1', purposeIds: ['1'], tagIds: ['1', '2'], version: '1.0', lastUpdated: '2023-05-01', status: 'active', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-05-01', updatedBy: 'system' },
    { id: '2', name: 'Slack', description: 'Team communication tool', url: 'https://slack.com', groupId: '2', purposeIds: ['2'], tagIds: ['2', '3'], version: '2.1', lastUpdated: '2023-04-15', status: 'active', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-04-15', updatedBy: 'system' },
    { id: '3', name: 'GitHub', description: 'Version control and collaboration platform', url: 'https://github.com', groupId: '1', purposeIds: ['1', '3'], tagIds: ['1', '4'], version: '3.0', lastUpdated: '2023-05-10', status: 'active', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-05-10', updatedBy: 'system' },
  ],
  purposes: [
    { id: '1', name: 'Project Management', description: 'Tools for managing projects and tasks', category: 'Management', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
    { id: '2', name: 'Communication', description: 'Tools for team communication and collaboration', category: 'Collaboration', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
    { id: '3', name: 'Development', description: 'Tools for software development and version control', category: 'Development', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
  ],
  tags: [
    { id: '1', name: 'Productivity', color: '#FF5733', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
    { id: '2', name: 'Collaboration', color: '#33FF57', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
    { id: '3', name: 'Communication', color: '#3357FF', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
    { id: '4', name: 'Development', color: '#FF33F1', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
  ],
  toolGroups: [
    { id: '1', name: 'Development Tools', description: 'Tools used for software development', parentGroupId: null, createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
    { id: '2', name: 'Collaboration Tools', description: 'Tools used for team collaboration', parentGroupId: null, createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
    { id: '3', name: 'Project Management Tools', description: 'Tools used for project management', parentGroupId: '2', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-01-01', updatedBy: 'system' },
  ],
  users: [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'admin', countryId: '1', lastLogin: '2023-05-15T10:30:00Z', status: 'active', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-05-15', updatedBy: 'system' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'user', countryId: '2', lastLogin: '2023-05-14T14:45:00Z', status: 'active', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-05-14', updatedBy: 'system' },
    { id: '3', name: 'Takeshi Yamada', email: 'takeshi.yamada@example.com', role: 'user', countryId: '3', lastLogin: '2023-05-13T09:15:00Z', status: 'active', createdDate: '2023-01-01', createdBy: 'system', updatedDate: '2023-05-13', updatedBy: 'system' },
  ],
}

class MockBackendService<T extends EntityType> implements BackendServiceInterface<T> {
  private entity: T

  constructor(entity: T) {
    this.entity = entity
  }

  async create(data: Omit<EntityTypeMap[T], 'id' | 'createdDate' | 'createdBy' | 'updatedDate' | 'updatedBy'>): Promise<EntityTypeMap[T]> {
    const newItem = {
      id: (mockData[this.entity].length + 1).toString(),
      ...data,
      createdDate: new Date().toISOString(),
      createdBy: 'system',
      updatedDate: new Date().toISOString(),
      updatedBy: 'system',
    } as EntityTypeMap[T]
    mockData[this.entity].push(newItem)
    return newItem
  }

  async read(params: { id?: string; page?: number; pageSize?: number }): Promise<EntityTypeMap[T] | PaginatedResponse<EntityTypeMap[T]>> {
    if (params.id) {
      const item = mockData[this.entity].find(item => item.id === params.id)
      if (!item) throw new Error('Item not found')
      return item
    } else {
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const items = mockData[this.entity].slice(start, end)
      return {
        items,
        totalCount: mockData[this.entity].length,
        page,
        pageSize,
        totalPages: Math.ceil(mockData[this.entity].length / pageSize)
      }
    }
  }

  async update(id: string, data: Partial<EntityTypeMap[T]>): Promise<EntityTypeMap[T]> {
    const index = mockData[this.entity].findIndex(item => item.id === id)
    if (index === -1) throw new Error('Item not found')
    mockData[this.entity][index] = {
      ...mockData[this.entity][index],
      ...data,
      updatedDate: new Date().toISOString(),
      updatedBy: 'system',
    }
    return mockData[this.entity][index]
  }

  async patch(id: string, data: Partial<EntityTypeMap[T]>): Promise<EntityTypeMap[T]> {
    return this.update(id, data) // For this mock, patch behaves the same as update
  }

  async delete(id: string): Promise<boolean> {
    const index = mockData[this.entity].findIndex(item => item.id === id)
    if (index === -1) return false
    mockData[this.entity].splice(index, 1)
    return true
  }

  async query(sql: string, page: number, pageSize: number): Promise<PaginatedResponse<any>> {
    // This is a very simple mock implementation that doesn't actually parse SQL
    // It just returns all items for the entity, paginated
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = mockData[this.entity].slice(start, end)
    return {
      items,
      totalCount: mockData[this.entity].length,
      page,
      pageSize,
      totalPages: Math.ceil(mockData[this.entity].length / pageSize)
    }
  }
}

export const mockBackendServiceFactory = {
  getService<T extends EntityType>(entity: T): BackendServiceInterface<T> {
    return new MockBackendService(entity)
  }
}