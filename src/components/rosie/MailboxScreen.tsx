import React, { useEffect, useState } from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { MAILBOX_NOTES } from '../../lib/rosieData';
import type { MailboxNote } from '../../types/rosie';
import { PixelHeart, PixelStar } from './PixelSprites';

interface MailboxScreenProps {
  openedNotes: string[];
  onOpenNote: (noteId: string) => void;
  onBackToWorld: () => void;
}

export const MailboxScreen: React.FC<MailboxScreenProps> = ({
  openedNotes,
  onOpenNote,
  onBackToWorld,
}) => {
  const [activeNote, setActiveNote] = useState<MailboxNote | null>(null);
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    if (!activeNote) return;
    setTypedLength(0);
    const interval = window.setInterval(() => {
      setTypedLength((prev) => {
        if (prev >= activeNote.message.length) {
          window.clearInterval(interval);
          return prev;
        }
        return prev + 2;
      });
    }, 24);
    return () => window.clearInterval(interval);
  }, [activeNote]);

  const handleSelectEnvelope = (note: MailboxNote) => {
    chiptune.playSfx('flip');
    setActiveNote(note);
    onOpenNote(note.id);
  };

  return (
    <div className="min-h-screen w-full pixel-checker-pink py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="pixel-box p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-pixel-ui text-xs font-bold text-[#C94F86]">
              PINK RETRO MAILBOX · {openedNotes.length}/6 NOTES READ
            </p>
            <h1 className="mt-1 font-pixel-title text-base sm:text-xl text-[#392337]">
              A FEW LITTLE NOTES FOR YOU
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('nav');
              onBackToWorld();
            }}
            className="pixel-btn bg-[#FFDCC8] px-4 py-2.5 font-pixel-ui text-xs font-bold text-[#392337] whitespace-nowrap shrink-0"
          >
            &lt; BACK TO WORLD
          </button>
        </div>

        {/* 6 Interactive Envelopes */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MAILBOX_NOTES.map((note) => {
            const isRead = openedNotes.includes(note.id);
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => handleSelectEnvelope(note)}
                className="pixel-panel-pink p-5 text-left transition-transform hover:-translate-y-1.5 flex flex-col justify-between min-h-[195px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-pixel-title text-xs text-[#C94F86]">
                    NOTE {note.number}
                  </span>
                  <span className="font-pixel-ui text-[10px] font-bold bg-[#FFF5EE] border-2 border-[#392337] px-2 py-0.5 text-[#392337]">
                    {isRead ? 'OPENED ✓' : 'NEW ★'}
                  </span>
                </div>

                {/* Retro Pixel Envelope Artwork */}
                <div className="my-4 mx-auto w-28 h-20 bg-[#FFF5EE] border-4 border-[#392337] relative flex items-center justify-center shadow-[3px_3px_0px_#392337]">
                  <div
                    className="absolute inset-x-0 top-0 h-10 bg-[#FFC0D9] border-b-3 border-[#392337]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                  />
                  <PixelHeart className="w-6 h-6 relative z-10 mt-2" />
                </div>

                <p className="font-pixel-ui text-xs sm:text-sm font-bold text-[#392337] leading-snug">
                  {note.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opened Envelope Letter Modal */}
      {activeNote && (
        <div
          onClick={() => setActiveNote(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#241423]/80 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="pixel-box max-w-lg w-full p-5 sm:p-6 text-[#392337]"
          >
            <div className="flex items-center justify-between pb-3 border-b-4 border-[#392337]">
              <div className="flex items-center gap-2">
                <PixelStar className="w-5 h-5" color="#EC6FA9" />
                <span className="font-pixel-ui text-xs font-bold text-[#C94F86]">
                  {activeNote.greeting}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveNote(null)}
                className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-2.5 py-1 font-pixel-ui text-xs"
              >
                X
              </button>
            </div>

            <h2 className="mt-4 font-pixel-title text-xs sm:text-sm text-[#392337]">
              {activeNote.number}. {activeNote.label}
            </h2>

            <div className="mt-4 bg-[#FFD6E7] border-4 border-[#392337] p-4 min-h-[140px]">
              <p className="font-pixel-dialog text-2xl leading-snug text-[#392337]">
                {activeNote.message.slice(0, typedLength)}
                <span className="animate-blink inline-block w-2.5 h-5 bg-[#C94F86] ml-1 align-middle" />
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <PixelHeart className="w-4 h-4" />
                <span className="font-pixel-ui text-[10px] font-bold text-[#C94F86]">
                  FRIENDLY REMINDER
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  chiptune.playSfx('click');
                  setActiveNote(null);
                }}
                className="pixel-btn bg-[#FFDCC8] px-5 py-2 font-pixel-ui text-xs font-bold"
              >
                CLOSE NOTE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
