import React from 'react'
import PropTypes from 'prop-types'
import { X } from 'lucide-react'
import GalleryDialog from './GalleryDialog'
import ImageWithFallback from './ImageWithFallback'

export default function ArchiveReader({ ceramic, onClose, compact }) {
  return (
    <GalleryDialog
      className="overlay-fade fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden overscroll-contain bg-black select-none"
      label={`${ceramic.name}档案全屏视图`}
      onClose={onClose}
    >
      <button
        data-dialog-close
        type="button"
        onClick={onClose}
        className={`fixed z-[110] flex items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/20 active:scale-[0.95] ${
          compact
            ? 'right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] size-12 bg-black/70'
            : 'right-8 top-8 min-h-[64px] min-w-[64px] bg-white/10'
        }`}
        aria-label="关闭全屏视图"
      >
        <X size={compact ? 24 : 32} strokeWidth={2} />
      </button>

      <div className={`flex min-h-full w-full items-start justify-center ${
        compact ? 'compact-archive-padding' : 'py-16 md:py-24'
      }`}>
        <div className="sheet-pop relative min-w-0 select-none">
          <ImageWithFallback
            key={ceramic.id}
            src={ceramic.imageUrl}
            alt={`${ceramic.name} 档案扫描件 - 全屏检阅`}
            className={`h-auto object-contain drop-shadow-2xl select-none touch-pan-y ${
              compact ? 'w-full' : 'w-[85vw] max-w-4xl lg:max-w-5xl'
            }`}
            style={{ filter: 'contrast(1.02) brightness(0.98)' }}
          />
        </div>
      </div>

      {!compact && (
        <div className="hint-rise pointer-events-none fixed bottom-10 left-1/2 z-[110]">
          <div className="capsule-bob flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm text-white/90 backdrop-blur-md">
            <span className="text-lg">↕</span>
            <span>触控上下滑动以阅览全卷</span>
          </div>
        </div>
      )}
    </GalleryDialog>
  )
}

ArchiveReader.propTypes = {
  ceramic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  compact: PropTypes.bool.isRequired,
}
