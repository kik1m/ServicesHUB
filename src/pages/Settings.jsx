import React from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import Breadcrumbs from '../components/Breadcrumbs';
import { 
    User, ShieldCheck, CreditCard, Bell
} from 'lucide-react';
import { useSettingsData } from '../hooks/useSettingsData';

// Import Modular Components
import SettingsTabs from '../components/Settings/SettingsTabs';
import SettingsProfile from '../components/Settings/SettingsProfile';
import SettingsSecurity from '../components/Settings/SettingsSecurity';
import SettingsBilling from '../components/Settings/SettingsBilling';
import SettingsNotifications from '../components/Settings/SettingsNotifications';

// Import Modular CSS
import styles from './Settings.module.css';

const Settings = () => {
    const {
        activeTab,
        setActiveTab,
        loading,
        saving,
        uploading,
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
        authUser
    } = useSettingsData();

    const tabs = [
        { id: 'profile', label: 'Public Profile', icon: <User size={18} /> },
        { id: 'security', label: 'Safety & Privacy', icon: <ShieldCheck size={18} /> },
        { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
    ];

    if (loading) {
        return (
            <div className={styles.settingsView}>
                <div className={styles.settingsContainer}>
                    <SkeletonLoader height="400px" borderRadius="24px" />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.settingsView}>
            <div className={styles.settingsContainer}>
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Dashboard', path: '/dashboard' }, { label: 'Settings' }]} />
                
                <header className={styles.settingsHeader}>
                    <h1>Account <span className="gradient-text">Settings</span></h1>
                    <p>Manage your professional identity, security preferences, and data.</p>
                </header>

                <div className={styles.settingsLayout}>
                    <SettingsTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                    
                    <main className={styles.settingsMainContent}>
                        {activeTab === 'profile' && (
                            <SettingsProfile 
                                profile={profile} setProfile={setProfile} 
                                handleProfileUpdate={handleProfileUpdate} 
                                handleAvatarUpload={handleAvatarUpload} 
                                saving={saving} 
                                uploading={uploading}
                                authUser={authUser} 
                            />
                        )}

                        {activeTab === 'security' && (
                            <SettingsSecurity 
                                passwords={passwords} setPasswords={setPasswords} 
                                handlePasswordUpdate={handlePasswordUpdate} 
                                showNewPassword={showNewPassword} setShowNewPassword={setShowNewPassword}
                                showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword}
                                saving={saving}
                            />
                        )}

                        {activeTab === 'billing' && <SettingsBilling profile={profile} />}
                        {activeTab === 'notifications' && <SettingsNotifications profile={profile} />}
                    </main>
                </div>
            </div>
        </div>
    );
};
export default Settings;
