import { useState, useEffect, useCallback } from 'react';
import { User, UserFormData } from '@types/User';
import { userApi } from '@services/api';

interface UseUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

interface UseUsersActions {
  fetchUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  createUser: (userData: UserFormData) => Promise<User>;
  updateUser: (id: number, userData: Partial<UserFormData>) => Promise<User>;
  refreshUsers: () => Promise<void>;
}

export const useUsers = (): UseUsersState & UseUsersActions => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await userApi.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    try {
      setError(null);
      await userApi.deleteUser(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const createUser = useCallback(async (userData: UserFormData): Promise<User> => {
    try {
      setError(null);
      const newUser = await userApi.createUser(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (id: number, userData: Partial<UserFormData>): Promise<User> => {
    try {
      setError(null);
      const updatedUser = await userApi.updateUser(id, userData);
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === id ? updatedUser : user)
      );
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
    createUser,
    updateUser,
    refreshUsers,
  };
}; 