import React from 'react';
import Skeleton from '../ui/Skeleton';
import styles from '../../app/ai-engine/AIEngine.module.css';

export default function AIEngineSkeleton() {
    return (
        <div className={styles.engineContainer}>
            <div className={styles.chatSection}>
                <div className={styles.header}>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className={styles.messagesContainer}>
                    {/* User Message Skeleton */}
                    <div className="flex justify-end mb-6">
                        <Skeleton className="h-12 w-64 rounded-2xl rounded-tr-sm" />
                    </div>
                    {/* AI Message Skeleton */}
                    <div className="flex justify-start mb-6">
                        <div className="flex gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-96 rounded" />
                                <Skeleton className="h-4 w-80 rounded" />
                                <Skeleton className="h-4 w-72 rounded" />
                            </div>
                        </div>
                    </div>
                     {/* User Message Skeleton */}
                     <div className="flex justify-end mb-6">
                        <Skeleton className="h-12 w-48 rounded-2xl rounded-tr-sm" />
                    </div>
                </div>
                <div className={styles.inputArea}>
                    <Skeleton className="h-16 w-full rounded-xl" />
                </div>
            </div>
            <div className={styles.sidebar}>
                <div className="p-4 border-b border-[var(--border-color)]">
                    <Skeleton className="h-10 w-full rounded" />
                </div>
                <div className="p-4 space-y-4">
                    <Skeleton className="h-12 w-full rounded" />
                    <Skeleton className="h-12 w-full rounded" />
                    <Skeleton className="h-12 w-full rounded" />
                </div>
            </div>
        </div>
    );
}
