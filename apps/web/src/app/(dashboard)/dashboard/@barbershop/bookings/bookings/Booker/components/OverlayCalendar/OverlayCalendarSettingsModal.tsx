import Link from 'next/link'
import { Fragment } from 'react'

import classNames from '@/app/classNames'
import { Alert } from '@/components/ui/alert'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useLocale } from 'sanity'
import type { UseCalendarsReturnType } from '../hooks/useCalendars'

interface IOverlayCalendarSettingsModalProps {
  open?: boolean
  onClose?: (state: boolean) => void
  onClickNoCalendar?: () => void
  isLoading: boolean
  connectedCalendars: UseCalendarsReturnType['connectedCalendars']
  onToggleConnectedCalendar: (
    externalCalendarId: string,
    credentialId: number,
  ) => void
  checkIsCalendarToggled: (
    externalCalendarId: string,
    credentialId: number,
  ) => boolean
}

const SkeletonLoader = () => {
  return (
    <SkeletonContainer>
      <div className="px-4 py-4 mt-3 space-y-4 border border-subtle rounded-xl ">
        <SkeletonText className="w-full h-4" />
        <SkeletonText className="w-full h-4" />
        <SkeletonText className="w-full h-4" />
        <SkeletonText className="w-full h-4" />
      </div>
    </SkeletonContainer>
  )
}

export function OverlayCalendarSettingsModal({
  connectedCalendars,
  isLoading,
  open,
  onClose,
  onClickNoCalendar,
  onToggleConnectedCalendar,
  checkIsCalendarToggled,
}: IOverlayCalendarSettingsModalProps) {
  const { t } = useLocale()

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          enableOverflow
          type="creation"
          title="Calendar Settings"
          className="pb-4"
          description={t('view_overlay_calendar_events')}
        >
          <div className="max-h-full overflow-y-scroll no-scrollbar ">
            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <>
                {connectedCalendars.length === 0 ? (
                  <EmptyScreen
                    Icon="calendar"
                    headline={t('no_calendar_installed')}
                    description={t('no_calendar_installed_description')}
                    buttonText={t('add_a_calendar')}
                    buttonOnClick={onClickNoCalendar}
                  />
                ) : (
                  <>
                    {connectedCalendars.map((item) => (
                      <Fragment key={item.credentialId}>
                        {item.error && !item.calendars && (
                          <Alert severity="error" title={item.error.message} />
                        )}
                        {item?.error === undefined && item.calendars && (
                          <ListItem className="flex-col rounded-md">
                            <div className="flex items-center flex-1 w-full pb-4 space-x-3 rtl:space-x-reverse">
                              {
                                // eslint-disable-next-line @next/next/no-img-element
                                item.integration.logo && (
                                  <img
                                    className={classNames(
                                      'h-10 w-10',
                                      item.integration.logo.includes('-dark') &&
                                        'dark:invert',
                                    )}
                                    src={item.integration.logo}
                                    alt={item.integration.title}
                                  />
                                )
                              }
                              <div className="flex-grow pl-2 truncate">
                                <ListItemTitle
                                  component="h3"
                                  className="space-x-2 rtl:space-x-reverse"
                                >
                                  <Link href={`/apps/${item.integration.slug}`}>
                                    {item.integration.name ||
                                      item.integration.title}
                                  </Link>
                                </ListItemTitle>
                                <ListItemText component="p">
                                  {item.primary.email}
                                </ListItemText>
                              </div>
                            </div>
                            <div className="w-full pt-4 border-t border-subtle">
                              <ul className="space-y-4">
                                {item.calendars.map((cal, index) => {
                                  const id =
                                    cal.integrationTitle ??
                                    `calendar-switch-${index}`
                                  return (
                                    <li className="flex gap-3" key={id}>
                                      <Switch
                                        id={id}
                                        checked={checkIsCalendarToggled(
                                          cal.externalId,
                                          item.credentialId,
                                        )}
                                        onCheckedChange={() => {
                                          onToggleConnectedCalendar(
                                            cal.externalId,
                                            item.credentialId,
                                          )
                                        }}
                                      />
                                      <label htmlFor={id}>{cal.name}</label>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          </ListItem>
                        )}
                      </Fragment>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex self-end gap-2 mt-4">
            <DialogClose>{t('done')}</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
