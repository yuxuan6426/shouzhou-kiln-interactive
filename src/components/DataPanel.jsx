import React, { useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  BookOpen,
  Building2,
  Code2,
  MapPin,
  Ruler,
  ScrollText,
  Sparkles,
  Tag,
  X,
} from 'lucide-react'
import { isCeramicFieldVisible } from '../constants'
import GalleryDialog from './GalleryDialog'

function DetailSection({ icon: Icon, title, children, accent = 'bronze' }) {
  const accentClasses =
    accent === 'celadon'
      ? 'border-celadon-600/30 bg-celadon-950/20 shadow-[0_16px_40px_rgba(25,61,45,0.2)]'
      : 'border-bronze-700/35 bg-black/25 shadow-[0_16px_40px_rgba(0,0,0,0.24)]'

  return (
    <section className={`rounded-[24px] border px-4 py-3 backdrop-blur-md ${accentClasses}`}>
      <div className="mb-2.5 flex items-center gap-2 text-sm font-medium text-bronze-100">
        <Icon className="h-4 w-4 text-celadon-300" />
        {title}
      </div>
      {children}
    </section>
  )
}

function hasDisplayValue(value) {
  if (value == null) return false
  if (typeof value !== 'string') return true
  const normalized = value.trim()
  return normalized !== '' && !['不详', '未知', '未记录', '待生成'].includes(normalized)
}

function ValuePair({ label, value, compact = false }) {
  if (!hasDisplayValue(value)) {
    return null
  }

  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 py-1.5 last:border-b-0 last:pb-0 first:pt-0">
      <span className="shrink-0 text-sm text-bronze-500">{label}</span>
      <span
        title={typeof value === 'string' ? value : undefined}
        className={`record-value min-w-0 text-right text-sm text-bronze-100 ${compact ? 'record-path truncate text-xs text-bronze-300' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

// 内容优先缩放到一屏；达到下限后保留滚动，避免文字过小。
const MIN_FIT_ZOOM = 0.55

export default function DataPanel({ ceramic, viewMode, onClose, compact }) {
  const scrollRef = useRef(null)
  const gridRef = useRef(null)

  // 仅展台版需要将资料压到一屏，窄屏版使用自然字号滚动。
  useLayoutEffect(() => {
    if (compact) return

    const scrollEl = scrollRef.current
    const gridEl = gridRef.current
    let timer

    const fitZoom = () => {
      clearTimeout(timer)
      gridEl.style.zoom = ''
      if (scrollEl.scrollHeight <= scrollEl.clientHeight + 1) return

      const ratio = Math.max(MIN_FIT_ZOOM, (scrollEl.clientHeight / scrollEl.scrollHeight) * 0.99)
      gridEl.style.zoom = ratio < 0.995 ? String(ratio) : ''

      // 缩放后换行可能变化，最多校正四次。
      const correct = (remaining) => {
        const current = Number(gridEl.style.zoom) || 1
        if (remaining === 0 || current <= MIN_FIT_ZOOM || scrollEl.scrollHeight <= scrollEl.clientHeight + 1) {
          return
        }
        timer = setTimeout(() => {
          const next = current * (scrollEl.clientHeight / scrollEl.scrollHeight) * 0.99
          gridEl.style.zoom = String(Math.max(MIN_FIT_ZOOM, next))
          correct(remaining - 1)
        }, 60)
      }

      correct(4)
    }

    fitZoom()
    window.addEventListener('resize', fitZoom)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', fitZoom)
      gridEl.style.zoom = ''
    }
  }, [ceramic.id, compact])

  const showDescription = isCeramicFieldVisible(ceramic, 'description') && Boolean(ceramic.description)
  const showTags = isCeramicFieldVisible(ceramic, 'highlightTags') && ceramic.highlightTags?.length > 0
  const showDimensions =
    isCeramicFieldVisible(ceramic, 'dimensions') &&
    ['mouthDiameter', 'baseDiameter', 'height'].some(
      (field) => typeof ceramic.dimensions?.[field] === 'number' && ceramic.dimensions[field] > 0
    )
  const showExcavation =
    isCeramicFieldVisible(ceramic, 'excavation') &&
    Object.values(ceramic.excavation || {}).some(hasDisplayValue)
  const showCollection =
    isCeramicFieldVisible(ceramic, 'collection') &&
    Object.values(ceramic.collection || {}).some(hasDisplayValue)
  const showTechnicalFeatures =
    isCeramicFieldVisible(ceramic, 'technicalFeatures') && ceramic.technicalFeatures?.length > 0
  const showHistoricalSignificance =
    isCeramicFieldVisible(ceramic, 'historicalSignificance') && Boolean(ceramic.historicalSignificance)
  const usesPillowDimensions = ceramic.name.includes('枕')

  const summary = (
    <div className="mt-3 flex flex-wrap items-end justify-between gap-3 rounded-[20px] border border-bronze-700/30 bg-white/5 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.24em] text-bronze-500">
          {ceramic.archiveId || ceramic.id}
        </p>
        <h4 className="mt-1 text-lg font-medium text-bronze-100">{ceramic.name}</h4>
        {ceramic.nameEn && <p className="mt-1 text-sm text-bronze-400">{ceramic.nameEn}</p>}
      </div>
      {showTags && (
        <div className="flex flex-wrap gap-2">
          {ceramic.highlightTags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-celadon-600/30 bg-celadon-500/10 px-3 py-1 text-xs text-celadon-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <GalleryDialog
      className={`overlay-fade fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-xs ${
        compact ? 'compact-record compact-record-padding' : 'p-2 sm:p-3'
      }`}
      onClose={onClose}
      labelledBy="data-panel-title"
    >
      <div
        className={`sheet-pop flex w-full flex-col overflow-hidden border border-bronze-700/35 bg-[linear-gradient(180deg,rgba(12,11,10,0.97)_0%,rgba(17,15,13,0.95)_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl ${
          compact ? 'h-full max-w-3xl rounded-[20px]' : 'max-h-[97dvh] max-w-6xl rounded-[28px]'
        }`}
      >
        <div className={`shrink-0 border-b border-bronze-700/25 ${compact ? 'px-4 py-2' : 'px-5 py-3 sm:px-7'}`}>
          <div className={`flex justify-between gap-3 ${compact ? 'items-center' : 'items-start'}`}>
            <div className="min-w-0">
              {!compact && <p className="text-xs uppercase tracking-[0.3em] text-bronze-500">Curatorial Panel</p>}
              <h3 id="data-panel-title" className="mt-1 text-xl font-semibold text-bronze-50">文物档案摘要</h3>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!compact && (
                <span className="rounded-full border border-celadon-600/35 bg-celadon-500/10 px-3 py-1 text-xs text-celadon-200">
                  {viewMode === 'asset' ? 'Digital' : 'Archive'}
                </span>
              )}
              <button
                data-dialog-close
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-bronze-600/30 bg-bronze-900/20 p-2 text-bronze-300 transition active:scale-95 hover:border-bronze-400/50 hover:bg-bronze-700/30 hover:text-bronze-100"
                aria-label="关闭资料弹窗"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {!compact && summary}
        </div>

        <div
          ref={scrollRef}
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${compact ? 'px-4 pb-4' : 'px-5 py-2 sm:px-7'}`}
          tabIndex={0}
          role="region"
          aria-label="文物档案正文"
        >
          {compact && summary}
          <div
            ref={gridRef}
            className={`grid grid-cols-1 items-start gap-3 ${compact ? 'mt-3' : 'lg:grid-cols-2 xl:grid-cols-3'}`}
          >
            <div className="space-y-3">
              {(showDescription || showTags) && (
                <DetailSection icon={Sparkles} title="展签说明" accent="celadon">
                  {showDescription && <p className="text-sm leading-6 text-bronze-200">{ceramic.description}</p>}
                  {showTags && (
                    <div className={`${showDescription ? 'mt-2.5 ' : ''}flex flex-wrap gap-2`}>
                      {ceramic.highlightTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-celadon-600/30 bg-celadon-500/10 px-3 py-1 text-xs text-celadon-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </DetailSection>
              )}

              {showDimensions && <DetailSection icon={Ruler} title="尺寸数据">
                <ValuePair
                  label={usesPillowDimensions ? '枕面长' : '口径'}
                  value={
                    ceramic.dimensions?.mouthDiameter > 0
                      ? `${ceramic.dimensions.mouthDiameter} ${ceramic.dimensions.unit || ''}`
                      : ''
                  }
                />
                <ValuePair
                  label={usesPillowDimensions ? '枕面宽' : '底径'}
                  value={
                    ceramic.dimensions?.baseDiameter > 0
                      ? `${ceramic.dimensions.baseDiameter} ${ceramic.dimensions.unit || ''}`
                      : ''
                  }
                />
                <ValuePair
                  label="高度"
                  value={
                    ceramic.dimensions?.height > 0
                      ? `${ceramic.dimensions.height} ${ceramic.dimensions.unit || ''}`
                      : ''
                  }
                />
              </DetailSection>}

              {showExcavation && <DetailSection icon={MapPin} title="出土与流传">
                <ValuePair label="地点" value={ceramic.excavation?.location} />
                <ValuePair label="方式" value={ceramic.excavation?.method} />
                <ValuePair label="捐赠人" value={ceramic.excavation?.donor} />
                <ValuePair label="时间" value={ceramic.excavation?.date} />
              </DetailSection>}
            </div>

            <div className="space-y-3">
              {showCollection && <DetailSection icon={Building2} title="馆藏信息">
                <ValuePair label="馆藏单位" value={ceramic.collection?.institution} />
                <ValuePair label="状态" value={ceramic.collection?.status} />
              </DetailSection>}

              {showTechnicalFeatures && <DetailSection icon={Code2} title="工艺特征">
                <ul className="space-y-2">
                  {ceramic.technicalFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-5 text-bronze-200">
                      <span className="mt-1 h-2 w-2 rounded-full bg-celadon-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </DetailSection>}
            </div>

            <div className="space-y-3">
              {showHistoricalSignificance && <DetailSection icon={BookOpen} title="史学价值" accent="celadon">
                <p className="text-sm leading-6 text-bronze-200">{ceramic.historicalSignificance}</p>
              </DetailSection>}

              <DetailSection icon={ScrollText} title="资源引用">
                <ValuePair label="原始图" value={ceramic.imageUrl} compact />
                <ValuePair label="数字资产图" value={ceramic.processedImageUrl} compact />
                <ValuePair label="处理链路" value={ceramic.imageProcessedBy} compact />
              </DetailSection>

              <DetailSection icon={Tag} title="系统标识">
                <ValuePair label="App ID" value={ceramic.id} />
                <ValuePair label="Archive ID" value={ceramic.archiveId} />
                <ValuePair label="Name EN" value={ceramic.nameEn} />
              </DetailSection>
            </div>
          </div>
        </div>
      </div>
    </GalleryDialog>
  )
}

DataPanel.propTypes = {
  ceramic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nameEn: PropTypes.string,
    archiveId: PropTypes.string,
    description: PropTypes.string.isRequired,
    highlightTags: PropTypes.arrayOf(PropTypes.string),
    dimensions: PropTypes.shape({
      mouthDiameter: PropTypes.number,
      baseDiameter: PropTypes.number,
      height: PropTypes.number,
      unit: PropTypes.string,
    }),
    excavation: PropTypes.shape({
      location: PropTypes.string,
      method: PropTypes.string,
      donor: PropTypes.string,
      date: PropTypes.string,
    }),
    collection: PropTypes.shape({
      institution: PropTypes.string,
      status: PropTypes.string,
    }),
    technicalFeatures: PropTypes.arrayOf(PropTypes.string),
    glaze: PropTypes.string,
    assetSlug: PropTypes.string,
    historicalSignificance: PropTypes.string,
    imageUrl: PropTypes.string,
    processedImageUrl: PropTypes.string,
    imageProcessedBy: PropTypes.string,
    hiddenFields: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  viewMode: PropTypes.oneOf(['asset', 'archive']).isRequired,
  compact: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

ValuePair.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  compact: PropTypes.bool,
}
