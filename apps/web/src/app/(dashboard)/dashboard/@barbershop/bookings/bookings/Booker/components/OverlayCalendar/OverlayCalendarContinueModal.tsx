import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { useLocale } from 'sanity'

interface IOverlayCalendarContinueModalProps {
  open?: boolean
  onClose?: (state: boolean) => void
  onContinue: () => void
}

export function OverlayCalendarContinueModal(
  props: IOverlayCalendarContinueModalProps,
) {
  const { t } = useLocale()
  return (
    <>
      <Dialog open={props.open} onOpenChange={props.onClose}>
        <DialogContent
          type="creation"
          title={t('overlay_my_calendar')}
          description={t('overlay_my_calendar_toc')}
        >
          <div className="flex flex-col gap-2">
            <Button
              data-testid="overlay-calendar-continue-button"
              onClick={() => {
                props.onContinue()
              }}
              className="items-center justify-center w-full font-semibold gap"
              StartIcon="calendar-search"
            >
              {t('continue_with', { appName: APP_NAME })}
            </Button>
          </div>
          <DialogFooter>
            {/* Agh modal hacks */}
            <></>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
