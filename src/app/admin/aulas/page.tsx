'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { lmsService } from '@/services/lmsService';
import { upsertLessonSchema, UpsertLessonInput } from '@/lib/schemas/lms';
import { slugify } from '@/lib/utils';
import { Lesson } from '@/lib/types';
import { Save, PlusCircle, UploadCloud } from 'lucide-react';
import styles from '@/styles/admin.module.scss';

export default function AdminLessonsPage() {
  const [adminLessons, setAdminLessons] = useState<Lesson[]>([]);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<string>('new');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpsertLessonInput>({
    resolver: zodResolver(upsertLessonSchema),
    defaultValues: {
      courseSlug: '',
      slug: '',
      title: '',
      description: '',
      seconds: 300,
      order: 1,
      free: 0,
      video: '',
    },
  });

  const loadLessons = async () => {
    try {
      const list = await lmsService.getAdminLessons();
      setAdminLessons(list);
    } catch {
      toast.error('Não foi possível carregar a lista de aulas.');
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    setSelectedFile(null);
    if (selectedLessonIndex === 'new') {
      reset({
        courseSlug: '',
        slug: '',
        title: '',
        description: '',
        seconds: 300,
        order: 1,
        free: 0,
        video: '',
      });
    } else {
      const lesson = adminLessons[Number(selectedLessonIndex)];
      if (lesson) {
        const rawLesson = lesson as Lesson & { course_slug?: string };
        reset({
          courseSlug: lesson.courseSlug || rawLesson.course_slug || '',
          slug: lesson.slug || '',
          title: lesson.title || '',
          description: lesson.description || '',
          seconds: Number(lesson.seconds) || 0,
          order: Number(lesson.order) || 1,
          free: lesson.free === true || lesson.free === 1 ? 1 : 0,
          video: lesson.video || '',
        });
      }
    }
  }, [selectedLessonIndex, adminLessons, reset]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val, { shouldValidate: true });
    if (selectedLessonIndex === 'new') {
      setValue('slug', slugify(val), { shouldValidate: true });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setValue('video', `upload:${file.name}`, { shouldValidate: true });
      toast.info(`Arquivo "${file.name}" selecionado para upload.`);
    }
  };

  const onSubmit = async (data: UpsertLessonInput) => {
    let finalVideo = data.video;

    if (selectedFile) {
      setUploading(true);
      const uploadToastId = toast.loading('Enviando arquivo de vídeo...');
      try {
        finalVideo = await lmsService.uploadLessonVideo(selectedFile, data.free === 1);
        setValue('video', finalVideo);
        toast.success('Upload do vídeo concluído com sucesso!', { id: uploadToastId });
      } catch (err: unknown) {
        setUploading(false);
        const msg = err instanceof Error ? err.message : 'Erro no upload do vídeo';
        toast.error(msg, { id: uploadToastId });
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      await lmsService.upsertLesson({
        ...data,
        video: finalVideo,
      });
      toast.success(
        selectedLessonIndex === 'new'
          ? 'Aula cadastrada com sucesso!'
          : 'Aula atualizada com sucesso!'
      );
      await loadLessons();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar aula';
      toast.error(msg);
    }
  };

  const isBusy = isSubmitting || uploading;

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
            onClick={() => {
              setSelectedLessonIndex('new');
              toast.info('Modo de cadastro de nova aula ativado');
            }}
            className={`btn btn-sm ${selectedLessonIndex === 'new' ? 'btn-primary' : ''}`}
          >
            <PlusCircle size={16} />
            <span>Nova Aula</span>
          </button>
        </div>

        <div className={styles.selectHighlightCard}>
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel} htmlFor="lesson-select">
              <span>Selecionar Aula para Edição</span>
              <span className={styles.badgeIndigo}>
                {selectedLessonIndex === 'new' ? 'Modo Criação' : 'Modo Edição'}
              </span>
            </label>
            <select
              id="lesson-select"
              className={styles.formSelect}
              value={selectedLessonIndex}
              onChange={(e) => setSelectedLessonIndex(e.target.value)}
            >
              <option value="new">+ Cadastrar Nova Aula</option>
              {adminLessons.map((lesson, idx) => (
                <option key={lesson.id || idx} value={idx}>
                  {lesson.courseSlug || (lesson as Lesson & { course_slug?: string }).course_slug} - {lesson.slug}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-course">
                Curso Pai (Course Slug)
              </label>
              <input
                id="lesson-course"
                type="text"
                className={`${styles.formInput} ${errors.courseSlug ? styles.inputError : ''}`}
                placeholder="slug-do-curso"
                {...register('courseSlug')}
              />
              {errors.courseSlug && <span className={styles.formErrorMsg}>{errors.courseSlug.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-slug">
                Slug da Aula
              </label>
              <input
                id="lesson-slug"
                type="text"
                className={`${styles.formInput} ${errors.slug ? styles.inputError : ''}`}
                placeholder="slug-da-aula"
                {...register('slug')}
              />
              {errors.slug && <span className={styles.formErrorMsg}>{errors.slug.message}</span>}
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
                className={`${styles.formInput} ${errors.title ? styles.inputError : ''}`}
                placeholder="Título da Aula"
                {...register('title', {
                  onChange: handleTitleChange,
                })}
              />
              {errors.title && <span className={styles.formErrorMsg}>{errors.title.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-order">
                Ordem da Aula
              </label>
              <input
                id="lesson-order"
                type="number"
                min="1"
                className={`${styles.formInput} ${errors.order ? styles.inputError : ''}`}
                {...register('order', { valueAsNumber: true })}
              />
              {errors.order && <span className={styles.formErrorMsg}>{errors.order.message}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="lesson-desc">
              Descrição
            </label>
            <textarea
              id="lesson-desc"
              className={`${styles.formTextarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Descrição detalhada da aula..."
              {...register('description')}
              rows={3}
            />
            {errors.description && <span className={styles.formErrorMsg}>{errors.description.message}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-seconds">
                Duração (Segundos)
              </label>
              <input
                id="lesson-seconds"
                type="number"
                min="1"
                className={`${styles.formInput} ${errors.seconds ? styles.inputError : ''}`}
                {...register('seconds', { valueAsNumber: true })}
              />
              {errors.seconds && <span className={styles.formErrorMsg}>{errors.seconds.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-free">
                Gratuita (Acesso Livre)
              </label>
              <select
                id="lesson-free"
                className={styles.formSelect}
                {...register('free', { valueAsNumber: true })}
              >
                <option value={0}>0 - Não (Requer Login)</option>
                <option value={1}>1 - Sim (Aberta/Free)</option>
              </select>
              {errors.free && <span className={styles.formErrorMsg}>{errors.free.message}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="lesson-video">
              Caminho do Vídeo (URL ou Path)
            </label>
            <input
              id="lesson-video"
              type="text"
              className={`${styles.formInput} ${errors.video ? styles.inputError : ''}`}
              placeholder="/files/public/... ou https://..."
              {...register('video')}
            />
            {errors.video && <span className={styles.formErrorMsg}>{errors.video.message}</span>}
          </div>

          <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
            <label className={styles.formLabel}>Arquivo de Vídeo (Upload)</label>
            <div
              className={`${styles.uploadDropzone} ${selectedFile ? styles.hasFile : ''}`}
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
              />
              <UploadCloud size={24} className={styles.uploadIcon} />
              <div className={styles.uploadText}>
                {selectedFile ? `Arquivo selecionado: ${selectedFile.name}` : 'Selecionar arquivo de vídeo para envio'}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={isBusy} className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>{isBusy ? 'Salvando...' : 'Criar/Atualizar Aula'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
