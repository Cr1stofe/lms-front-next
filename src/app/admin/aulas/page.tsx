'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { lmsService } from '@/services/lmsService';
import { useLMSStore } from '@/stores/useLMSStore';
import { upsertLessonSchema, UpsertLessonInput } from '@/lib/schemas/lms';
import { slugify } from '@/lib/utils';
import { Lesson } from '@/lib/types';
import { Save, PlusCircle, UploadCloud, Filter, Layers } from 'lucide-react';
import styles from '@/styles/admin.module.scss';

export default function AdminLessonsPage() {
  const courses = useLMSStore((state) => state.courses);
  const fetchCourses = useLMSStore((state) => state.fetchCourses);

  const [adminLessons, setAdminLessons] = useState<Lesson[]>([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('new');
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

  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        fetchCourses(),
        lmsService.getAdminLessons().then(setAdminLessons),
      ]);
    } catch {
      toast.error('Não foi possível carregar os dados.');
    }
  }, [fetchCourses]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredLessons = useMemo(() => {
    if (selectedCourseFilter === 'all') return adminLessons;
    return adminLessons.filter((lesson) => {
      const cSlug = lesson.courseSlug || (lesson as Lesson & { course_slug?: string }).course_slug;
      return cSlug === selectedCourseFilter;
    });
  }, [adminLessons, selectedCourseFilter]);

  useEffect(() => {
    setSelectedFile(null);
    if (selectedLessonId === 'new') {
      reset({
        courseSlug: selectedCourseFilter !== 'all' ? selectedCourseFilter : '',
        slug: '',
        title: '',
        description: '',
        seconds: 300,
        order: (filteredLessons.length || 0) + 1,
        free: 0,
        video: '',
      });
    } else {
      const lesson = adminLessons.find((l) => String(l.id) === selectedLessonId);
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
  }, [selectedLessonId, selectedCourseFilter, adminLessons, filteredLessons.length, reset]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val, { shouldValidate: true });
    if (selectedLessonId === 'new') {
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
        selectedLessonId === 'new'
          ? 'Aula cadastrada com sucesso!'
          : 'Aula atualizada com sucesso!'
      );
      const updatedLessons = await lmsService.getAdminLessons();
      setAdminLessons(updatedLessons);
      if (selectedLessonId === 'new') {
        setSelectedLessonId('new');
      }
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
              setSelectedLessonId('new');
              toast.info('Modo de cadastro de nova aula ativado');
            }}
            className={`btn btn-sm ${selectedLessonId === 'new' ? 'btn-primary' : ''}`}
          >
            <PlusCircle size={16} />
            <span>Nova Aula</span>
          </button>
        </div>

        <div className={styles.selectHighlightCard}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardHeaderTitle}>
              <Layers size={15} /> Seleção & Filtragem de Aulas
            </span>
            <span className={selectedLessonId === 'new' ? styles.badgeEmerald : styles.badgeIndigo}>
              {selectedLessonId === 'new' ? 'Modo Criação (Nova Aula)' : 'Modo Edição'}
            </span>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label className={styles.formLabel} htmlFor="filter-course-select">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Filter size={14} /> Filtrar por Curso
                </span>
              </label>
              <select
                id="filter-course-select"
                className={styles.formSelect}
                value={selectedCourseFilter}
                onChange={(e) => {
                  setSelectedCourseFilter(e.target.value);
                  setSelectedLessonId('new');
                }}
              >
                <option value="all">Todos os Cursos ({adminLessons.length} aulas)</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.slug}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label className={styles.formLabel} htmlFor="lesson-select">
                <span>Selecionar Aula para Edição</span>
              </label>
              <select
                id="lesson-select"
                className={styles.formSelect}
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
              >
                <option value="new">+ Cadastrar Nova Aula</option>
                {selectedCourseFilter === 'all' ? (
                  <>
                    {courses.map((course) => {
                      const courseLessons = adminLessons.filter((l) => {
                        const cSlug =
                          l.courseSlug ||
                          (l as Lesson & { course_slug?: string }).course_slug;
                        return cSlug === course.slug;
                      });

                      if (courseLessons.length === 0) return null;

                      return (
                        <optgroup key={course.id} label={course.title}>
                          {courseLessons.map((lesson) => (
                            <option key={lesson.id} value={String(lesson.id)}>
                              Aula {lesson.order}: {lesson.title}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                    {adminLessons.filter(
                      (l) =>
                        !courses.some(
                          (c) =>
                            c.slug ===
                            (l.courseSlug ||
                              (l as Lesson & { course_slug?: string }).course_slug)
                        )
                    ).length > 0 && (
                      <optgroup label="Outros / Sem Curso">
                        {adminLessons
                          .filter(
                            (l) =>
                              !courses.some(
                                (c) =>
                                  c.slug ===
                                  (l.courseSlug ||
                                    (l as Lesson & { course_slug?: string })
                                      .course_slug)
                              )
                          )
                          .map((lesson) => (
                            <option key={lesson.id} value={String(lesson.id)}>
                              Aula {lesson.order}: {lesson.title}
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </>
                ) : (
                  filteredLessons.map((lesson) => (
                    <option key={lesson.id} value={String(lesson.id)}>
                      Aula {lesson.order}: {lesson.title}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lesson-course">
                Curso Pai
              </label>
              <select
                id="lesson-course"
                className={`${styles.formSelect} ${errors.courseSlug ? styles.inputError : ''}`}
                {...register('courseSlug')}
              >
                <option value="">Selecione o curso pai...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.slug}>
                    {course.title}
                  </option>
                ))}
              </select>
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
              <span>{isBusy ? 'Salvando...' : selectedLessonId === 'new' ? 'Cadastrar Aula' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
