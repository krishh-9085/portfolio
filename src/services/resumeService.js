import defaultResume from '../assets/krishna_Resume_DEV_.pdf';
import { isAdminAuthenticated } from './adminAuthService';

const RESUME_STORAGE_KEY = 'portfolio_resume_v1';
const RESUME_UPDATED_EVENT = 'portfolio-resume-updated';

const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const normalizeResume = (resume) => ({
    url: String(resume?.url || defaultResume).trim() || defaultResume,
    fileName: String(resume?.fileName || 'Resume.pdf').trim() || 'Resume.pdf'
});

const readResume = () => {
    if (!canUseStorage) {
        return normalizeResume({});
    }

    const raw = window.localStorage.getItem(RESUME_STORAGE_KEY);
    if (!raw) {
        return normalizeResume({});
    }

    try {
        return normalizeResume(JSON.parse(raw));
    } catch {
        return normalizeResume({});
    }
};

const writeResume = (resume) => {
    if (!canUseStorage) {
        return;
    }

    const payload = normalizeResume(resume);
    window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(RESUME_UPDATED_EVENT, { detail: payload }));
};

export const subscribeToResume = (onData) => {
    onData(readResume());

    if (!canUseStorage) {
        return () => { };
    }

    const handleStorage = (event) => {
        if (event.key === RESUME_STORAGE_KEY) {
            onData(readResume());
        }
    };

    const handleInTabUpdate = () => {
        onData(readResume());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(RESUME_UPDATED_EVENT, handleInTabUpdate);

    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(RESUME_UPDATED_EVENT, handleInTabUpdate);
    };
};

export const updateResume = async (resume) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const payload = normalizeResume(resume);

    if (!payload.url) {
        throw new Error('Resume URL is required.');
    }

    writeResume(payload);
    return payload;
};

export const getDefaultResumeUrl = () => defaultResume;
