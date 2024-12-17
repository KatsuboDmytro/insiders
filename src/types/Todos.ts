import { Contributor } from "./User"

export interface TodoList {
  id?: string
  title: string
  description: string
  userId: string
  contributors: Contributor[]
}

export interface Todos {
  id?: string
  name: string
  description: string
  isCompleted: boolean
  inProgress: boolean
  type: string
  createdAt?: string
  assignedTo: Contributor[]
  userId: string
  todoListId: string
}