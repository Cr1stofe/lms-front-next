'use client';

import React, { useState, useEffect } from 'react';
import { useLMSStore } from '@/stores/useLMSStore';
import { lmsService } from '@/services/lmsService';
import { upsertCourseSchema } from '@/lib/schemas/lms';
import { slugify } from '@/lib/utils';
import { PlusCircle, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminCoursesPage() {
  const courses = useLMSStore((state) => state.courses);
  const fetchCourses = useLMSStore((state) => state.fetchCourses);

  const [selectedCourseIndex, setSelectedCourseIndex] = useState<string>('new');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessonsCount, setLessonsCount] = useState<number>(0);
  const [hours, setHours] = useState<number>(1);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'fail'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCourseIndex === 'new') {
      setSlug('');
      setTitle('');
      setDescription('');
      setLessonsCount(0);
      setHours(1);
    } else {
      const course = courses[Number(selectedCourseIndex)];
      if (course) {
        setSlug(course.slug || '');
        setTitle(course.title || '');
        setDescription(course.description || '');
        setLessonsCount(Number(course.lessons) || 0);
        setHours(Number(course.hours) || 1);
      }
    }
  }, [selectedCourseIndex, courses]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (selectedCourseIndex === 'new') {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const validation = upsertCourseSchema.safeParse({
      slug,
      title,
      description,
      lessons: lessonsCount,
      hours,
    });

    if (!validation.success) {
      setFeedback({ type: 'fail', text: validation.error.issues[0]?.message || 'Preencha os campos corretamente' });
      return;
    }

    setLoading(true);

    try {
      await lmsService.upsertCourse(validation.data);
      setFeedback({ type: 'ok', text: 'Curso salvo com sucesso!' });
      await fetchCourses();
    } catch (err: any) {
      setFeedback({ type: 'fail', text: err.message || 'Erro ao salvar curso' });
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
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Gerenciar Cursos</h1>
            <p style={{ fontSize: '0.95rem' }}>Crie novos cursos ou edite as informações de cursos existentes.</p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedCourseIndex('new')}
            className={`btn btn-sm ${selectedCourseIndex === 'new' ? 'btn-primary' : ''}`}
          >
            <PlusCircle size={16} />
            <span>Novo Curso</span>
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

        {/* Course selector dropdown */}
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label" htmlFor="course-select">
            Selecionar Curso para Edição
          </label>
          <select
            id="course-select"
            className="form-select"
            value={selectedCourseIndex}
            onChange={(e) => setSelectedCourseIndex(e.target.value)}
          >
            <option value="new">+ Criar Novo Curso</option>
            {courses.map((course, idx) => (
              <option key={course.id} value={idx}>
                {course.slug} - {course.title}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="course-slug">
                Slug
              </label>
              <input
                id="course-slug"
                type="text"
                className="form-input"
                placeholder="slug-do-curso"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="course-title">
                Título
              </label>
              <input
                id="course-title"
                type="text"
                className="form-input"
                placeholder="Título do Curso"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="course-desc">
              Descrição
            </label>
            <textarea
              id="course-desc"
              className="form-textarea"
              placeholder="Descrição do curso..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="course-lessons">
                Aulas
              </label>
              <input
                id="course-lessons"
                type="number"
                min="0"
                className="form-input"
                value={lessonsCount}
                onChange={(e) => setLessonsCount(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="course-hours">
                Horas
              </label>
              <input
                id="course-hours"
                type="number"
                min="1"
                className="form-input"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>{loading ? 'Salvando...' : 'Criar/Atualizar Curso'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
