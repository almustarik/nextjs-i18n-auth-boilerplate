import type { BaseEntity } from './common';

export interface User extends BaseEntity {
  email: string;
  name: string;
  image?: string;
  role: 'user' | 'admin';
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'user' | 'admin';
}

export interface Project extends BaseEntity {
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  userId: string;
}

export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  userId: string;
}

export interface Profile extends BaseEntity {
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  timezone: string;
  language: string;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}
