import defaultExperience from '../data/defaultExperience';
import { isAdminAuthenticated } from './adminAuthService';

const EXPERIENCE_STORAGE_KEY = 'portfolio_experience_v1';
const EXPERIENCE_UPDATED_EVENT = 'portfolio-experience-updated';
const EXPERIENCE_CATEGORIES = ['frontend', 'backend'];

const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const normalizeCategory = (value) => (value === 'backend' ? 'backend' : 'frontend');

const normalizeSkill = (value) => String(value || '').trim();
const normalizeLevel = (value) => String(value || 'Intermediate').trim() || 'Intermediate';

const normalizeItem = (item, fallbackId) => ({
    id: String(item?.id || fallbackId),
    skill: normalizeSkill(item?.skill),
    level: normalizeLevel(item?.level)
});

const createDefaultExperience = () => ({
    frontend: defaultExperience.frontend.map((item, index) => normalizeItem(item, `frontend-${index + 1}`)),
    backend: defaultExperience.backend.map((item, index) => normalizeItem(item, `backend-${index + 1}`))
});

const normalizeExperience = (payload) => {
    const normalized = {
        frontend: [],
        backend: []
    };

    EXPERIENCE_CATEGORIES.forEach((category) => {
        const source = Array.isArray(payload?.[category]) ? payload[category] : [];
        normalized[category] = source
            .map((item, index) => normalizeItem(item, `${category}-${Date.now()}-${index}`))
            .filter((item) => item.skill);
    });

    return normalized;
};

const readExperience = () => {
    if (!canUseStorage) {
        return createDefaultExperience();
    }

    const raw = window.localStorage.getItem(EXPERIENCE_STORAGE_KEY);
    if (!raw) {
        const defaults = createDefaultExperience();
        window.localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
    }

    try {
        const parsed = JSON.parse(raw);
        return normalizeExperience(parsed);
    } catch {
        return createDefaultExperience();
    }
};

const writeExperience = (experience) => {
    if (!canUseStorage) {
        return;
    }

    const payload = normalizeExperience(experience);
    window.localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(EXPERIENCE_UPDATED_EVENT, { detail: payload }));
};

const findItemCategory = (experience, itemId) => (
    EXPERIENCE_CATEGORIES.find((category) => experience[category].some((item) => item.id === String(itemId))) || ''
);

export const subscribeToExperience = (onData, onError) => {
    try {
        onData(readExperience());
    } catch (error) {
        if (onError) {
            onError(error);
        }
    }

    if (!canUseStorage) {
        return () => { };
    }

    const handleStorage = (event) => {
        if (event.key === EXPERIENCE_STORAGE_KEY) {
            onData(readExperience());
        }
    };

    const handleInTabUpdate = () => {
        onData(readExperience());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(EXPERIENCE_UPDATED_EVENT, handleInTabUpdate);

    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(EXPERIENCE_UPDATED_EVENT, handleInTabUpdate);
    };
};

export const addExperienceItem = async ({ category, skill, level }) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const normalizedSkill = normalizeSkill(skill);
    if (!normalizedSkill) {
        throw new Error('Skill is required.');
    }

    const nextCategory = normalizeCategory(category);
    const current = readExperience();
    const newItem = normalizeItem(
        {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            skill: normalizedSkill,
            level: normalizeLevel(level)
        },
        `${Date.now()}`
    );

    const next = {
        ...current,
        [nextCategory]: [...current[nextCategory], newItem]
    };

    writeExperience(next);
    return newItem;
};

export const updateExperienceItem = async (itemId, updates) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const targetId = String(itemId);
    const current = readExperience();
    const currentCategory = findItemCategory(current, targetId);

    if (!currentCategory) {
        throw new Error('Experience item not found.');
    }

    const currentItem = current[currentCategory].find((item) => item.id === targetId);
    const nextCategory = normalizeCategory(updates?.category || currentCategory);
    const nextItem = normalizeItem(
        {
            ...currentItem,
            ...updates,
            id: currentItem.id
        },
        currentItem.id
    );

    if (!nextItem.skill) {
        throw new Error('Skill is required.');
    }

    const next = {
        frontend: current.frontend.filter((item) => item.id !== targetId),
        backend: current.backend.filter((item) => item.id !== targetId)
    };

    next[nextCategory] = [...next[nextCategory], nextItem];
    writeExperience(next);
    return nextItem;
};

export const removeExperienceItem = async (itemId) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const targetId = String(itemId);
    const current = readExperience();
    const next = {
        frontend: current.frontend.filter((item) => item.id !== targetId),
        backend: current.backend.filter((item) => item.id !== targetId)
    };

    writeExperience(next);
};
