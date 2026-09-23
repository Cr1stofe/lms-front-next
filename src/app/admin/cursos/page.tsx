'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useLMSStore } from '@/stores/useLMSStore';
import { lmsService } from '@/services/lmsService';
import { upsertCourseSchema, UpsertCourseInput } from '@/lib/schemas/lms';
import { slugify } from '@/lib/utils';
import { PlusCircle, Save } from 'lucide-react';
import styles from '@/styles/admin.module.scss';

export default function AdminCoursesPage() {
  const courses = useLMSStore((state) => state.courses);
  const fetchCourses = useLMSStore((state) => state.fetchCourses);

  const [selectedCourseIndex, setSelectedCourseIndex] = useState<string>('new');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpsertCourseInput>({
    resolver: zodResolver(upsertCourseSchema),
    defaultValues: {
      slug: '',
      title: '',
      description: '',
      lessons: 0,
      hours: 1,
    },
  });

  useEffect(() => {
    if (selectedCourseIndex === 'new') {
      reset({
        slug: '',
        title: '',
        description: '',
        lessons: 0,
        hours: 1,
      });
    } else {
      const course = courses[Number(selectedCourseIndex)];
      if (course) {
        reset({
          slug: course.slug || '',
          title: course.title || '',
          description: course.description || '',
          lessons: Number(course.lessons) || 0,
          hours: Number(course.hours) || 1,
        });
      }
    }
  }, [selectedCourseIndex, courses, reset]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val, { shouldValidate: true });
    if (selectedCourseIndex === 'new') {
      setValue('slug', slugify(val), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: UpsertCourseInput) => {
    try {
      await lmsService.upsertCourse(data);
      toast.success(
        selectedCourseIndex === 'new'
          ? 'Curso cadastrado com sucesso!'
          : 'Curso atualizado com sucesso!'
      );
      await fetchCourses();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar curso';
      toast.error(msg);
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
            <h1>Gerenciar Cursos</h1>
            <p>Crie novos cursos ou edite as informações de cursos existentes.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedCourseIndex('new');
              toast.info('Modo de criação de novo curso ativado');
            }}
            className={`btn btn-sm ${selectedCourseIndex === 'new' ? 'btn-primary' : ''}`}
          >
            <PlusCircle size={16} />
            <span>Novo Curso</span>
          </button>
        </div>

        <div className={styles.selectHighlightCard}>
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel} htmlFor="course-select">
              <span>Selecionar Curso para Edição</span>
              <span className={styles.badgeIndigo}>
                {selectedCourseIndex === 'new' ? 'Modo Criação' : 'Modo Edição'}
              </span>
            </label>
            <select
              id="course-select"
              className={styles.formSelect}
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
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="course-slug">
                Slug do Curso (Identificador Único)
              </label>
              <input
                id="course-slug"
                type="text"
                className={`${styles.formInput} ${errors.slug ? styles.inputError : ''}`}
                placeholder="ex: react-do-zero"
                {...register('slug')}
              />
              {errors.slug && <span className={styles.formErrorMsg}>{errors.slug.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="course-title">
                Título do Curso
              </label>
              <input
                id="course-title"
                type="text"
                className={`${styles.formInput} ${errors.title ? styles.inputError : ''}`}
                placeholder="ex: Curso de React Avançado"
                {...register('title', {
                  onChange: handleTitleChange,
                })}
              />
              {errors.title && <span className={styles.formErrorMsg}>{errors.title.message}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="course-desc">
              Descrição
            </label>
            <textarea
              id="course-desc"
              className={`${styles.formTextarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Descreva o conteúdo, objetivos e metodologia do curso..."
              {...register('description')}
              rows={3}
            />
            {errors.description && <span className={styles.formErrorMsg}>{errors.description.message}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="course-lessons">
                Quantidade de Aulas
              </label>
              <input
                id="course-lessons"
                type="number"
                min="0"
                className={`${styles.formInput} ${errors.lessons ? styles.inputError : ''}`}
                {...register('lessons', { valueAsNumber: true })}
              />
              {errors.lessons && <span className={styles.formErrorMsg}>{errors.lessons.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="course-hours">
                Carga Horária (Horas)
              </label>
              <input
                id="course-hours"
                type="number"
                min="1"
                className={`${styles.formInput} ${errors.hours ? styles.inputError : ''}`}
                {...register('hours', { valueAsNumber: true })}
              />
              {errors.hours && <span className={styles.formErrorMsg}>{errors.hours.message}</span>}
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>{isSubmitting ? 'Salvando Curso...' : selectedCourseIndex === 'new' ? 'Cadastrar Curso' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
