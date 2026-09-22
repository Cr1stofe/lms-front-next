'use client';

import React, { useState, useEffect } from 'react';
import { useLMSStore } from '@/stores/useLMSStore';
import { slugify } from '@/lib/utils';
import { Lesson } from '@/lib/types';
import { Video, Save, CheckCircle2, AlertCircle, PlusCircle, UploadCloud } from 'lucide-react';

export default function AdminLessonsPage() {
  const getAdminLessons = useLMSStore((state) => state.getAdminLessons);
  const upsertLesson = useLMSStore((state) => state.upsertLesson);
  const uploadLessonVideo = useLMSStore((state) => state.uploadLessonVideo);

  const [adminLessons, setAdminLessons] = useState<Lesson[]>([]);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<string>('new');
  const [courseSlug, setCourseSlug] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seconds, setSeconds] = useState<number>(300);
  const [order, setOrder] = useState<number>(1);
  const [free, setFree] = useState<number>(0);
  const [videoPath, setVideoPath] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'fail'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadLessons = async () => {
    const list = await getAdminLessons();
    setAdminLessons(list);
  };

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    if (selectedLessonIndex === 'new') {
      setCourseSlug('');
      setSlug('');
      setTitle('');
      setDescription('');
      setSeconds(300);
      setOrder(1);
      setFree(0);
      setVideoPath('');
      setSelectedFile(null);
    } else {
      const lesson = adminLessons[Number(selectedLessonIndex)];
      if (lesson) {
        setCourseSlug(lesson.courseSlug || (lesson as any).course_slug || '');
        setSlug(lesson.slug || '');
        setTitle(lesson.title || '');
        setDescription(lesson.description || '');
        setSeconds(Number(lesson.seconds) || 0);
        setOrder(Number(lesson.order) || 1);
        setFree(lesson.free === true || lesson.free === 1 ? 1 : 0);
        setVideoPath(lesson.video || '');
        setSelectedFile(null);
      }
    }
  }, [selectedLessonIndex, adminLessons]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (selectedLessonIndex === 'new') {
      setSlug(slugify(val));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !courseSlug) return;
    setLoading(true);
    setFeedback(null);

    try {
      let finalVideoPath = videoPath;

      if (selectedFile) {
        finalVideoPath = await uploadLessonVideo(selectedFile, free === 1);
        setVideoPath(finalVideoPath);
      }

      await upsertLesson({
        courseSlug,
        slug,
        title,
        description,
        seconds: Number(seconds),
        order: Number(order),
        free: Number(free),
        video: finalVideoPath,
      });

      setFeedback({ type: 'ok', text: 'Aula cadastrada/atualizada com sucesso!' });
      await loadLessons();
    } catch (err: any) {
      setFeedback({ type: 'fail', text: err.message || 'Erro ao salvar aula' });
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
              Painel Administrativo
            </span>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Gerenciar Aulas</h1>
            <p style={{ fontSize: '0.95rem' }}>Cadastre novas aulas em vídeo ou edite as aulas existentes dos cursos.</p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedLessonIndex('new')}
            className={`btn btn-sm ${selectedLessonIndex === 'new' ? 'btn-primary' : ''}`}
          >
            <PlusCircle size={16} />
            <span>Nova Aula</span>
          </button>
        </div>

        {feedback && (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: feedback.type === 'ok' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${feedback.type === 'ok' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              borderRadius: 'var(--radius-md)',
              color: feedback.type === 'ok' ? '#34d399' : '#fca5a5',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: '1.5rem',
            }}
          >
            {feedback.type === 'ok' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Lesson selector dropdown */}
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label" htmlFor="lesson-select">
            Selecionar Aula para Edição
          </label>
          <select
            id="lesson-select"
            className="form-select"
            value={selectedLessonIndex}
            onChange={(e) => setSelectedLessonIndex(e.target.value)}
          >
            <option value="new">+ Cadastrar Nova Aula</option>
            {adminLessons.map((lesson, idx) => (
              <option key={lesson.id || idx} value={idx}>
                {lesson.courseSlug || (lesson as any).course_slug} - {lesson.slug}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="lesson-course">
                Curso (Course Slug)
              </label>
              <input
                id="lesson-course"
                type="text"
                className="form-input"
                placeholder="slug-do-curso"
                value={courseSlug}
                onChange={(e) => setCourseSlug(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lesson-slug">
                Slug da Aula
              </label>
              <input
                id="lesson-slug"
                type="text"
                className="form-input"
                placeholder="slug-da-aula"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="lesson-title">
                Título
              </label>
              <input
                id="lesson-title"
                type="text"
                className="form-input"
                placeholder="Título da Aula"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lesson-order">
                Ordem
              </label>
              <input
                id="lesson-order"
                type="number"
                min="1"
                className="form-input"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lesson-desc">
              Descrição
            </label>
            <textarea
              id="lesson-desc"
              className="form-textarea"
              placeholder="Descrição da aula..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="lesson-seconds">
                Segundos
              </label>
              <input
                id="lesson-seconds"
                type="number"
                min="0"
                className="form-input"
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lesson-free">
                Gratuita
              </label>
              <select
                id="lesson-free"
                className="form-select"
                value={free}
                onChange={(e) => setFree(Number(e.target.value))}
              >
                <option value={0}>0 - Não</option>
                <option value={1}>1 - Sim</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lesson-video">
              Vídeo Path
            </label>
            <input
              id="lesson-video"
              type="text"
              className="form-input"
              placeholder="/files/public/... ou https://..."
              value={videoPath}
              onChange={(e) => setVideoPath(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Arquivo de Vídeo (Upload)</label>
            <div
              style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
              />
              <UploadCloud size={24} style={{ color: '#818cf8', margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.9rem', color: '#ffffff' }}>
                {selectedFile ? `Arquivo selecionado: ${selectedFile.name}` : 'Selecionar arquivo de vídeo'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>{loading ? 'Salvando...' : 'Criar/Atualizar Aula'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
