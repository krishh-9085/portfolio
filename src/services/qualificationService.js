import defaultQualification from '../data/defaultQualification';
import { isAdminAuthenticated } from './adminAuthService';

const QUALIFICATION_STORAGE_KEY = 'portfolio_qualification_v1';
const QUALIFICATION_UPDATED_EVENT = 'portfolio-qualification-updated';
const QUALIFICATION_CATEGORIES = ['education', 'experience'];

const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const normalizeCategory = (value) => (value === 'experience' ? 'experience' : 'education');
const normalizeText = (value) => String(value || '').trim();

const normalizeItem = (item, fallbackId) => ({
    id: String(item?.id || fallbackId),
    title: normalizeText(item?.title),
    subtitle: normalizeText(item?.subtitle),
    period: normalizeText(item?.period)
});

const createDefaultQualification = () => ({
    education: defaultQualification.education.map((item, index) => normalizeItem(item, `education-${index + 1}`)),
    experience: defaultQualification.experience.map((item, index) => normalizeItem(item, `experience-${index + 1}`))
});

const normalizeQualification = (payload) => {
    const normalized = {
        education: [],
        experience: []
    };

    QUALIFICATION_CATEGORIES.forEach((category) => {
        const source = Array.isArray(payload?.[category]) ? payload[category] : [];
        normalized[category] = source
            .map((item, index) => normalizeItem(item, `${category}-${Date.now()}-${index}`))
            .filter((item) => item.title && item.subtitle && item.period);
    });

    return normalized;
};

const readQualification = () => {
    if (!canUseStorage) {
        return createDefaultQualification();
    }

    const raw = window.localStorage.getItem(QUALIFICATION_STORAGE_KEY);
    if (!raw) {
        const defaults = createDefaultQualification();
        window.localStorage.setItem(QUALIFICATION_STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
    }

    try {
        return normalizeQualification(JSON.parse(raw));
    } catch {
        return createDefaultQualification();
    }
};

const writeQualification = (qualification) => {
    if (!canUseStorage) {
        return;
    }

    const payload = normalizeQualification(qualification);
    window.localStorage.setItem(QUALIFICATION_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(QUALIFICATION_UPDATED_EVENT, { detail: payload }));
};

const findItemCategory = (qualification, itemId) => (
    QUALIFICATION_CATEGORIES.find((category) => qualification[category].some((item) => item.id === String(itemId))) || ''
);

export const subscribeToQualification = (onData, onError) => {
    try {
        onData(readQualification());
    } catch (error) {
        if (onError) {
            onError(error);
        }
    }

    if (!canUseStorage) {
        return () => { };
    }

    const handleStorage = (event) => {
        if (event.key === QUALIFICATION_STORAGE_KEY) {
            onData(readQualification());
        }
    };

    const handleInTabUpdate = () => {
        onData(readQualification());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(QUALIFICATION_UPDATED_EVENT, handleInTabUpdate);

    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(QUALIFICATION_UPDATED_EVENT, handleInTabUpdate);
    };
};

export const addQualificationItem = async ({ category, title, subtitle, period }) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const normalizedTitle = normalizeText(title);
    const normalizedSubtitle = normalizeText(subtitle);
    const normalizedPeriod = normalizeText(period);
    if (!normalizedTitle || !normalizedSubtitle || !normalizedPeriod) {
        throw new Error('Title, subtitle and period are required.');
    }

    const nextCategory = normalizeCategory(category);
    const current = readQualification();
    const newItem = normalizeItem(
        {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: normalizedTitle,
            subtitle: normalizedSubtitle,
            period: normalizedPeriod
        },
        `${Date.now()}`
    );

    const next = {
        ...current,
        [nextCategory]: [...current[nextCategory], newItem]
    };

    writeQualification(next);
    return newItem;
};

export const updateQualificationItem = async (itemId, updates) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const targetId = String(itemId);
    const current = readQualification();
    const currentCategory = findItemCategory(current, targetId);

    if (!currentCategory) {
        throw new Error('Qualification item not found.');
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

    if (!nextItem.title || !nextItem.subtitle || !nextItem.period) {
        throw new Error('Title, subtitle and period are required.');
    }

    const next = {
        education: current.education.filter((item) => item.id !== targetId),
        experience: current.experience.filter((item) => item.id !== targetId)
    };

    next[nextCategory] = [...next[nextCategory], nextItem];
    writeQualification(next);
    return nextItem;
};

export const removeQualificationItem = async (itemId) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const targetId = String(itemId);
    const current = readQualification();
    const next = {
        education: current.education.filter((item) => item.id !== targetId),
        experience: current.experience.filter((item) => item.id !== targetId)
    };

    writeQualification(next);
};
