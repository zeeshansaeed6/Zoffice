import React from 'react'
import { LayoutPickerDialog } from './LayoutPickerDialog.jsx'
import { ThemeGalleryDialog } from './ThemeGalleryDialog.jsx'
import { ExportDialog } from './ExportDialog.jsx'
import { SlideShowView } from '../presenter/SlideShowView.jsx'
import { PresenterView } from '../presenter/PresenterView.jsx'

/**
 * SlideDialogsOverlay encapsulates modals and presentation modes for ZSlides.
 */
export function SlideDialogsOverlay({
  isLayoutPickerOpen,
  setIsLayoutPickerOpen,
  isThemeGalleryOpen,
  setIsThemeGalleryOpen,
  isExportDialogOpen,
  setIsExportDialogOpen,
  showMode,
  setShowMode,
  showStartIndex,
  deck,
  handleExportPptx,
  onApplyLayout,
  onApplyTheme,
}) {
  return (
    <>
      <LayoutPickerDialog
        isOpen={isLayoutPickerOpen}
        onClose={() => setIsLayoutPickerOpen(false)}
        onSelectLayout={onApplyLayout}
      />
      <ThemeGalleryDialog
        isOpen={isThemeGalleryOpen}
        currentThemeId={deck.themeId}
        onClose={() => setIsThemeGalleryOpen(false)}
        onSelectTheme={onApplyTheme}
      />
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        slides={deck.slides}
        onExportPptx={handleExportPptx}
      />
      {showMode === 'slideshow' && (
        <SlideShowView
          slides={deck.slides}
          initialIndex={showStartIndex}
          dimensions={deck.dimensions}
          onExit={() => setShowMode(null)}
        />
      )}
      {showMode === 'presenter' && (
        <PresenterView
          slides={deck.slides}
          initialIndex={showStartIndex}
          dimensions={deck.dimensions}
          onExit={() => setShowMode(null)}
        />
      )}
    </>
  )
}
