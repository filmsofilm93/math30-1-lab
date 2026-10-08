import { useEffect, useState } from 'react';
import type { LessonVideo } from '../../content/videos';
import { card, muted } from '../styles';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** A teacher's video for the lesson. Loads only when tapped, so the lesson opens fast and works offline. */
export function VideoCard({ video }: { video: LessonVideo }) {
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  const start = video.start ? `&start=${video.start}` : '';
  const watch = `https://www.youtube.com/watch?v=${video.id}${video.start ? `&t=${video.start}s` : ''}`;

  return (
    <section className={`${card} flex flex-col gap-3 p-4`}>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg font-bold">Watch and work along</h2>
        <p className={`text-sm ${muted}`}>
          {video.course !== 'other' ? `${video.course} · ` : ''}
          {video.channel}
          {video.start ? ` · starts at ${fmt(video.start)}` : ''}
        </p>
      </div>
      {open && online ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&autoplay=1${start}`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          className="relative aspect-video w-full overflow-hidden rounded-lg bg-black text-left disabled:cursor-not-allowed"
          onClick={() => setOpen(true)}
          disabled={!online}
          aria-label={`Play video: ${video.title}`}
        >
          {online && <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-black/70 px-5 py-3 text-lg font-bold text-white">{online ? '▶ Play' : 'Videos need an internet connection'}</span>
          </span>
        </button>
      )}
      <p className="text-base leading-snug">{video.title}</p>
      <p className={`text-sm ${muted}`}>
        Pause the video and try each example yourself before the teacher solves it.{' '}
        <a className="font-bold text-accent hover:underline dark:text-accent-d" href={watch} target="_blank" rel="noreferrer">
          Open in YouTube
        </a>
      </p>
    </section>
  );
}
