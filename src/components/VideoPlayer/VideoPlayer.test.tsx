import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VideoPlayer from './VideoPlayer';

describe('component: VideoPlayer', () => {
  it('should render HTML5 video player element when a valid source is provided', () => {
    const { container } = render(
      <VideoPlayer src="/api/files/lessons/intro.mp4" title="Lesson 1: Introduction" />
    );

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/api/files/lessons/intro.mp4');
    expect(video).toHaveAttribute('controls');
  });

  it('should render empty video fallback when src is empty or null', () => {
    render(<VideoPlayer src="" title="Lesson without File" />);

    expect(screen.getByText('Lesson without File')).toBeInTheDocument();
    expect(
      screen.getByText('Nenhum arquivo de vídeo associado a esta aula.')
    ).toBeInTheDocument();
  });

  it('should display error message when video element triggers onError event', () => {
    const { container } = render(
      <VideoPlayer src="/api/files/broken-file.mp4" title="Broken Lesson" />
    );

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();

    if (video) {
      fireEvent.error(video);
    }

    expect(
      screen.getByText(
        'Não foi possível carregar o vídeo. Verifique se o arquivo está disponível e se você possui acesso.'
      )
    ).toBeInTheDocument();
  });
});
