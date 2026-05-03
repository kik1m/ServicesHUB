import React, { useEffect, useState } from 'react';
import { X, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { socialService } from '../../services/socialService';
import SmartImage from '../ui/SmartImage';
import Skeleton from '../ui/Skeleton';
import styles from './SocialListModal.module.css';

/**
 * SocialListModal - Elite Standard
 * Responsibility: Display followers/following list with high fidelity
 */
const SocialListModal = ({ isOpen, onClose, userId, type, title }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && userId) {
            fetchList();
        }
    }, [isOpen, userId, type]);

    const fetchList = async () => {
        setIsLoading(true);
        try {
            const { data, error } = type === 'followers' 
                ? await socialService.getFollowers(userId)
                : await socialService.getFollowing(userId);
            
            if (error) throw error;
            
            // Extract profile objects from joined data (using aliases from service)
            const profileList = data.map(item => item.follower || item.following).filter(Boolean);
            setUsers(profileList);
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} fade-in`} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerTitle}>
                        <Users size={20} className="gradient-text-icon" />
                        <h3>{title}</h3>
                        <span className={styles.countBadge}>{users.length}</span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={`skeleton-user-${i}`} className={styles.userItemSkeleton}>
                                <Skeleton className={styles.avatarSkeleton} />
                                <div className={styles.infoSkeleton}>
                                    <Skeleton className={styles.nameSkeleton} />
                                    <Skeleton className={styles.roleSkeleton} />
                                </div>
                            </div>
                        ))
                    ) : users.length > 0 ? (
                        users.map(user => (
                            <div 
                                key={user.id} 
                                className={styles.userItem}
                                onClick={() => {
                                    navigate(`/profile/${user.id}`);
                                    onClose();
                                }}
                            >
                                <div className={styles.userAvatar}>
                                    <SmartImage 
                                        src={user.avatar_url} 
                                        alt={user.full_name} 
                                        fallbackText={user.full_name?.charAt(0).toUpperCase()} 
                                    />
                                    {user.is_verified && <div className={styles.verifyDot}></div>}
                                </div>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{user.full_name}</span>
                                    <span className={styles.userRole}>{user.role || 'Member'}</span>
                                </div>
                                <div className={styles.actionIndicator}>
                                    <UserPlus size={16} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <Users size={48} />
                            <p>No {type} found yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocialListModal;
