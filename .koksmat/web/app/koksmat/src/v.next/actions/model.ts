export interface DatabaseMethods<T> {
  getItem(id: string): Promise<T>;
  getItems(): Promise<T[]>;
  createItem(item: T): Promise<T>;
  updateItem(item: T): Promise<T>;
  deleteItem(id: string, hard: boolean): Promise<T>;
  restoreItem(id: string): Promise<T>;
}
