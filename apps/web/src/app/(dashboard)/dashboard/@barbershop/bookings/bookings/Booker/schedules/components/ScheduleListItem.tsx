import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Fragment } from 'react'

export function ScheduleListItem({
  schedule,
  deleteFunction,
  displayOptions,
  updateDefault,
  isDeletable,
  duplicateFunction,
}: {
  schedule: RouterOutputs['viewer']['availability']['list']['schedules'][number]
  deleteFunction: ({ scheduleId }: { scheduleId: number }) => void
  displayOptions?: {
    timeZone?: string
    hour12?: boolean
  }
  isDeletable: boolean
  updateDefault: ({
    scheduleId,
    isDefault,
  }: {
    scheduleId: number
    isDefault: boolean
  }) => void
  duplicateFunction: ({ scheduleId }: { scheduleId: number }) => void
}) {
  return (
    <li key={schedule.id}>
      <div className="flex items-center justify-between py-5 transition hover:bg-muted ltr:pl-4 rtl:pr-4 sm:ltr:pl-0 sm:rtl:pr-0">
        <div className="group flex w-full items-center justify-between sm:px-6">
          <Link
            href={`/availability/${schedule.id}`}
            className="flex-grow truncate text-sm"
            title={schedule.name}
          >
            <div className="space-x-2 rtl:space-x-reverse">
              <span className="text-emphasis truncate font-medium">
                {schedule.name}
              </span>
              {schedule.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  Default
                </Badge>
              )}
            </div>
            <p className="text-subtle mt-1">
              {schedule.availability
                .filter((availability) => !!availability.days.length)
                .map((availability) => (
                  <Fragment key={availability.id}>
                    {availabilityAsString(availability, {
                      locale: 'en',
                      hour12: displayOptions?.hour12,
                    })}
                    <br />
                  </Fragment>
                ))}
              {(schedule.timeZone || displayOptions?.timeZone) && (
                <p className="my-1 flex items-center first-letter:text-xs">
                  <Icon name="globe" className="h-3.5 w-3.5" />
                  &nbsp;{schedule.timeZone ?? displayOptions?.timeZone}
                </p>
              )}
            </p>
          </Link>
        </div>
        <Dropdown>
          <DropdownMenuTrigger asChild>
            <Button
              data-testid="schedule-more"
              className="mx-5"
              type="button"
              variant="icon"
              color="secondary"
              StartIcon="ellipsis"
            />
          </DropdownMenuTrigger>
          {!isPending && data && (
            <DropdownMenuContent>
              <DropdownMenuItem className="min-w-40 focus:ring-muted">
                {!schedule.isDefault && (
                  <DropdownItem
                    type="button"
                    StartIcon="star"
                    onClick={() => {
                      updateDefault({
                        scheduleId: schedule.id,
                        isDefault: true,
                      })
                    }}
                  >
                    {t('set_as_default')}
                  </DropdownItem>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="outline-none">
                <DropdownItem
                  type="button"
                  data-testid={`schedule-duplicate${schedule.id}`}
                  StartIcon="copy"
                  onClick={() => {
                    duplicateFunction({
                      scheduleId: schedule.id,
                    })
                  }}
                >
                  {t('duplicate')}
                </DropdownItem>
              </DropdownMenuItem>
              <DropdownMenuItem className="min-w-40 focus:ring-muted">
                <DropdownItem
                  type="button"
                  color="destructive"
                  StartIcon="trash"
                  data-testid="delete-schedule"
                  onClick={() => {
                    if (!isDeletable) {
                      showToast(t('requires_at_least_one_schedule'), 'error')
                    } else {
                      deleteFunction({
                        scheduleId: schedule.id,
                      })
                    }
                  }}
                >
                  {t('delete')}
                </DropdownItem>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </Dropdown>
      </div>
    </li>
  )
}
