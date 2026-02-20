import { useEffect, useMemo, useState } from 'react';
import { addProject, removeProject, reorderProjects, subscribeToProjects, updateProject } from '../../services/projectsService';
import { subscribeToResume, updateResume } from '../../services/resumeService';
import { addExperienceItem, removeExperienceItem, subscribeToExperience, updateExperienceItem } from '../../services/experienceService';
import { addQualificationItem, removeQualificationItem, subscribeToQualification, updateQualificationItem } from '../../services/qualificationService';
import { isCloudinaryConfigured, uploadImageToCloudinary } from '../../services/cloudinaryService';
import { isSupabaseResumeConfigured, uploadResumeToSupabase } from '../../services/supabaseStorageService';
import { loginAdmin, logoutAdmin, subscribeToAdminAuth } from '../../services/adminAuthService';
import './admin.css';

const initialForm = {
    title: '',
    image: '',
    github: '',
    demo: '',
    tags: '',
    desc: '',
    isNew: false,
    isFeatured: false,
    isPopular: false
};

const initialExperienceForm = {
    category: 'frontend',
    skill: '',
    level: 'Intermediate'
};

const initialQualificationForm = {
    category: 'education',
    title: '',
    subtitle: '',
    period: ''
};

const experienceLevelOptions = ['Basic', 'Intermediate', 'Proficient'];

const MAX_IMAGE_SIZE_MB = 1.5;
const MAX_IMAGE_BYTES = Math.floor(MAX_IMAGE_SIZE_MB * 1024 * 1024);
const MAX_RESUME_SIZE_MB = 5;
const MAX_RESUME_BYTES = Math.floor(MAX_RESUME_SIZE_MB * 1024 * 1024);
const CLOUDINARY_READY = isCloudinaryConfigured();
const SUPABASE_RESUME_READY = isSupabaseResumeConfigured();

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [resume, setResume] = useState({ url: '', fileName: 'Resume.pdf' });
    const [experience, setExperience] = useState({ frontend: [], backend: [] });
    const [qualification, setQualification] = useState({ education: [], experience: [] });
    const [authState, setAuthState] = useState({ isConfigured: false, isAuthenticated: false, email: '' });
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState('');
    const [isSavingId, setIsSavingId] = useState('');
    const [editingId, setEditingId] = useState('');
    const [isUploadingCreateImage, setIsUploadingCreateImage] = useState(false);
    const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);
    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const [isResumeDragOver, setIsResumeDragOver] = useState(false);
    const [isExperienceLoading, setIsExperienceLoading] = useState(true);
    const [isExperienceSubmitting, setIsExperienceSubmitting] = useState(false);
    const [isDeletingExperienceId, setIsDeletingExperienceId] = useState('');
    const [isSavingExperienceId, setIsSavingExperienceId] = useState('');
    const [editingExperienceId, setEditingExperienceId] = useState('');
    const [isQualificationLoading, setIsQualificationLoading] = useState(true);
    const [isQualificationSubmitting, setIsQualificationSubmitting] = useState(false);
    const [isDeletingQualificationId, setIsDeletingQualificationId] = useState('');
    const [isSavingQualificationId, setIsSavingQualificationId] = useState('');
    const [editingQualificationId, setEditingQualificationId] = useState('');
    const [draggingId, setDraggingId] = useState('');
    const [dropTargetId, setDropTargetId] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [form, setForm] = useState(initialForm);
    const [editForm, setEditForm] = useState(initialForm);
    const [experienceForm, setExperienceForm] = useState(initialExperienceForm);
    const [experienceEditForm, setExperienceEditForm] = useState(initialExperienceForm);
    const [qualificationForm, setQualificationForm] = useState(initialQualificationForm);
    const [qualificationEditForm, setQualificationEditForm] = useState(initialQualificationForm);
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    useEffect(() => {
        const unsubAuth = subscribeToAdminAuth((nextState) => {
            setAuthState(nextState);
            setIsAuthLoading(false);
        });

        return () => {
            unsubAuth();
        };
    }, []);

    useEffect(() => {
        const unsubProjects = subscribeToProjects(
            (items) => {
                setProjects(items);
                setIsLoadingProjects(false);
            },
            () => {
                setError('Could not load projects right now.');
                setIsLoadingProjects(false);
            }
        );

        return () => {
            unsubProjects();
        };
    }, []);

    useEffect(() => {
        const unsubResume = subscribeToResume((nextResume) => {
            setResume(nextResume);
        });

        return () => {
            unsubResume();
        };
    }, []);

    useEffect(() => {
        const unsubExperience = subscribeToExperience(
            (nextExperience) => {
                setExperience(nextExperience);
                setIsExperienceLoading(false);
            },
            () => {
                setError('Could not load experience skills right now.');
                setIsExperienceLoading(false);
            }
        );

        return () => {
            unsubExperience();
        };
    }, []);

    useEffect(() => {
        const unsubQualification = subscribeToQualification(
            (nextQualification) => {
                setQualification(nextQualification);
                setIsQualificationLoading(false);
            },
            () => {
                setError('Could not load qualification entries right now.');
                setIsQualificationLoading(false);
            }
        );

        return () => {
            unsubQualification();
        };
    }, []);

    const parsedTags = useMemo(
        () => form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        [form.tags]
    );

    const handleAddProject = async (event) => {
        event.preventDefault();
        setError('');
        setStatus('');

        if (!form.title || !form.image || !form.github || !form.desc || parsedTags.length === 0) {
            setError('Title, image, github, description and tags are required.');
            return;
        }

        try {
            setIsSubmitting(true);
            await addProject({
                ...form,
                tags: parsedTags
            });
            setForm(initialForm);
            setStatus('Project added. It is now live on your portfolio.');
        } catch (addError) {
            setError(addError?.message || 'Could not add project right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        setError('');
        setStatus('');

        try {
            setIsDeletingId(projectId);
            await removeProject(projectId);
            setStatus('Project removed successfully.');
        } catch {
            setError('Could not remove project right now.');
        } finally {
            setIsDeletingId('');
        }
    };

    const startEditing = (project) => {
        setError('');
        setStatus('');
        setEditingId(project.id);
        setEditForm({
            title: project.title || '',
            image: project.image || '',
            github: project.github || '',
            demo: project.demo || '',
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
            desc: project.desc || '',
            isNew: Boolean(project.isNew),
            isFeatured: Boolean(project.isFeatured),
            isPopular: Boolean(project.isPopular)
        });
    };

    const cancelEditing = () => {
        setEditingId('');
        setEditForm(initialForm);
    };

    const handleSaveProject = async (projectId) => {
        setError('');
        setStatus('');
        const parsedEditTags = editForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean);

        if (!editForm.title || !editForm.image || !editForm.github || !editForm.desc || parsedEditTags.length === 0) {
            setError('Title, image, github, description and tags are required.');
            return;
        }

        try {
            setIsSavingId(projectId);
            await updateProject(projectId, {
                ...editForm,
                tags: parsedEditTags
            });
            setEditingId('');
            setEditForm(initialForm);
            setStatus('Project updated successfully.');
        } catch (updateError) {
            setError(updateError?.message || 'Could not update project right now.');
        } finally {
            setIsSavingId('');
        }
    };

    const handleImageUpload = async (event, mode) => {
        const input = event.target;
        const file = input.files && input.files[0];

        if (!file) {
            return;
        }

        setError('');
        setStatus('');

        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            input.value = '';
            return;
        }

        if (file.size > MAX_IMAGE_BYTES) {
            setError(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`);
            input.value = '';
            return;
        }

        if (!CLOUDINARY_READY) {
            setError('Image upload is not configured. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET.');
            input.value = '';
            return;
        }

        try {
            if (mode === 'edit') {
                setIsUploadingEditImage(true);
            } else {
                setIsUploadingCreateImage(true);
            }

            const imageUrl = await uploadImageToCloudinary(file);
            if (mode === 'edit') {
                setEditForm((prev) => ({ ...prev, image: imageUrl }));
            } else {
                setForm((prev) => ({ ...prev, image: imageUrl }));
            }
            setStatus('Image uploaded successfully.');
        } catch (uploadError) {
            setError(uploadError?.message || 'Could not upload image right now.');
        } finally {
            if (mode === 'edit') {
                setIsUploadingEditImage(false);
            } else {
                setIsUploadingCreateImage(false);
            }
            input.value = '';
        }
    };

    const handleProjectDragStart = (projectId, event) => {
        if (editingId) {
            return;
        }

        setDraggingId(projectId);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', projectId);
    };

    const handleProjectDragOver = (projectId, event) => {
        if (editingId) {
            return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        if (dropTargetId !== projectId) {
            setDropTargetId(projectId);
        }
    };

    const handleProjectDrop = async (projectId, event) => {
        if (editingId) {
            return;
        }

        event.preventDefault();
        const sourceProjectId = event.dataTransfer.getData('text/plain') || draggingId;
        setDropTargetId('');

        if (!sourceProjectId || sourceProjectId === projectId) {
            setDraggingId('');
            return;
        }

        setError('');
        setStatus('');

        try {
            await reorderProjects(sourceProjectId, projectId);
            setStatus('Project order updated.');
        } catch (reorderError) {
            setError(reorderError?.message || 'Could not reorder projects right now.');
        } finally {
            setDraggingId('');
        }
    };

    const handleProjectDragEnd = () => {
        setDraggingId('');
        setDropTargetId('');
    };

    const handleResumeFile = async (file) => {
        if (!file) {
            return;
        }

        setError('');
        setStatus('');

        const isPdfType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!isPdfType) {
            setError('Please upload a PDF file for resume.');
            return;
        }

        if (file.size > MAX_RESUME_BYTES) {
            setError(`Resume PDF must be smaller than ${MAX_RESUME_SIZE_MB}MB.`);
            return;
        }

        if (!SUPABASE_RESUME_READY) {
            setError('Supabase resume storage is not configured. Set REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY and REACT_APP_SUPABASE_RESUME_BUCKET.');
            return;
        }

        try {
            setIsUploadingResume(true);
            const resumeUrl = await uploadResumeToSupabase(file);
            await updateResume({
                url: resumeUrl,
                fileName: file.name || 'Resume.pdf'
            });
            setStatus('Resume updated successfully. Download CV is live now.');
        } catch (resumeError) {
            setError(resumeError?.message || 'Could not upload resume right now.');
        } finally {
            setIsUploadingResume(false);
            setIsResumeDragOver(false);
        }
    };

    const handleResumeInputChange = async (event) => {
        const input = event.target;
        const file = input.files && input.files[0];

        await handleResumeFile(file);
        input.value = '';
    };

    const handleResumeDragOver = (event) => {
        event.preventDefault();
        if (!isUploadingResume) {
            setIsResumeDragOver(true);
        }
    };

    const handleResumeDragLeave = (event) => {
        event.preventDefault();
        setIsResumeDragOver(false);
    };

    const handleResumeDrop = async (event) => {
        event.preventDefault();
        setIsResumeDragOver(false);
        if (isUploadingResume) {
            return;
        }

        const file = event.dataTransfer?.files?.[0];
        await handleResumeFile(file);
    };

    const handleAddExperience = async (event) => {
        event.preventDefault();
        setError('');
        setStatus('');

        if (!experienceForm.skill.trim()) {
            setError('Skill name is required.');
            return;
        }

        try {
            setIsExperienceSubmitting(true);
            await addExperienceItem(experienceForm);
            setExperienceForm((prev) => ({ ...prev, skill: '' }));
            setStatus('Experience skill added successfully.');
        } catch (experienceError) {
            setError(experienceError?.message || 'Could not add experience right now.');
        } finally {
            setIsExperienceSubmitting(false);
        }
    };

    const startEditingExperience = (item, category) => {
        setError('');
        setStatus('');
        setEditingExperienceId(item.id);
        setExperienceEditForm({
            category,
            skill: item.skill || '',
            level: item.level || 'Intermediate'
        });
    };

    const cancelEditingExperience = () => {
        setEditingExperienceId('');
        setExperienceEditForm(initialExperienceForm);
    };

    const handleSaveExperience = async (itemId) => {
        setError('');
        setStatus('');

        if (!experienceEditForm.skill.trim()) {
            setError('Skill name is required.');
            return;
        }

        try {
            setIsSavingExperienceId(itemId);
            await updateExperienceItem(itemId, experienceEditForm);
            setEditingExperienceId('');
            setExperienceEditForm(initialExperienceForm);
            setStatus('Experience skill updated successfully.');
        } catch (experienceError) {
            setError(experienceError?.message || 'Could not update experience right now.');
        } finally {
            setIsSavingExperienceId('');
        }
    };

    const handleDeleteExperience = async (itemId) => {
        setError('');
        setStatus('');

        try {
            setIsDeletingExperienceId(itemId);
            await removeExperienceItem(itemId);
            if (editingExperienceId === itemId) {
                cancelEditingExperience();
            }
            setStatus('Experience skill removed successfully.');
        } catch (experienceError) {
            setError(experienceError?.message || 'Could not remove experience right now.');
        } finally {
            setIsDeletingExperienceId('');
        }
    };

    const handleAddQualification = async (event) => {
        event.preventDefault();
        setError('');
        setStatus('');

        if (!qualificationForm.title.trim() || !qualificationForm.subtitle.trim() || !qualificationForm.period.trim()) {
            setError('Title, subtitle and period are required.');
            return;
        }

        try {
            setIsQualificationSubmitting(true);
            await addQualificationItem(qualificationForm);
            setQualificationForm((prev) => ({ ...prev, title: '', subtitle: '', period: '' }));
            setStatus('Qualification entry added successfully.');
        } catch (qualificationError) {
            setError(qualificationError?.message || 'Could not add qualification right now.');
        } finally {
            setIsQualificationSubmitting(false);
        }
    };

    const startEditingQualification = (item, category) => {
        setError('');
        setStatus('');
        setEditingQualificationId(item.id);
        setQualificationEditForm({
            category,
            title: item.title || '',
            subtitle: item.subtitle || '',
            period: item.period || ''
        });
    };

    const cancelEditingQualification = () => {
        setEditingQualificationId('');
        setQualificationEditForm(initialQualificationForm);
    };

    const handleSaveQualification = async (itemId) => {
        setError('');
        setStatus('');

        if (!qualificationEditForm.title.trim() || !qualificationEditForm.subtitle.trim() || !qualificationEditForm.period.trim()) {
            setError('Title, subtitle and period are required.');
            return;
        }

        try {
            setIsSavingQualificationId(itemId);
            await updateQualificationItem(itemId, qualificationEditForm);
            setEditingQualificationId('');
            setQualificationEditForm(initialQualificationForm);
            setStatus('Qualification entry updated successfully.');
        } catch (qualificationError) {
            setError(qualificationError?.message || 'Could not update qualification right now.');
        } finally {
            setIsSavingQualificationId('');
        }
    };

    const handleDeleteQualification = async (itemId) => {
        setError('');
        setStatus('');

        try {
            setIsDeletingQualificationId(itemId);
            await removeQualificationItem(itemId);
            if (editingQualificationId === itemId) {
                cancelEditingQualification();
            }
            setStatus('Qualification entry removed successfully.');
        } catch (qualificationError) {
            setError(qualificationError?.message || 'Could not remove qualification right now.');
        } finally {
            setIsDeletingQualificationId('');
        }
    };

    const renderImageField = (mode, value, setValue, isUploading) => (
        <div className='admin-image-field'>
            <input
                type='url'
                placeholder='Image URL'
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            <div className='admin-upload-row'>
                <label className={`admin-upload-btn ${!CLOUDINARY_READY ? 'is-disabled' : ''}`}>
                    <input
                        type='file'
                        accept='image/png,image/jpeg,image/webp,image/gif'
                        disabled={!CLOUDINARY_READY || isUploading}
                        onChange={(event) => handleImageUpload(event, mode)}
                    />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                </label>
                {value && (
                    <button type='button' className='admin-btn admin-btn-secondary' onClick={() => setValue('')}>
                        Clear Image
                    </button>
                )}
                <span className='admin-upload-note'>
                    {CLOUDINARY_READY
                        ? 'PNG/JPG/WebP/GIF up to 1.5MB.'
                        : 'Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET to enable uploads.'}
                </span>
            </div>
            {value && (
                <div className='admin-image-preview'>
                    <img src={value} alt='Project preview' loading='lazy' />
                </div>
            )}
        </div>
    );

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        setStatus('');

        try {
            setIsSubmitting(true);
            await loginAdmin({
                email: credentials.email,
                password: credentials.password
            });
            setCredentials((prev) => ({ ...prev, password: '' }));
            setStatus('Login successful.');
        } catch (loginError) {
            setError(loginError?.message || 'Invalid email or password.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        logoutAdmin();
        setStatus('Logged out successfully.');
        setError('');
        setCredentials((prev) => ({ ...prev, password: '' }));
    };

    const renderLoginForm = () => (
        <form className='admin-form admin-login-form' onSubmit={handleLogin}>
            <h2 className='admin-title'>Admin Login</h2>
            {!authState.isConfigured && (
                <p className='admin-info'>Set `REACT_APP_ADMIN_EMAIL` and `REACT_APP_ADMIN_PASSWORD_HASH` (SHA-256 hash or plain password) to enable login.</p>
            )}
            <input
                type='email'
                placeholder='Admin email'
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                required
            />
            <input
                type='password'
                placeholder='Password'
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                required
            />

            <button className='admin-btn admin-btn-primary' type='submit' disabled={isSubmitting || !authState.isConfigured}>
                {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
        </form>
    );

    const renderAdminContent = () => (
        <div className='admin-layout-sections'>
            <div className='admin-content-grid'>
                <form className='admin-form' onSubmit={handleAddProject}>
                    <h2 className='admin-title'>Add Project</h2>
                    <input type='text' placeholder='Project title' value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
                    {renderImageField('create', form.image, (image) => setForm((prev) => ({ ...prev, image })), isUploadingCreateImage)}
                    <input type='url' placeholder='GitHub URL' value={form.github} onChange={(event) => setForm((prev) => ({ ...prev, github: event.target.value }))} />
                    <input type='url' placeholder='Live demo URL (optional)' value={form.demo} onChange={(event) => setForm((prev) => ({ ...prev, demo: event.target.value }))} />
                    <input type='text' placeholder='Tags (comma separated)' value={form.tags} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} />
                    <textarea placeholder='Short description' value={form.desc} onChange={(event) => setForm((prev) => ({ ...prev, desc: event.target.value }))} />

                    <div className='admin-checkboxes'>
                        <label><input type='checkbox' checked={form.isNew} onChange={(event) => setForm((prev) => ({ ...prev, isNew: event.target.checked }))} /> New</label>
                        <label><input type='checkbox' checked={form.isFeatured} onChange={(event) => setForm((prev) => ({ ...prev, isFeatured: event.target.checked }))} /> Featured</label>
                        <label><input type='checkbox' checked={form.isPopular} onChange={(event) => setForm((prev) => ({ ...prev, isPopular: event.target.checked }))} /> Popular</label>
                    </div>

                    <button className='admin-btn admin-btn-primary' type='submit' disabled={isSubmitting || isUploadingCreateImage}>
                        {isSubmitting ? 'Adding...' : isUploadingCreateImage ? 'Uploading Image...' : 'Add Project'}
                    </button>
                </form>

                <section className='admin-projects'>
                    <h2 className='admin-title'>Projects ({projects.length})</h2>
                    <p className='admin-info'>Drag and drop projects to reorder how they appear in the portfolio.</p>
                    {isLoadingProjects ? (
                        <p className='admin-info'>Loading projects...</p>
                    ) : projects.length === 0 ? (
                        <p className='admin-info'>No projects yet. Add your first project using the form.</p>
                    ) : (
                        <ul>
                            {projects.map((project) => (
                                <li
                                    key={project.id}
                                    className={`admin-project-item ${editingId === project.id ? 'is-editing' : ''} ${draggingId === project.id ? 'is-dragging' : ''} ${dropTargetId === project.id ? 'is-drop-target' : ''}`}
                                    draggable={!editingId}
                                    onDragStart={(event) => handleProjectDragStart(project.id, event)}
                                    onDragOver={(event) => handleProjectDragOver(project.id, event)}
                                    onDrop={(event) => handleProjectDrop(project.id, event)}
                                    onDragEnd={handleProjectDragEnd}
                                >
                                    {editingId === project.id ? (
                                        <div className='admin-project-edit'>
                                            <input
                                                type='text'
                                                placeholder='Project title'
                                                value={editForm.title}
                                                onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
                                            />
                                            {renderImageField('edit', editForm.image, (image) => setEditForm((prev) => ({ ...prev, image })), isUploadingEditImage)}
                                            <input
                                                type='url'
                                                placeholder='GitHub URL'
                                                value={editForm.github}
                                                onChange={(event) => setEditForm((prev) => ({ ...prev, github: event.target.value }))}
                                            />
                                            <input
                                                type='url'
                                                placeholder='Live demo URL (optional)'
                                                value={editForm.demo}
                                                onChange={(event) => setEditForm((prev) => ({ ...prev, demo: event.target.value }))}
                                            />
                                            <input
                                                type='text'
                                                placeholder='Tags (comma separated)'
                                                value={editForm.tags}
                                                onChange={(event) => setEditForm((prev) => ({ ...prev, tags: event.target.value }))}
                                            />
                                            <textarea
                                                placeholder='Short description'
                                                value={editForm.desc}
                                                onChange={(event) => setEditForm((prev) => ({ ...prev, desc: event.target.value }))}
                                            />

                                            <div className='admin-checkboxes'>
                                                <label><input type='checkbox' checked={editForm.isNew} onChange={(event) => setEditForm((prev) => ({ ...prev, isNew: event.target.checked }))} /> New</label>
                                                <label><input type='checkbox' checked={editForm.isFeatured} onChange={(event) => setEditForm((prev) => ({ ...prev, isFeatured: event.target.checked }))} /> Featured</label>
                                                <label><input type='checkbox' checked={editForm.isPopular} onChange={(event) => setEditForm((prev) => ({ ...prev, isPopular: event.target.checked }))} /> Popular</label>
                                            </div>

                                            <div className='admin-project-actions'>
                                                <button
                                                    type='button'
                                                    className='admin-btn admin-btn-primary'
                                                    onClick={() => handleSaveProject(project.id)}
                                                    disabled={isSavingId === project.id || isUploadingEditImage}
                                                >
                                                    {isSavingId === project.id ? 'Saving...' : isUploadingEditImage ? 'Uploading Image...' : 'Save'}
                                                </button>
                                                <button
                                                    type='button'
                                                    className='admin-btn admin-btn-secondary'
                                                    onClick={cancelEditing}
                                                    disabled={isSavingId === project.id}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='admin-project-meta'>
                                                <p className='admin-project-drag-label'>Drag to reorder</p>
                                                <h3>{project.title}</h3>
                                                <p>{project.tags.join(', ')}</p>
                                            </div>
                                            <div className='admin-project-actions'>
                                                <button
                                                    type='button'
                                                    className='admin-btn admin-btn-secondary'
                                                    onClick={() => startEditing(project)}
                                                    disabled={isDeletingId === project.id}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type='button'
                                                    className='admin-btn admin-btn-danger'
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    disabled={isDeletingId === project.id}
                                                >
                                                    {isDeletingId === project.id ? 'Removing...' : 'Remove'}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <section className='admin-resume-panel'>
                <h2 className='admin-title'>Resume</h2>
                <p className='admin-info'>Drag and drop a PDF resume. It updates the `Download CV` button in real time.</p>
                {resume?.url && (
                    <a href={resume.url} target='_blank' rel='noreferrer' className='admin-resume-link'>
                        Current: {resume.fileName || 'Resume.pdf'}
                    </a>
                )}

                <div
                    className={`admin-resume-dropzone ${isResumeDragOver ? 'is-active' : ''} ${isUploadingResume ? 'is-uploading' : ''}`}
                    onDragOver={handleResumeDragOver}
                    onDragLeave={handleResumeDragLeave}
                    onDrop={handleResumeDrop}
                >
                    <p>{isUploadingResume ? 'Uploading resume to Supabase...' : 'Drop PDF here'}</p>
                    <span>or</span>
                    <label className={`admin-upload-btn ${!SUPABASE_RESUME_READY || isUploadingResume ? 'is-disabled' : ''}`}>
                        <input
                            type='file'
                            accept='application/pdf'
                            disabled={!SUPABASE_RESUME_READY || isUploadingResume}
                            onChange={handleResumeInputChange}
                        />
                        {isUploadingResume ? 'Uploading...' : 'Choose PDF'}
                    </label>
                    <small>
                        {SUPABASE_RESUME_READY
                            ? `Only PDF up to ${MAX_RESUME_SIZE_MB}MB.`
                            : 'Set REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY and REACT_APP_SUPABASE_RESUME_BUCKET to enable resume uploads.'}
                    </small>
                </div>
            </section>

            <section className='admin-experience-panel'>
                <h2 className='admin-title'>Experience Skills</h2>
                <p className='admin-info'>Add, edit, or remove skills. Changes reflect instantly in the Experience section.</p>

                <form className='admin-form admin-experience-form' onSubmit={handleAddExperience}>
                    <div className='admin-experience-form-row'>
                        <select
                            value={experienceForm.category}
                            onChange={(event) => setExperienceForm((prev) => ({ ...prev, category: event.target.value }))}
                        >
                            <option value='frontend'>Frontend</option>
                            <option value='backend'>Backend</option>
                        </select>
                        <input
                            type='text'
                            placeholder='Skill name'
                            value={experienceForm.skill}
                            onChange={(event) => setExperienceForm((prev) => ({ ...prev, skill: event.target.value }))}
                        />
                        <select
                            value={experienceForm.level}
                            onChange={(event) => setExperienceForm((prev) => ({ ...prev, level: event.target.value }))}
                        >
                            {experienceLevelOptions.map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    <button className='admin-btn admin-btn-primary' type='submit' disabled={isExperienceSubmitting}>
                        {isExperienceSubmitting ? 'Adding...' : 'Add Skill'}
                    </button>
                </form>

                {isExperienceLoading ? (
                    <p className='admin-info'>Loading experience skills...</p>
                ) : (
                    <div className='admin-experience-columns'>
                        {[
                            { key: 'frontend', label: 'Frontend' },
                            { key: 'backend', label: 'Backend' }
                        ].map(({ key, label }) => (
                            <div key={key} className='admin-experience-column'>
                                <h3>{label} ({experience[key].length})</h3>
                                {experience[key].length === 0 ? (
                                    <p className='admin-info'>No skills in this category.</p>
                                ) : (
                                    <ul className='admin-experience-list'>
                                        {experience[key].map((item) => (
                                            <li key={item.id} className='admin-experience-item'>
                                                {editingExperienceId === item.id ? (
                                                    <div className='admin-experience-edit'>
                                                        <div className='admin-experience-form-row'>
                                                            <select
                                                                value={experienceEditForm.category}
                                                                onChange={(event) => setExperienceEditForm((prev) => ({ ...prev, category: event.target.value }))}
                                                            >
                                                                <option value='frontend'>Frontend</option>
                                                                <option value='backend'>Backend</option>
                                                            </select>
                                                            <input
                                                                type='text'
                                                                value={experienceEditForm.skill}
                                                                onChange={(event) => setExperienceEditForm((prev) => ({ ...prev, skill: event.target.value }))}
                                                            />
                                                            <select
                                                                value={experienceEditForm.level}
                                                                onChange={(event) => setExperienceEditForm((prev) => ({ ...prev, level: event.target.value }))}
                                                            >
                                                                {experienceLevelOptions.map((level) => (
                                                                    <option key={level} value={level}>{level}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='admin-project-actions'>
                                                            <button
                                                                type='button'
                                                                className='admin-btn admin-btn-primary'
                                                                onClick={() => handleSaveExperience(item.id)}
                                                                disabled={isSavingExperienceId === item.id}
                                                            >
                                                                {isSavingExperienceId === item.id ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button
                                                                type='button'
                                                                className='admin-btn admin-btn-secondary'
                                                                onClick={cancelEditingExperience}
                                                                disabled={isSavingExperienceId === item.id}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='admin-experience-meta'>
                                                            <h4>{item.skill}</h4>
                                                            <p>{item.level}</p>
                                                        </div>
                                                        <div className='admin-project-actions'>
                                                            <button
                                                                type='button'
                                                                className='admin-btn admin-btn-secondary'
                                                                onClick={() => startEditingExperience(item, key)}
                                                                disabled={isDeletingExperienceId === item.id}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type='button'
                                                                className='admin-btn admin-btn-danger'
                                                                onClick={() => handleDeleteExperience(item.id)}
                                                                disabled={isDeletingExperienceId === item.id}
                                                            >
                                                                {isDeletingExperienceId === item.id ? 'Removing...' : 'Remove'}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className='admin-qualification-panel'>
                <h2 className='admin-title'>Qualification Timeline</h2>
                <p className='admin-info'>Manage education and experience timeline entries shown in the Qualification section.</p>

                <form className='admin-form admin-qualification-form' onSubmit={handleAddQualification}>
                    <div className='admin-qualification-form-row'>
                        <select
                            value={qualificationForm.category}
                            onChange={(event) => setQualificationForm((prev) => ({ ...prev, category: event.target.value }))}
                        >
                            <option value='education'>Education</option>
                            <option value='experience'>Experience</option>
                        </select>
                        <input
                            type='text'
                            placeholder='Title'
                            value={qualificationForm.title}
                            onChange={(event) => setQualificationForm((prev) => ({ ...prev, title: event.target.value }))}
                        />
                        <input
                            type='text'
                            placeholder='Subtitle'
                            value={qualificationForm.subtitle}
                            onChange={(event) => setQualificationForm((prev) => ({ ...prev, subtitle: event.target.value }))}
                        />
                        <input
                            type='text'
                            placeholder='Period (e.g. 2022 - 2026)'
                            value={qualificationForm.period}
                            onChange={(event) => setQualificationForm((prev) => ({ ...prev, period: event.target.value }))}
                        />
                    </div>
                    <button className='admin-btn admin-btn-primary' type='submit' disabled={isQualificationSubmitting}>
                        {isQualificationSubmitting ? 'Adding...' : 'Add Entry'}
                    </button>
                </form>

                {isQualificationLoading ? (
                    <p className='admin-info'>Loading qualification entries...</p>
                ) : (
                    <div className='admin-qualification-columns'>
                        {[
                            { key: 'education', label: 'Education' },
                            { key: 'experience', label: 'Experience' }
                        ].map(({ key, label }) => (
                            <div key={key} className='admin-qualification-column'>
                                <h3>{label} ({qualification[key].length})</h3>
                                {qualification[key].length === 0 ? (
                                    <p className='admin-info'>No entries in this category.</p>
                                ) : (
                                    <ul className='admin-qualification-list'>
                                        {qualification[key].map((item) => (
                                            <li key={item.id} className='admin-qualification-item'>
                                                {editingQualificationId === item.id ? (
                                                    <div className='admin-qualification-edit'>
                                                        <div className='admin-qualification-form-row'>
                                                            <select
                                                                value={qualificationEditForm.category}
                                                                onChange={(event) => setQualificationEditForm((prev) => ({ ...prev, category: event.target.value }))}
                                                            >
                                                                <option value='education'>Education</option>
                                                                <option value='experience'>Experience</option>
                                                            </select>
                                                            <input
                                                                type='text'
                                                                value={qualificationEditForm.title}
                                                                onChange={(event) => setQualificationEditForm((prev) => ({ ...prev, title: event.target.value }))}
                                                            />
                                                            <input
                                                                type='text'
                                                                value={qualificationEditForm.subtitle}
                                                                onChange={(event) => setQualificationEditForm((prev) => ({ ...prev, subtitle: event.target.value }))}
                                                            />
                                                            <input
                                                                type='text'
                                                                value={qualificationEditForm.period}
                                                                onChange={(event) => setQualificationEditForm((prev) => ({ ...prev, period: event.target.value }))}
                                                            />
                                                        </div>
                                                        <div className='admin-project-actions'>
                                                            <button
                                                                type='button'
                                                                className='admin-btn admin-btn-primary'
                                                                onClick={() => handleSaveQualification(item.id)}
                                                                disabled={isSavingQualificationId === item.id}
                                                            >
                                                                {isSavingQualificationId === item.id ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button
                                                                type='button'
                                                                className='admin-btn admin-btn-secondary'
                                                                onClick={cancelEditingQualification}
                                                                disabled={isSavingQualificationId === item.id}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='admin-qualification-meta'>
                                                            <h4>{item.title}</h4>
                                                            <p>{item.subtitle}</p>
                                                            <small>{item.period}</small>
                                                        </div>
                                                        <div className='admin-project-actions'>
                                                            <button
                                                                type='button'
                                                                className='admin-btn admin-btn-secondary'
                                                                onClick={() => startEditingQualification(item, key)}
                                                                disabled={isDeletingQualificationId === item.id}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type='button'
                                                                className='admin-btn admin-btn-danger'
                                                                onClick={() => handleDeleteQualification(item.id)}
                                                                disabled={isDeletingQualificationId === item.id}
                                                            >
                                                                {isDeletingQualificationId === item.id ? 'Removing...' : 'Remove'}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );

    return (
        <main className='admin-page'>
            <section className='container admin-shell'>
                <div className='admin-header'>
                    <h1 className='admin-page-title'>Admin Dashboard</h1>
                    {authState.isAuthenticated ? (
                        <button type='button' className='admin-btn admin-btn-secondary' onClick={handleLogout}>
                            Logout ({authState.email})
                        </button>
                    ) : (
                        <p className='admin-info'>Protected admin panel</p>
                    )}
                </div>

                {isAuthLoading
                    ? <p className='admin-info'>Loading auth...</p>
                    : (authState.isAuthenticated ? renderAdminContent() : renderLoginForm())}

                {error && <p className='admin-error'>{error}</p>}
                {status && <p className='admin-status'>{status}</p>}
            </section>
        </main>
    );
};

export default AdminDashboard;
