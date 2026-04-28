import React, { useMemo } from 'react';
import { User, ShieldCheck, CreditCard, Bell, Settings as SettingsIcon } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useSettingsData } from '../hooks/useSettingsData';

// Import Global UI Components - Rule #19: Atomic Unified Components
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';

// Import Modular Components
import SettingsTabs from '../components/Settings/SettingsTabs';
import SettingsProfile from '../components/Settings/SettingsProfile';
import SettingsSecurity from '../components/Settings/SettingsSecurity';
import SettingsBilling from '../components/Settings/SettingsBilling';
import SettingsNotifications from '../components/Settings/SettingsNotifications';

// Import Constants & Styles
import { SETTINGS_UI_CONSTANTS } from '../constants/settingsConstants';
import styles from './Settings.module.css';

/**
 * Settings Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestrator Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Settings = () => {
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
        fetchSettings,
        authUser
    } = useSettingsData();

    // 2. SEO Hardening (v2.0)
    useSEO({ pageKey: 'settings' });

    const tabs = useMemo(() => [
        { id: 'profile', label: SETTINGS_UI_CONSTANTS.tabs[0].label, icon: <User size={18} /> },
        { id: 'security', label: SETTINGS_UI_CONSTANTS.tabs[1].label, icon: <ShieldCheck size={18} /> },
        { id: 'billing', label: SETTINGS_UI_CONSTANTS.tabs[2].label, icon: <CreditCard size={18} /> },
        { id: 'notifications', label: SETTINGS_UI_CONSTANTS.tabs[3].label, icon: <Bell size={18} /> }
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
                    authUser={authUser} 
                    isLoading={loading}
                    content={SETTINGS_UI_CONSTANTS.profile}
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
                    saving={saving}
                    isLoading={loading}
                    content={SETTINGS_UI_CONSTANTS.security}
                />
            ),
            billing: (
                <SettingsBilling 
                    profile={profile} 
                    isLoading={loading}
                    content={SETTINGS_UI_CONSTANTS.billing}
                />
            ),
            notifications: (
                <SettingsNotifications 
                    profile={profile} 
                    isLoading={loading}
                    content={SETTINGS_UI_CONSTANTS.notifications}
                />
            )
        };

        return components[activeTab] || null;
    };

    return (
        <div className={styles.settingsView}>
            <PageHero 
                title={SETTINGS_UI_CONSTANTS.header.title}
                highlight={SETTINGS_UI_CONSTANTS.header.titleHighlight}
                subtitle={SETTINGS_UI_CONSTANTS.header.subtitle}
                breadcrumbs={SETTINGS_UI_CONSTANTS.header.breadcrumbs}
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
        </div>
    );
};

export default Settings;
