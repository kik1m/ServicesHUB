'use client';
import React, { createContext, useContext, useState } from 'react';

const ArtifactContext = createContext();

export function ArtifactProvider({ children }) {
    const [activeArtifact, setActiveArtifact] = useState(null); // { type, title, rawData, isComplete }

    return (
        <ArtifactContext.Provider value={{ activeArtifact, setActiveArtifact }}>
            {children}
        </ArtifactContext.Provider>
    );
}

export function useArtifact() {
    return useContext(ArtifactContext);
}
