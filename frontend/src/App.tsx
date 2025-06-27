import React, { useState, useCallback } from 'react';
import { User } from '@types/User';
import { useUsers } from '@hooks/useUsers';
import { UserTable } from '@components/UserTable/UserTable';
import { UserDetailModal } from '@components/UserDetailModal/UserDetailModal';
import styles from './App.module.css';

const App: React.FC = () => {
  const { users, loading, error, deleteUser, refreshUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleUserClick = useCallback((user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleDeleteUser = useCallback(async (userId: number) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }, [deleteUser]);

  const handleDeleteFromModal = useCallback(async (userId: number) => {
    try {
      await deleteUser(userId);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }, [deleteUser, handleCloseModal]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshUsers();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshUsers]);

  const handleDismissError = useCallback(() => {
    setErrorDismissed(true);
  }, []);

  const shouldShowError = error && !errorDismissed;

  const uniqueCompanies = new Set(users.map(user => user.company.name)).size;
  const uniqueCities = new Set(users.map(user => user.address.city)).size;

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h1 className={styles.logoText}>User Directory</h1>
              <p className={styles.logoSubtext}>Professional Contact Management</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <button
              className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
            >
              <svg
                className={styles.refreshIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23,4 23,10 17,10"></polyline>
                <polyline points="1,20 1,14 7,14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Error Banner */}
        {shouldShowError && (
          <div className={styles.errorBanner}>
            <svg
              className={styles.errorIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <div className={styles.errorContent}>
              <h3 className={styles.errorTitle}>Error Loading Data</h3>
              <p className={styles.errorMessage}>{error}</p>
            </div>
            <button
              className={styles.dismissError}
              onClick={handleDismissError}
              aria-label="Dismiss error"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {/* Statistics */}
        {!loading && users.length > 0 && (
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className={styles.statValue}>{users.length}</h3>
              <p className={styles.statLabel}>Total Users</p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21h18"></path>
                  <path d="M5 21V7l8-4v18"></path>
                  <path d="M19 21V11l-6-4"></path>
                </svg>
              </div>
              <h3 className={styles.statValue}>{uniqueCompanies}</h3>
              <p className={styles.statLabel}>Companies</p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className={styles.statValue}>{uniqueCities}</h3>
              <p className={styles.statLabel}>Cities</p>
            </div>
          </div>
        )}

        {/* User Table */}
        <UserTable
          users={users}
          loading={loading}
          error={shouldShowError ? null : error}
          onUserClick={handleUserClick}
          onDeleteUser={handleDeleteUser}
        />

        {/* User Detail Modal */}
        <UserDetailModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDeleteFromModal}
        />
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>
            Built with React + TypeScript. Data from{' '}
            <a
              href="https://jsonplaceholder.typicode.com"
              className={styles.footerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              JSONPlaceholder
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App; 