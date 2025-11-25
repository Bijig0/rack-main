// import { EmptyScreen, Avatar } from '@calcom/ui'

export type UnpublishedEntityProps = {
  /**
   * If it is passed, don't pass orgSlug
   * It conveys two things - Slug for the team and that it is not an organization
   */
  teamSlug?: string | null
  /**
   * If it is passed, don't pass teamSlug.
   * It conveys two things - Slug for the team and that it is an organization infact
   */
  orgSlug?: string | null
  /* logo url for entity */
  logoUrl?: string | null
  /**
   * Team or Organization name
   */
  name?: string | null
}

export function UnpublishedEntity(props: UnpublishedEntityProps) {
  const slug = props.orgSlug || props.teamSlug
  return (
    <div className="flex items-center justify-center m-8">
      Unpublished entity
      {/* <EmptyScreen
        avatar={
          <Avatar
            alt={slug ?? ''}
            imageSrc={getPlaceholderAvatar(props.logoUrl, slug)}
            size="lg"
          />
        }
        headline={t('team_is_unpublished', {
          team: props.name,
        })}
        description={t(
          `${props.orgSlug ? 'org' : 'team'}_is_unpublished_description`,
        )}
      /> */}
    </div>
  )
}
