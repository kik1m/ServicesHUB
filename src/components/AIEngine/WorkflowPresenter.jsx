'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Layers, Check, HelpCircle, ArrowRight, Sparkles, BookOpen, ExternalLink, Settings, RefreshCw, Edit2, LifeBuoy } from 'lucide-react';
import { useArtifact } from '../../context/ArtifactContext';
import VisualRenderer from './VisualRenderer';
import MarkdownRenderer from './MarkdownRenderer';
import styles from './WorkflowPresenter.module.css';

// ── Helper to render guide content (HTML string, Markdown, or plain text) ──
function FormattedGuide({ text }) {
    if (!text) return null;

    // Check if the string contains raw HTML tags (e.g. <h3>, <ol>, <li>, <strong>, etc.)
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(text);

    if (hasHtmlTags) {
        return (
            <div 
                className={styles.formattedHtmlContent}
                dangerouslySetInnerHTML={{ __html: text }} 
            />
        );
    }

    // Check if text has Markdown syntax
    const hasMarkdown = /^(#|\*|-|\d+\.|`|>)/m.test(text);
    if (hasMarkdown) {
        return <MarkdownRenderer content={text} />;
    }

    return <p>{text}</p>;
}

// ── Typewriter Helper Component ──
function TypewriterText({ text, speed = 25, onComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    const onCompleteRef = useRef(onComplete);

    // Sync callback ref
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        setDisplayedText('');
        let currentIdx = 0;
        let timer = null;

        if (!text) return;

        timer = setInterval(() => {
            if (currentIdx < text.length) {
                setDisplayedText(text.substring(0, currentIdx + 1));
                currentIdx++;
            } else {
                clearInterval(timer);
                onCompleteRef.current?.();
            }
        }, speed);

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [text, speed]);

    return <p className={styles.typewriterText}>{displayedText}</p>;
}

// ── Fallback Onboarding Steps (Domain-Agnostic AI & Tech Wizard) ──
const FALLBACK_WIZARD_STEPS = [
    {
        title: "Target Medium & Format 🎨",
        desc: "Select the format and target output medium for your AI project concept.",
        fields: [
            {
                id: "projectMedium",
                label: "Primary Output Medium",
                type: "select",
                options: ["SaaS Web App", "AI Video & Film", "Music & Audio Tracks", "Interactive Novel / Story", "Marketing & SEO Campaign", "Mobile Application"],
                placeholder: "Select project medium"
            },
            {
                id: "stylePreset",
                label: "Aesthetic or Tone Style",
                type: "multiselect",
                options: ["Sleek & Modern", "Cinematic / Dark", "Realistic / High-Fidelity", "Minimalist & Clean", "Expressive & Creative"],
                placeholder: "Select style preferences"
            },
            {
                id: "outputDetails",
                label: "Custom Output Preferences / Extra Notes",
                type: "text",
                placeholder: "e.g. 1080p video, Next.js app, Sci-Fi genre..."
            }
        ]
    },
    {
        title: "Core Engines & Integrations ⚙️",
        desc: "Select the specific services and AI tools you wish to configure.",
        fields: [
            {
                id: "keyIntegrations",
                label: "Required Systems & Tools",
                type: "multiselect",
                options: [
                    "Text Model (GPT/Claude)", 
                    "Image Model (Midjourney/Leonardo)", 
                    "Video Generator (Runway/Kling)", 
                    "Audio Generator (Suno/Udio)", 
                    "Database (Supabase/Postgres)", 
                    "Stripe Subscription Payments"
                ],
                placeholder: "Select features/tools"
            },
            {
                id: "customRequirements",
                label: "Specific Requirements or Constraints (Optional)",
                type: "textarea",
                placeholder: "Describe any other requirements or workflows you need..."
            }
        ]
    }
];

// ── Custom Tool Logo Resolver ──
const getToolLogo = (toolName, suggestedLogoUrl) => {
    if (!toolName) return 'https://www.google.com/s2/favicons?domain=google.com&sz=128';
    const name = toolName.toLowerCase();
    
    let domain = '';
    if (name.includes('chatgpt') || name.includes('openai')) domain = 'openai.com';
    else if (name.includes('midjourney')) domain = 'midjourney.com';
    else if (name.includes('runway') || name.includes('runwayml')) domain = 'runwayml.com';
    else if (name.includes('elevenlabs') || name.includes('eleven labs') || name.includes('eleve')) domain = 'elevenlabs.io';
    else if (name.includes('suno')) domain = 'suno.com';
    else if (name.includes('udio')) domain = 'udio.com';
    else if (name.includes('luma') || name.includes('lumr')) domain = 'lumalabs.ai';
    else if (name.includes('kling') || name.includes('klino')) domain = 'klingai.com';
    else if (name.includes('leonardo')) domain = 'leonardo.ai';
    else if (name.includes('pika')) domain = 'pika.art';
    else if (name.includes('heygen')) domain = 'heygen.com';
    else if (name.includes('viggle')) domain = 'viggle.ai';
    else if (name.includes('stripe')) domain = 'stripe.com';
    else if (name.includes('supabase')) domain = 'supabase.com';
    else if (name.includes('next.js') || name.includes('nextjs')) domain = 'nextjs.org';
    else if (name.includes('tailwind')) domain = 'tailwindcss.com';
    else if (name.includes('github')) domain = 'github.com';
    else if (name.includes('vercel')) domain = 'vercel.com';
    else if (name.includes('firebase')) domain = 'firebase.google.com';
    else if (name.includes('mongodb')) domain = 'mongodb.com';
    else if (name.includes('postgre')) domain = 'postgresql.org';
    else if (name.includes('resend')) domain = 'resend.com';

    if (domain) {
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    
    if (suggestedLogoUrl && (suggestedLogoUrl.startsWith('http://') || suggestedLogoUrl.startsWith('https://'))) {
        return suggestedLogoUrl;
    }
    
    return `https://www.google.com/s2/favicons?domain=google.com&sz=128`;
};

const normalizeUrl = (url) => {
    if (!url || url === '#') return '#';
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    return `https://${trimmed}`;
};

export default function WorkflowPresenter({ blueprint, projectId, onWorkflowStateUpdate, isChatCollapsed, isLoading, onStartProjectPlan }) {
    const [state, setState] = useState(null);
    const [activePhaseIdx, setActivePhaseIdx] = useState(0);
    const [activeStepIdx, setActiveStepIdx] = useState(0);
    const [typewriterComplete, setTypewriterComplete] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    // Setup Wizard state
    const [wizardStep, setWizardStep] = useState(1);
    const [projectName, setProjectName] = useState('');
    const [ideaDescription, setIdeaDescription] = useState('');
    const [targetTimeline, setTargetTimeline] = useState('1 month');
    const [customTimeline, setCustomTimeline] = useState('');

    // Dynamic AI Wizard states
    const [wizardLoading, setWizardLoading] = useState(false);
    const [customSteps, setCustomSteps] = useState([]);
    const [customAnswers, setCustomAnswers] = useState({});

    // Refinement states
    const [isRefining, setIsRefining] = useState(false);
    const [refineText, setRefineText] = useState('');

    // Parse blueprint JSON
    useEffect(() => {
        if (!blueprint) {
            setState(null);
            setActivePhaseIdx(0);
            setActiveStepIdx(0);
            setWizardStep(1);
            setProjectName('');
            setIdeaDescription('');
            setCustomAnswers({});
            setCustomSteps([]);
            return;
        }
        try {
            const parsed = typeof blueprint === 'string' ? JSON.parse(blueprint) : blueprint;
            if (parsed.phases?.length > 0) {
                setState(parsed);
            }
        } catch (err) {
            console.error('Failed to parse blueprint in Presenter:', err);
        }
    }, [blueprint]);

    // Fallback step generator for phases lacking a defined steps array
    const getPhaseSteps = useCallback((phase) => {
        if (phase.steps && phase.steps.length > 0) return phase.steps;

        // Generate dynamic fallback steps if the AI did not output any
        const generated = [
            {
                type: 'typewriter',
                text: `Welcome to Phase: ${phase.title}. ${phase.description || "Let's review the required steps to complete this phase successfully."}`
            }
        ];

        phase.tasks?.forEach((task, tIdx) => {
            generated.push({
                type: 'typewriter',
                text: `Task ${tIdx + 1}: ${task.title}. ${task.description || ''}`
            });

            if (task.tool) {
                generated.push({
                    type: 'tool',
                    name: task.tool.name,
                    logoUrl: getToolLogo(task.tool.name, task.tool.logoUrl),
                    description: `Suggested Tool: ${task.tool.name}`,
                    url: task.tool.url || task.tool.website || '#',
                    guide: task.tool.guide || 'Review the tool guide and begin implementation directly.'
                });
            }

            generated.push({
                type: 'checkpoint',
                question: `Have you successfully completed the task "${task.title}"?`,
                options: ['Yes, completed successfully! ✅', 'No, I ran into an issue and need help 🆘'],
                taskId: task.id,
                phaseId: phase.id
            });
        });

        return generated;
    }, []);

    const activePhase = state?.phases?.[activePhaseIdx];
    const steps = useMemo(() => (activePhase ? getPhaseSteps(activePhase) : []), [activePhase, getPhaseSteps]);
    const activeStep = steps[activeStepIdx];

    // Reset step index when phase changes
    useEffect(() => {
        setActiveStepIdx(0);
        setTypewriterComplete(false);
    }, [activePhaseIdx]);

    const handleNext = () => {
        if (transitioning) return;
        setTransitioning(true);
        setTimeout(() => {
            if (activeStepIdx < steps.length - 1) {
                setActiveStepIdx(prev => prev + 1);
                setTypewriterComplete(false);
            } else if (activePhaseIdx < (state?.phases?.length || 0) - 1) {
                setActivePhaseIdx(prev => prev + 1);
            }
            setTransitioning(false);
        }, 300);
    };

    const handlePrev = () => {
        if (transitioning) return;
        setTransitioning(true);
        setTimeout(() => {
            if (activeStepIdx > 0) {
                setActiveStepIdx(prev => prev - 1);
                setTypewriterComplete(true); // skip typing on backward navigation
            } else if (activePhaseIdx > 0) {
                const prevPhase = state.phases[activePhaseIdx - 1];
                const prevSteps = getPhaseSteps(prevPhase);
                setActivePhaseIdx(prev => prev - 1);
                // Delay setting the step to the last one of previous phase
                setTimeout(() => {
                    setActiveStepIdx(prevSteps.length - 1);
                    setTypewriterComplete(true);
                }, 0);
            }
            setTransitioning(false);
        }, 300);
    };

    // Checkpoint interaction helper
    const handleCheckpointClick = (option, step) => {
        if (option.includes('🆘') || option.toLowerCase().includes('help') || option.includes('مشكلة')) {
            // Trigger custom event to open the AI Chat overlay with help template
            const helpEvent = new CustomEvent('workflow_help_request', {
                detail: {
                    message: `Hi, I need help in phase "${activePhase.title}" regarding step: "${step.question || 'completion check'}"`
                }
            });
            window.dispatchEvent(helpEvent);
        } else {
            // Mark task as completed in the blueprint state
            if (step.taskId && step.phaseId && state) {
                const updatedPhases = state.phases.map(p => {
                    if (p.id !== step.phaseId) return p;
                    return {
                        ...p,
                        tasks: p.tasks.map(t => {
                            if (t.id !== step.taskId) return t;
                            return { ...t, status: 'completed' };
                        })
                    };
                });
                const updated = { ...state, phases: updatedPhases };
                setState(updated);
                onWorkflowStateUpdate?.(updated);
            }
            handleNext();
        }
    };

    const handleQuickPrompt = (promptText) => {
        if (onStartProjectPlan) {
            onStartProjectPlan(promptText);
        } else {
            window.dispatchEvent(new CustomEvent('workflow_help_request', {
                detail: { message: promptText }
            }));
        }
    };

    // ── Fetch dynamic, customized steps from backend AI ──
    const handleFetchCustomSteps = async () => {
        if (!projectName.trim() || !ideaDescription.trim()) return;
        setWizardLoading(true);
        try {
            const res = await fetch('/api/v1/engine/workflow/wizard-steps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectName, ideaDescription })
            });
            const data = await res.json();
            if (data.customSteps && data.customSteps.length > 0) {
                setCustomSteps(data.customSteps);
                setWizardStep(2);
            } else {
                setCustomSteps(FALLBACK_WIZARD_STEPS);
                setWizardStep(2);
            }
        } catch (err) {
            console.error('Failed to fetch custom steps:', err);
            setCustomSteps(FALLBACK_WIZARD_STEPS);
            setWizardStep(2);
        } finally {
            setWizardLoading(false);
        }
    };

    // Total steps = 1 (Project Info) + N (AI custom steps) + 1 (Timeline)
    const totalWizardSteps = 1 + customSteps.length + 1;
    const timelineStep = 1 + customSteps.length + 1; // last step index

    const handleNextStep = () => {
        if (wizardStep === 1) {
            handleFetchCustomSteps();
        } else if (wizardStep < timelineStep) {
            setWizardStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => {
        if (wizardStep > 1) setWizardStep(prev => prev - 1);
    };

    const handleFieldChange = (fieldId, val) => {
        setCustomAnswers(prev => ({
            ...prev,
            [fieldId]: val
        }));
    };

    const isStep1Valid = projectName.trim() && ideaDescription.trim();

    const handleGeneratePlan = () => {
        let customAnswersText = '';
        customSteps.forEach(step => {
            customAnswersText += `\n**${step.title}**:\n`;
            step.fields.forEach(field => {
                const ans = customAnswers[field.id];
                const displayAns = Array.isArray(ans) ? ans.join(', ') : (ans || 'Not specified');
                customAnswersText += `- ${field.label}: ${displayAns}\n`;
            });
        });

        const compiledPrompt = `Please generate a comprehensive, interactive project plan/blueprint for a project named "${projectName}".

**Project Description/Goal:**
${ideaDescription}

**Project Parameters & Preferences:**
${customAnswersText}

**Target Timeline Constraints:**
- Timeline: ${targetTimeline === 'custom' ? customTimeline : targetTimeline}

**Format Requirements:**
Please generate a structured blueprint JSON. Inside the phases, any interactive mockup or visual component requested should be defined using step blocks of type "visual" and include valid, complete standalone HTML/JS/CSS code in the "visualCode" property. Avoid outputting visual preview HTML code blocks directly in your chat response; instead, embed them directly inside the blueprint JSON.`;

        onStartProjectPlan?.(compiledPrompt);
    };

    const handleRefineSubmit = () => {
        if (!refineText.trim()) return;
        const stepIdentifier = activeStep?.caption || activeStep?.text || `Step ${activeStepIdx + 1}`;
        const payload = {
            phase: activePhase.title,
            step: stepIdentifier,
            request: refineText
        };
        const promptText = `[REFINE]${JSON.stringify(payload)}
Please modify my project plan. 
Specifically, in Phase "${activePhase.title}", for the step "${stepIdentifier}":
"${refineText}"

Please update the structured blueprint JSON to reflect this modification. Formating rule: Use clean Markdown or plain text for tool guides and descriptions; do not output raw unparsed HTML tags.`;

        onStartProjectPlan?.(promptText);
        setIsRefining(false);
        setRefineText('');
    };

    // wizardStep 2 = customSteps[0], step 3 = customSteps[1], etc.
    const currentStep = wizardStep >= 2 && wizardStep < timelineStep ? customSteps[wizardStep - 2] : null;

    if (!state || !state.phases || state.phases.length === 0) {
        if (isLoading) {
            return (
                <div className={styles.loadingContainer}>
                    <Sparkles className={styles.loadingIcon} size={32} style={{ animation: 'spin 3s linear infinite' }} />
                    <p>Generating interactive roadmap with AI...</p>
                </div>
            );
        }
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyGlow} />
                
                {/* ── Progress Indicators for Wizard (Dynamic) ── */}
                <div className={styles.wizardProgressContainer}>
                    {/* Step 1: Project Info */}
                    <div className={`${styles.wizardProgressStep} ${wizardStep >= 1 ? styles.stepDone : ''} ${wizardStep === 1 ? styles.stepCurrent : ''}`}>
                        <div className={styles.stepNum}>
                            {wizardStep > 1 ? <Check size={14} /> : 1}
                        </div>
                        <span className={styles.stepLabel}>Project Info</span>
                    </div>

                    {/* AI-generated dynamic steps */}
                    {customSteps.map((step, idx) => {
                        const stepNum = idx + 2;
                        return (
                            <React.Fragment key={step.title || idx}>
                                <div className={styles.stepDivider} />
                                <div className={`${styles.wizardProgressStep} ${wizardStep > stepNum ? styles.stepDone : ''} ${wizardStep === stepNum ? styles.stepCurrent : ''}`}>
                                    <div className={styles.stepNum}>
                                        {wizardStep > stepNum ? <Check size={14} /> : stepNum}
                                    </div>
                                    <span className={styles.stepLabel}>{step.title}</span>
                                </div>
                            </React.Fragment>
                        );
                    })}

                    {/* Last step: Timeline (only shown after AI steps are loaded) */}
                    {customSteps.length > 0 && (
                        <React.Fragment>
                            <div className={styles.stepDivider} />
                            <div className={`${styles.wizardProgressStep} ${wizardStep >= timelineStep ? styles.stepDone : ''} ${wizardStep === timelineStep ? styles.stepCurrent : ''}`}>
                                <div className={styles.stepNum}>
                                    {wizardStep > timelineStep ? <Check size={14} /> : timelineStep}
                                </div>
                                <span className={styles.stepLabel}>Timeline</span>
                            </div>
                        </React.Fragment>
                    )}
                </div>

                <div className={styles.wizardCard}>
                    
                    {/* LOADING INTERFACE WHILE AI GENERATES CUSTOM QUESTIONS */}
                    {wizardLoading && (
                        <div className={styles.wizardLoadingContent}>
                            <RefreshCw className={styles.wizardLoadingIcon} size={36} />
                            <h3 className={styles.wizardLoadingTitle}>Analyzing Project Concept</h3>
                            <p className={styles.wizardLoadingDesc}>HUBly AI is tailoring custom configuration options specifically for your project...</p>
                        </div>
                    )}

                    {/* STEP 1: PROJECT INFO */}
                    {!wizardLoading && wizardStep === 1 && (
                        <div className={styles.wizardStepContent}>
                            <h3 className={styles.wizardStepTitle}>
                                Describe Your Project Idea 💡
                            </h3>
                            <p className={styles.wizardStepDesc}>
                                Let's get started. What are we building today? Give it a name and describe the core concept.
                            </p>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Project Name</label>
                                <input 
                                    type="text" 
                                    className={styles.formInput} 
                                    placeholder="e.g. AI Sci-Fi Short Movie, FitTrack SaaS..."
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    maxLength={80}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Core Idea Description</label>
                                <textarea 
                                    className={styles.formTextarea} 
                                    placeholder="Explain what the project does, target audience, and main workflow..."
                                    value={ideaDescription}
                                    onChange={(e) => setIdeaDescription(e.target.value)}
                                    rows={5}
                                />
                            </div>

                            <div className={styles.wizardActions}>
                                <div style={{ flex: 1 }} />
                                <button 
                                    className={`${styles.wizardNextBtn} ${!isStep1Valid ? styles.btnDisabled : ''}`}
                                    onClick={handleNextStep}
                                    disabled={!isStep1Valid}
                                >
                                    Customize Form with AI <Sparkles size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC CUSTOM STEPS (all AI-generated steps) */}
                    {!wizardLoading && wizardStep >= 2 && wizardStep < timelineStep && currentStep && (
                        <div className={styles.wizardStepContent}>
                            <h3 className={styles.wizardStepTitle}>
                                {currentStep.title}
                            </h3>
                            <p className={styles.wizardStepDesc}>
                                {currentStep.desc}
                            </p>

                            {currentStep.fields?.map(field => {
                                if (field.type === 'select') {
                                    return (
                                        <div className={styles.formGroup} key={field.id}>
                                            <label className={styles.formLabel}>{field.label}</label>
                                            <div className={styles.chipsContainer}>
                                                {field.options?.map(opt => (
                                                    <button 
                                                        key={opt}
                                                        type="button"
                                                        className={`${styles.chipBtn} ${customAnswers[field.id] === opt ? styles.chipActive : ''}`}
                                                        onClick={() => handleFieldChange(field.id, opt)}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                if (field.type === 'multiselect') {
                                    const selected = customAnswers[field.id] || [];
                                    return (
                                        <div className={styles.formGroup} key={field.id}>
                                            <label className={styles.formLabel}>{field.label}</label>
                                            <div className={styles.chipsContainer}>
                                                {field.options?.map(opt => {
                                                    const isActive = selected.includes(opt);
                                                    return (
                                                        <button 
                                                            key={opt}
                                                            type="button"
                                                            className={`${styles.chipBtn} ${isActive ? styles.chipActive : ''}`}
                                                            onClick={() => {
                                                                const newVal = isActive ? selected.filter(x => x !== opt) : [...selected, opt];
                                                                handleFieldChange(field.id, newVal);
                                                            }}
                                                        >
                                                            {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }
                                if (field.type === 'textarea') {
                                    return (
                                        <div className={styles.formGroup} key={field.id}>
                                            <label className={styles.formLabel}>{field.label}</label>
                                            <textarea 
                                                className={styles.formTextarea} 
                                                placeholder={field.placeholder || ''}
                                                value={customAnswers[field.id] || ''}
                                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    );
                                }
                                return (
                                    <div className={styles.formGroup} key={field.id}>
                                        <label className={styles.formLabel}>{field.label}</label>
                                        <input 
                                            type="text" 
                                            className={styles.formInput} 
                                            placeholder={field.placeholder || ''}
                                            value={customAnswers[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        />
                                    </div>
                                );
                            })}

                            <div className={styles.wizardActions}>
                                <button className={styles.wizardBackBtn} onClick={handlePrevStep}>
                                    <ChevronLeft size={16} /> Back
                                </button>
                                <button className={styles.wizardNextBtn} onClick={handleNextStep}>
                                    Continue <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* FINAL STEP: TIMELINE & TARGET CONSTRAINTS */}
                    {!wizardLoading && wizardStep === timelineStep && (
                        <div className={styles.wizardStepContent}>
                            <h3 className={styles.wizardStepTitle}>
                                Timeline & Launch Constraints 📅
                            </h3>
                            <p className={styles.wizardStepDesc}>
                                Set timeline objectives and let the AI partition resources and tasks accordingly.
                            </p>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Target Timeline</label>
                                <div className={styles.timelineSelectorGrid}>
                                    {[
                                        { label: '1 Week (MVP)', value: '1 week' },
                                        { label: '2-4 Weeks (Beta)', value: '2-4 weeks' },
                                        { label: '1-3 Months (Complete)', value: '1-3 months' },
                                        { label: 'Custom Timeline', value: 'custom' },
                                    ].map(opt => {
                                        const isActive = targetTimeline === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                className={`${styles.timelineOptBtn} ${isActive ? styles.timelineOptBtnActive : ''}`}
                                                onClick={() => setTargetTimeline(opt.value)}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {targetTimeline === 'custom' && (
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Custom Timeline Details</label>
                                    <input 
                                        type="text" 
                                        className={styles.formInput} 
                                        placeholder="e.g. 6 Months, or urgent 3-day hackathon..."
                                        value={customTimeline}
                                        onChange={(e) => setCustomTimeline(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className={styles.wizardActions} style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <button className={styles.wizardBackBtn} onClick={handlePrevStep}>
                                    <ChevronLeft size={16} /> Back
                                </button>
                                <button className={styles.wizardSubmitBtn} onClick={handleGeneratePlan}>
                                    Generate Tailored Project Plan <Sparkles size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Quick start suggestions below card for alternative speed flow */}
                {!projectName.trim() && !ideaDescription.trim() && (
                    <div className={styles.wizardQuickStarts}>
                        <p className={styles.quickStartsLabel}>Or fast-track with a pre-configured template:</p>
                        <div className={styles.quickStartButtons}>
                            <button 
                                className={styles.quickStartBtn}
                                onClick={() => handleQuickPrompt("Create a complete plan to build a SaaS dashboard with Stripe subscription billing")}
                            >
                                💳 SaaS Billing Portal
                            </button>
                            <button 
                                className={styles.quickStartBtn}
                                onClick={() => handleQuickPrompt("make me a full plan to build a menu website for restaurant")}
                            >
                                🍽️ Restaurant Menu Website
                            </button>
                            <button 
                                className={styles.quickStartBtn}
                                onClick={() => handleQuickPrompt("Design a real-time analytics dashboard component and task flow")}
                            >
                                📊 Live Analytics Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (!activePhase) {
        return (
            <div className={styles.loadingContainer}>
                <Sparkles className={styles.loadingIcon} size={32} />
                <p>Loading interactive presentation...</p>
            </div>
        );
    }

    const phaseColor = activePhase.accentColor || '#00d2ff';

    return (
        <div className={styles.presenterRoot} dir="ltr">
            
            {/* ── Top Timeline Tracker ── */}
            <div className={styles.timelineTracker}>
                {state.phases.map((phase, pIdx) => {
                    const isCompleted = pIdx < activePhaseIdx;
                    const isActive = pIdx === activePhaseIdx;
                    const color = phase.accentColor || '#00d2ff';
                    
                    return (
                        <div 
                            key={phase.id || `phase-node-${pIdx}`} 
                            onClick={() => { setActivePhaseIdx(pIdx); }}
                            className={`${styles.timelineNode} ${isActive ? styles.nodeActive : ''} ${isCompleted ? styles.nodeCompleted : ''}`}
                            style={{ '--accent-color': color }}
                        >
                            <div className={styles.nodeCircle}>
                                {isCompleted ? <Check size={14} /> : pIdx + 1}
                            </div>
                            <span className={styles.nodeTitle}>{phase.title}</span>
                        </div>
                    );
                })}
            </div>

            {/* ── Main Presentation Canvas ── */}
            <div className={`${styles.canvasArea} ${transitioning ? styles.fadeOut : styles.fadeIn}`}>
                
                {/* Active Phase Info */}
                <div className={styles.phaseHeader} style={{ borderColor: phaseColor }}>
                    <div className={styles.phaseBadge} style={{ backgroundColor: `${phaseColor}15`, color: phaseColor }}>
                        Phase {activePhaseIdx + 1} of {state.phases.length}
                    </div>
                    <h2 className={styles.phaseTitle}>{activePhase.title}</h2>
                    <p className={styles.phaseDescription}>{activePhase.description}</p>
                </div>

                {/* Animated Interactive Step Card */}
                <div className={styles.stepCard}>
                    
                    {!isRefining && (
                        <button 
                            className={styles.stepEditBtn} 
                            onClick={() => setIsRefining(true)}
                            title="Refine or modify this step"
                        >
                            <Edit2 size={12} /> Refine Step
                        </button>
                    )}

                    {isRefining ? (
                        <div className={styles.refineOverlay}>
                            <h4 className={styles.refineTitle}>Refine this Step ✏️</h4>
                            <p className={styles.refineDesc}>Describe what you want the AI to change, explain, or add to this step.</p>
                            <textarea
                                className={styles.refineTextarea}
                                placeholder="e.g. Explain this tool in detail, or update this mockup page..."
                                value={refineText}
                                onChange={(e) => setRefineText(e.target.value)}
                                rows={3}
                                autoFocus
                            />
                            <div className={styles.refineActions}>
                                <button className={styles.refineCancelBtn} onClick={() => { setIsRefining(false); setRefineText(''); }}>
                                    Cancel
                                </button>
                                <button 
                                    className={styles.refineSubmitBtn} 
                                    onClick={handleRefineSubmit}
                                    disabled={!refineText.trim()}
                                >
                                    Send to AI Chat <Sparkles size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Render: Typewriter Step */}
                            {activeStep?.type === 'typewriter' && (
                                <div className={styles.typewriterWrapper}>
                                    <TypewriterText 
                                        text={activeStep.text} 
                                        onComplete={() => setTypewriterComplete(true)} 
                                    />
                                </div>
                            )}

                            {/* Render: Visual Sandbox Component */}
                            {activeStep?.type === 'visual' && (
                                <div className={styles.visualWrapper}>
                                    {activeStep.caption && <h5 className={styles.visualCaption}>📊 {activeStep.caption}</h5>}
                                    <div className={styles.visualFrameContainer}>
                                        <VisualRenderer code={activeStep.visualCode} />
                                    </div>
                                </div>
                            )}

                            {/* Render: Recommended Tool Card */}
                            {activeStep?.type === 'tool' && (
                                <div className={styles.toolWrapper}>
                                    <div className={styles.toolCard} style={{ borderColor: `${phaseColor}20` }}>
                                        <div className={styles.toolHeader}>
                                            <img 
                                                src={getToolLogo(activeStep.name, activeStep.logoUrl)} 
                                                alt={activeStep.name} 
                                                className={styles.toolLogo}
                                                onError={(e) => { e.target.src = `https://www.google.com/s2/favicons?domain=google.com&sz=64`; }}
                                            />
                                            <div>
                                                <h4>{activeStep.name}</h4>
                                                <span className={styles.toolBadge}>Suggested Tool</span>
                                            </div>
                                            <a href={normalizeUrl(activeStep.url)} target="_blank" rel="noopener noreferrer" className={styles.toolLink}>
                                                Visit Website <ExternalLink size={12} />
                                            </a>
                                        </div>
                                        <p className={styles.toolDesc}>{activeStep.description}</p>
                                        <div className={styles.toolGuide}>
                                            <h5><BookOpen size={14} /> Quick Start Guide:</h5>
                                            <FormattedGuide text={activeStep.guide} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Render: Interactive Checkpoint Decision */}
                            {activeStep?.type === 'checkpoint' && (
                                <div className={styles.checkpointWrapper}>
                                    <div className={styles.checkpointIconBadge}>
                                        <HelpCircle size={22} />
                                    </div>
                                    <h4 className={styles.checkpointQuestion}>
                                        {(activeStep.question || '').replace(/[❓✅🆘❌⚠️💡🔑]/g, '').trim()}
                                    </h4>
                                    <div className={styles.checkpointOptionsGrid}>
                                        {activeStep.options?.map((opt, oIdx) => {
                                            const cleanOpt = opt.replace(/[❓✅🆘❌⚠️💡🔑]/g, '').trim();
                                            const colors = [
                                                { bg: 'rgba(0,210,255,0.06)', border: 'rgba(0,210,255,0.25)', color: '#00d2ff' },
                                                { bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.25)', color: '#a78bfa' },
                                                { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.25)', color: '#34d399' },
                                                { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.25)', color: '#fbbf24' },
                                            ];
                                            const c = colors[oIdx % colors.length];
                                            return (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => handleCheckpointClick(opt, activeStep)}
                                                    className={styles.checkpointOptionCard}
                                                    style={{ background: c.bg, borderColor: c.border }}
                                                >
                                                    <span className={styles.checkpointOptionDot} style={{ background: c.color }} />
                                                    <span className={styles.checkpointOptionLabel} style={{ color: c.color }}>{cleanOpt}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>

            </div>

            {/* ── Slide Navigation Controls ── */}
            <div className={styles.controlsBar}>
                <button 
                    onClick={handlePrev}
                    disabled={activePhaseIdx === 0 && activeStepIdx === 0}
                    className={styles.navBtn}
                >
                    <ChevronLeft size={20} />
                    <span>Previous</span>
                </button>

                <div className={styles.stepProgressDots}>
                    {steps.map((_, sIdx) => (
                        <div 
                            key={sIdx} 
                            className={`${styles.progressDot} ${sIdx === activeStepIdx ? styles.dotActive : ''}`} 
                            style={{ backgroundColor: sIdx === activeStepIdx ? phaseColor : undefined }}
                        />
                    ))}
                </div>

                <button 
                    onClick={handleNext}
                    disabled={activePhaseIdx === state.phases.length - 1 && activeStepIdx === steps.length - 1}
                    className={`${styles.navBtn} ${styles.btnPrimary}`}
                    style={{ backgroundColor: phaseColor }}
                >
                    <span>Next</span>
                    <ChevronRight size={20} />
                </button>
            </div>

        </div>
    );
}
