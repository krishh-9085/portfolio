import defaultProjects from '../data/defaultProjects';
import { isAdminAuthenticated } from './adminAuthService';
const PROJECTS_STORAGE_KEY = 'portfolio_projects_v1';
const PROJECTS_UPDATED_EVENT = 'portfolio-projects-updated';

const normalizeProject = (project, fallbackId = String(Date.now())) => ({
    id: String(project.id || fallbackId),
    title: project.title || 'Untitled Project',
    image: project.image || '',
    github: project.github || '',
    demo: project.demo || '',
    tags: Array.isArray(project.tags) ? project.tags : [],
    desc: project.desc || '',
    isNew: Boolean(project.isNew),
    isFeatured: Boolean(project.isFeatured),
    isPopular: Boolean(project.isPopular),
    createdAt: Number(project.createdAt || Date.now())
});

const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readProjects = () => {
    if (!canUseStorage) {
        return defaultProjects.map((project) => normalizeProject(project, project.id));
    }

    const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);

    if (!raw) {
        const initialProjects = defaultProjects.map((project) => normalizeProject(project, project.id));
        window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initialProjects));
        return initialProjects;
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map((project, index) => normalizeProject(project, `${Date.now()}-${index}`));
    } catch {
        return [];
    }
};

const writeProjects = (projects) => {
    if (!canUseStorage) {
        return;
    }

    try {
        window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
        if (error && error.name === 'QuotaExceededError') {
            throw new Error('Storage limit reached. Try using smaller images or fewer projects.');
        }
        throw error;
    }

    window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT, { detail: projects }));
};

export const subscribeToProjects = (onData, onError) => {
    try {
        onData(readProjects());
    } catch (error) {
        if (onError) {
            onError(error);
        }
    }

    if (!canUseStorage) {
        return () => { };
    }

    const handleStorage = (event) => {
        if (event.key === PROJECTS_STORAGE_KEY) {
            onData(readProjects());
        }
    };

    const handleInTabUpdate = () => {
        onData(readProjects());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(PROJECTS_UPDATED_EVENT, handleInTabUpdate);

    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(PROJECTS_UPDATED_EVENT, handleInTabUpdate);
    };
};

export const addProject = async (project) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const payload = normalizeProject({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: project.title,
        image: project.image,
        github: project.github,
        demo: project.demo,
        tags: project.tags,
        desc: project.desc,
        isNew: Boolean(project.isNew),
        isFeatured: Boolean(project.isFeatured),
        isPopular: Boolean(project.isPopular),
        createdAt: Date.now()
    });

    const current = readProjects();
    writeProjects([payload, ...current]);
    return payload;
};

export const updateProject = async (projectId, project) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const targetId = String(projectId);
    const current = readProjects();
    let updatedProject = null;

    const next = current.map((item) => {
        if (item.id !== targetId) {
            return item;
        }

        updatedProject = normalizeProject({
            ...item,
            ...project,
            id: item.id,
            createdAt: item.createdAt
        }, item.id);

        return updatedProject;
    });

    if (!updatedProject) {
        throw new Error('Project not found.');
    }

    writeProjects(next);
    return updatedProject;
};

export const removeProject = async (projectId) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const current = readProjects();
    const next = current.filter((project) => project.id !== String(projectId));
    writeProjects(next);
};

export const reorderProjects = async (sourceProjectId, targetProjectId) => {
    if (!isAdminAuthenticated()) {
        throw new Error('Unauthorized admin action.');
    }

    const sourceId = String(sourceProjectId);
    const targetId = String(targetProjectId);

    if (!sourceId || !targetId || sourceId === targetId) {
        return readProjects();
    }

    const current = readProjects();
    const sourceIndex = current.findIndex((project) => project.id === sourceId);
    const targetIndex = current.findIndex((project) => project.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) {
        throw new Error('Could not reorder projects.');
    }

    const next = [...current];
    const [movedProject] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, movedProject);

    writeProjects(next);
    return next;
};
