import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useWorkspace(user) {
    const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
    const [workspaceStep, setWorkspaceStep] = useState(1);
    const [workspaceContext, setWorkspaceContext] = useState(user?.workspace_context || { idea: '', goal: '', rules: '' });

    // Sync local state when user.workspace_context loads
    useEffect(() => {
        if (user?.workspace_context) {
            const isDifferent = JSON.stringify(user.workspace_context) !== JSON.stringify(workspaceContext);
            if (isDifferent) {
                setWorkspaceContext(user.workspace_context);
            }
        }
    }, [user?.workspace_context]);

    // Save Workspace Context with debounce
    useEffect(() => {
        if (!user?.id || !workspaceContext.idea) return;
        const timer = setTimeout(() => {
            supabase.from('profiles')
                .update({ workspace_context: workspaceContext })
                .eq('id', user.id).then();
        }, 1000);
        return () => clearTimeout(timer);
    }, [workspaceContext, user?.id]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return {
        workspaceContext,
        setWorkspaceContext,
        isWorkspaceModalOpen,
        setIsWorkspaceModalOpen,
        workspaceStep,
        setWorkspaceStep,
        mounted
    };
}
