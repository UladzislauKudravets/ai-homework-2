import React from 'react';
import { User } from '@types/User';
import { formatWebsite } from '@services/api';
import styles from './UserTable.module.css';

interface UserTableProps {
  users: User[];
  loading?: boolean;
  error?: string | null;
  onUserClick: (user: User) => void;
  onDeleteUser?: (userId: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading = false,
  error = null,
  onUserClick,
  onDeleteUser,
}) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRowClick = (user: User, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on action buttons
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    onUserClick(user);
  };

  const handleDeleteClick = (userId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDeleteUser && window.confirm('Are you sure you want to delete this user?')) {
      onDeleteUser(userId);
    }
  };

  const handleWebsiteClick = (website: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(formatWebsite(website), '_blank', 'noopener,noreferrer');
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className={styles.loadingRow}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading users...</p>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={6} className={styles.errorState}>
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
            <h3>Error Loading Users</h3>
            <p>{error}</p>
          </td>
        </tr>
      );
    }

    if (users.length === 0) {
      return (
        <tr>
          <td colSpan={6} className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
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
            <h3>No Users Found</h3>
            <p>There are no users to display at the moment.</p>
          </td>
        </tr>
      );
    }

    return users.map((user) => (
      <tr
        key={user.id}
        className={styles.tableRow}
        onClick={(e) => handleRowClick(user, e)}
      >
        <td className={styles.tableCell}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {getInitials(user.name)}
            </div>
            <div className={styles.userDetails}>
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          </div>
        </td>
        
        <td className={`${styles.tableCell} ${styles.addressCell}`}>
          <p className={styles.address}>
            {user.address.street} {user.address.suite}
          </p>
          <p className={styles.city}>
            {user.address.city}, {user.address.zipcode}
          </p>
        </td>
        
        <td className={`${styles.tableCell} ${styles.contactCell}`}>
          <div className={styles.contactItem}>
            <svg
              className={styles.contactIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            {user.phone}
          </div>
          <div className={styles.contactItem}>
            <svg
              className={styles.contactIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            {user.email}
          </div>
        </td>
        
        <td className={`${styles.tableCell} ${styles.websiteCell}`}>
          <button
            className={styles.websiteLink}
            onClick={(e) => handleWebsiteClick(user.website, e)}
          >
            {user.website}
          </button>
        </td>
        
        <td className={`${styles.tableCell} ${styles.companyCell}`}>
          <p className={styles.companyName}>{user.company.name}</p>
          <p className={styles.companyCatchPhrase}>{user.company.catchPhrase}</p>
        </td>
        
        <td className={`${styles.tableCell} ${styles.actionsCell}`}>
          {onDeleteUser && (
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={(e) => handleDeleteClick(user.id, e)}
              aria-label={`Delete ${user.name}`}
            >
              <svg
                className={styles.actionIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>User Directory</h2>
        <p className={styles.tableSubtitle}>
          {loading ? 'Loading...' : `${users.length} user${users.length !== 1 ? 's' : ''} found`}
        </p>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.tableHeaderCell}>User</th>
              <th className={styles.tableHeaderCell}>Address</th>
              <th className={styles.tableHeaderCell}>Contact</th>
              <th className={styles.tableHeaderCell}>Website</th>
              <th className={styles.tableHeaderCell}>Company</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {renderTableContent()}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 