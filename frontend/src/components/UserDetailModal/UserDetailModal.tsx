import React from 'react';
import { User } from '@types/User';
import { Modal } from '@components/Modal/Modal';
import { formatAddress, getMapUrl, formatWebsite } from '@services/api';
import styles from './UserDetailModal.module.css';

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (userId: number) => void;
  onEdit?: (user: User) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onDelete,
  onEdit,
}) => {
  if (!user) return null;

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      onDelete(user.id);
      onClose();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(user);
    }
  };

  const handleWebsiteClick = () => {
    window.open(formatWebsite(user.website), '_blank', 'noopener,noreferrer');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${user.email}`, '_self');
  };

  const handlePhoneClick = () => {
    window.open(`tel:${user.phone}`, '_self');
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const footer = (
    <div className={styles.actionButtons}>
      <button
        className={`${styles.button} ${styles.secondaryButton}`}
        onClick={onClose}
      >
        Close
      </button>
      {onEdit && (
        <button
          className={`${styles.button} ${styles.primaryButton}`}
          onClick={handleEdit}
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
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit
        </button>
      )}
      {onDelete && (
        <button
          className={`${styles.button} ${styles.dangerButton}`}
          onClick={handleDelete}
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
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Delete
        </button>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      footer={footer}
    >
      <div className={styles.userDetail}>
        {/* User Header */}
        <div className={styles.userHeader}>
          <div className={styles.avatar}>
            {getInitials(user.name)}
          </div>
          <div className={styles.userHeaderInfo}>
            <h3>{user.name}</h3>
            <p className={styles.username}>@{user.username}</p>
          </div>
        </div>

        {/* Detail Grid */}
        <div className={styles.detailGrid}>
          {/* Contact Information */}
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>
              <svg
                className={styles.sectionIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Contact
            </h4>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Email</p>
              <p 
                className={`${styles.detailValue} ${styles.linkValue}`}
                onClick={handleEmailClick}
              >
                {user.email}
              </p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Phone</p>
              <p 
                className={`${styles.detailValue} ${styles.linkValue}`}
                onClick={handlePhoneClick}
              >
                {user.phone}
              </p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Website</p>
              <p 
                className={`${styles.detailValue} ${styles.linkValue}`}
                onClick={handleWebsiteClick}
              >
                {user.website}
              </p>
            </div>
          </div>

          {/* Address Information */}
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>
              <svg
                className={styles.sectionIcon}
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
              Address
            </h4>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Street</p>
              <p className={styles.detailValue}>
                {user.address.street} {user.address.suite}
              </p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>City</p>
              <p className={styles.detailValue}>
                {user.address.city} {user.address.zipcode}
              </p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Coordinates</p>
              <p className={styles.detailValue}>
                {user.address.geo.lat}, {user.address.geo.lng}
              </p>
              <a
                className={styles.mapLink}
                href={getMapUrl(user.address.geo)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className={styles.mapIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
                View on Map
              </a>
            </div>
          </div>

          {/* Company Information */}
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>
              <svg
                className={styles.sectionIcon}
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
              Company
            </h4>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Name</p>
              <p className={styles.detailValue}>{user.company.name}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Catch Phrase</p>
              <p className={styles.detailValue}>{user.company.catchPhrase}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Business</p>
              <p className={styles.detailValue}>{user.company.bs}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 