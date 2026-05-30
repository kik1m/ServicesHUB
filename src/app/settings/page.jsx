'use client';
import React, { useMemo } from 'react';
import { User, ShieldCheck, CreditCard, Bell, Settings as SettingsIcon } from 'lucide-react';
import { useSettingsData } from '../../hooks/useSettingsData';

// Import Global UI Components
import PageHero from '../../components/ui/PageHero';
import Safeguard from '../../components/ui/Safeguard';

// Import Modular Components
import SettingsTabs from '../../components/Settings/SettingsTabs';
import SettingsProfile from '../../components/Settings/SettingsProfile';
import SettingsSecurity from '../../components/Settings/SettingsSecurity';
import SettingsBilling from '../../components/Settings/SettingsBilling';
import SettingsNotifications from '../../components/Settings/SettingsNotifications';

// Import Styles
import styles from './Settings.module.css';

/**
 * Settings Page - Elite Next.js Port
 */
export default function SettingsPage() {
    const {
        activeTab,
        setActiveTab,
        loading,
        saving,
        uploading,
        error,
        actionError,
        setActionError,
        profile,
        setProfile,
        passwords,
        setPasswords,
        showNewPassword,
        setShowNewPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        handleProfileUpdate,
        handleAvatarUpload,
        handlePasswordUpdate,
        handleNotificationToggle,
        handleDeleteAIMemory,
        fetchSettings,
        authUser
    } = useSettingsData();

    const tabs = useMemo(() => [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'security', label: 'Security', icon: <ShieldCheck size={18} /> },
        { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
    ], []);

    const renderActiveTab = () => {
        const components = {
            profile: (
                <SettingsProfile 
                    profile={profile} 
                    setProfile={setProfile} 
                    handleProfileUpdate={handleProfileUpdate} 
                    handleAvatarUpload={handleAvatarUpload} 
                    saving={saving} 
                    uploading={uploading}
                    isLoading={loading}
                />
            ),
            security: (
                <SettingsSecurity 
                    passwords={passwords} 
                    setPasswords={setPasswords} 
                    handlePasswordUpdate={handlePasswordUpdate} 
                    showNewPassword={showNewPassword} 
                    setShowNewPassword={setShowNewPassword}
                    showConfirmPassword={showConfirmPassword} 
                    setShowConfirmPassword={setShowConfirmPassword}
                    handleDeleteAIMemory={handleDeleteAIMemory}
                    saving={saving}
                    isLoading={loading}
                />
            ),
            billing: (
                <SettingsBilling 
                    profile={profile} 
                    isLoading={loading}
                />
            ),
            notifications: (
                <SettingsNotifications 
                    profile={profile} 
                    onToggle={handleNotificationToggle}
                    isLoading={loading}
                />
            )
        };

        return components[activeTab] || null;
    };

    return (
        <main className={styles.settingsView}>
            <PageHero 
                title="Account"
                highlight="Settings"
                subtitle="Manage your profile, security, and preferences on HUBly."
                breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Settings', path: '/settings', active: true }]}
                icon={<SettingsIcon size={24} />}
            />

            <div className={styles.settingsContainer}>
                <Safeguard error={error} onRetry={fetchSettings} fullPage title="Settings Load Failed">
                    <div className={styles.settingsLayout}>
                        <aside className={styles.sidebarCol}>
                            <SettingsTabs 
                                tabs={tabs} 
                                activeTab={activeTab} 
                                setActiveTab={setActiveTab} 
                                isLoading={loading}
                            />
                        </aside>
                        
                        <main className={styles.settingsMainContent}>
                            <Safeguard error={actionError} onRetry={() => setActionError(null)} title="Operation Failed">
                                {renderActiveTab()}
                            </Safeguard>
                        </main>
                    </div>
                </Safeguard>
            </div>
        </main>
    );
}
