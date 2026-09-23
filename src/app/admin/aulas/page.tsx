'use client';

import React, { useState, useEffect } from 'react';
import { lmsService } from '@/services/lmsService';
import { upsertLessonSchema } from '@/lib/schemas/lms';
import { slugify } from '@/lib/utils';
import { Lesson } from '@/lib/types';
import { Save, CheckCircle2, AlertCircle, PlusCircle, UploadCloud } from 'lucide-react';
import styles from '@/styles/admin.module.scss';

export default function AdminLessonsPage() {
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
    const list = await lmsService.getAdminLessons();
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
        const rawLesson = lesson as Lesson & { course_slug?: string };
        setCourseSlug(lesson.courseSlug || rawLesson.course_slug || '');
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
    setFeedback(null);

    let finalVideoPath = videoPath;

    if (selectedFile) {
      setLoading(true);
      try {
        finalVideoPath = await lmsService.uploadLessonVideo(selectedFile, free === 1);
        setVideoPath(finalVideoPath);
      } catch (err: unknown) {
        setLoading(false);
        const msg = err instanceof Error ? err.message : 'Erro no upload do vídeo';
        setFeedback({ type: 'fail', text: msg });
        return;
      }
    }

    const validation = upsertLessonSchema.safeParse({
      courseSlug,
      slug,
      title,
      description,
      seconds,
      order,
      free,
      video: finalVideoPath,
    });

    if (!validation.success) {
      setFeedback({ type: 'fail', text: validation.error.issues[0]?.message || 'Preencha os campos corretamente' });
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await lmsService.upsertLesson(validation.data);

      setFeedback({ type: 'ok', text: 'Aula cadastrada/atualizada com sucesso!' });
      await loadLessons();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar aula';
      setFeedback({ type: 'fail', text: msg });
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminCard}>
        <div className={styles.headerRow}>
          <div className={styles.titleWrapper}>
            <span className={styles.badgeIndigo}>
              Painel Administrativo
            </span>
            <h1>Gerenciar Aulas</h1>
            <p>Cadastre novas aulas em vídeo ou edite as aulas existentes dos cursos.</p>
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
            className={`${styles.feedbackMessage} ${
              feedback.type === 'ok' ? styles.feedbackSuccess : styles.feedbackError
            }`}
          >
            {feedback.type === 'ok' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.text}</span>
          </div>
        )}

        <div className={styles.selectHighlightCard}>
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel} htmlFor="lesson-select">
              <span>Selecionar Aula para Edição</span>
              <span className={styles.badgeIndigo}>
                {selectedLessonIndex === 'new' ? 'Modo Cadastro' : 'Modo Edição'}
              </span>
            </label>
            <select
              id="lesson-select"
              className={styles.formSelect}
              value={selectedLessonIndex}
              onChange={(e) => setSelectedLessonIndex(e.target.value)}
            >
              <option value="new">+ Cadastrar Nova Aula</option>
              {adminLessons.map((lesson, idx) => {
                const raw = lesson as Lesson & { course_slug?: string };
                return (
                  <option key={lesson.id || idx} value={idx}>
                    {lesson.courseSlug || raw.course_slug} - {lesson.slug} ({lesson.title})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-course">
                Slug do Curso Associado
              </label>
              <input
                id="lesson-course"
                type="text"
                className={styles.formInput}
                placeholder="ex: react-do-zero"
                value={courseSlug}
                onChange={(e) => setCourseSlug(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-slug">
                Slug da Aula (Identificador Único)
              </label>
              <input
                id="lesson-slug"
                type="text"
                className={styles.formInput}
                placeholder="ex: componentes-e-props"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-title">
                Título da Aula
              </label>
              <input
                id="lesson-title"
                type="text"
                className={styles.formInput}
                placeholder="ex: Componentes e Passagem de Props"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-order">
                Ordem / Posição no Curso
              </label>
              <input
                id="lesson-order"
                type="number"
                min="1"
                className={styles.formInput}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="lesson-desc">
              Descrição e Conteúdo da Aula
            </label>
            <textarea
              id="lesson-desc"
              className={styles.formTextarea}
              placeholder="Descreva os tópicos abordados nesta aula..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-seconds">
                Duração da Aula (Segundos)
              </label>
              <input
                id="lesson-seconds"
                type="number"
                min="0"
                className={styles.formInput}
                placeholder="ex: 480 (8 minutos)"
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-free">
                Disponibilidade (Gratuita para Visitantes)
              </label>
              <select
                id="lesson-free"
                className={styles.formSelect}
                value={free}
                onChange={(e) => setFree(Number(e.target.value))}
              >
                <option value={0}>🔒 0 - Restrita (Apenas para Alunos Cadastrados)</option>
                <option value={1}>🌐 1 - Gratuita (Aberta como Prévia/Demonstração)</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="lesson-video">
              Caminho ou URL do Vídeo
            </label>
            <input
              id="lesson-video"
              type="text"
              className={styles.formInput}
              placeholder="/files/public/... ou https://..."
              value={videoPath}
              onChange={(e) => setVideoPath(e.target.value)}
            />
          </div>

          <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
            <label className={styles.formLabel}>
              <span>Upload de Arquivo de Vídeo</span>
              {selectedFile && <span className={styles.badgeEmerald}>Arquivo Carregado</span>}
            </label>
            <div className={`${styles.uploadDropzone} ${selectedFile ? styles.hasFile : ''}`}>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
              />
              <UploadCloud size={28} className={styles.uploadIcon} />
              <div className={styles.uploadText}>
                {selectedFile ? `Arquivo: ${selectedFile.name}` : 'Clique ou arraste o arquivo de vídeo para fazer upload'}
              </div>
              <p className={styles.formHelper}>Suporta MP4, WebM ou outros formatos de vídeo compatíveis</p>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>{loading ? 'Salvando Aula...' : selectedLessonIndex === 'new' ? 'Cadastrar Aula' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

