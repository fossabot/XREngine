/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import { createState, useState, none, Downgraded } from '@hookstate/core'
import { FeedActionType } from './FeedActions'
import { FeedShort, Feed } from '@xrengine/common/src/interfaces/Feed'

const state = createState({
  feeds: {
    feeds: [] as Array<Feed>,
    feedsFetching: false,
    feedsFeatured: [] as Array<FeedShort>,
    feedsFeaturedFetching: false,
    feedsCreator: [] as Array<FeedShort>,
    feedsCreatorFetching: false,
    feedsBookmark: [] as Array<FeedShort>,
    feedsBookmarkFetching: false,
    feedsFired: [] as Array<FeedShort>,
    feedsFiredFetching: false,
    myFeatured: [] as Array<FeedShort>,
    myFeaturedFetching: false,
    feed: {} as Feed,
    fetching: false,
    feedsAdmin: {
      feeds: [] as Array<Feed>,
      updateNeeded: false,
      lastFetched: new Date()
    },
    feedsAdminFetching: false,
    lastFeedVideoUrl: null
  }
})

export const feedReducer = (_, action: FeedActionType) => {
  Promise.resolve().then(() => feedReceptor(action))
  return state.attach(Downgraded).value
}

const feedReceptor = (action: FeedActionType): any => {
  state.batch((s) => {
    let currentFeed
    switch (action.type) {
      case 'FEEDS_FETCH':
        return s.feeds.feedsFetching.set(true)
      case 'FEATURED_FEEDS_FETCH':
        return s.feeds.feedsFeaturedFetching.set(true)
      case 'CREATOR_FEEDS_FETCH':
        return s.feeds.feedsCreatorFetching.set(true)
      case 'BOOKMARK_FEEDS_FETCH':
        return s.feeds.feedsBookmarkFetching.set(true)
      case 'MY_FEATURED_FEEDS_FETCH':
        return s.feeds.myFeaturedFetching.set(true)
      case 'FEEDS_FETCH':
        return s.feeds.fetching.set(true)
      case 'ADMIN_FEEDS_FETCH':
        return s.feeds.feedsAdminFetching.set(true)
      case 'FIRED_FEEDS_FETCH':
        return s.feeds.feedsFiredFetching.set(true)
      case 'FEEDS_RETRIEVED':
        return s.feeds.merge({ feeds: action.feeds, feedsFetching: false })
      case 'FEEDS_FEATURED_RETRIEVED':
        return s.feeds.merge({ feedsFeatured: action.feeds, feedsFeaturedFetching: false })

      case 'FEEDS_CREATOR_RETRIEVED':
        return s.feeds.merge({ feedsCreator: action.feeds, feedsCreatorFetching: false })
      case 'CLEAR_CREATOR_FEATURED':
        return s.feeds.merge({ feedsCreator: [], feedsCreatorFetching: false })

      case 'FEEDS_MY_FEATURED_RETRIEVED':
        return s.feeds.merge({ myFeatured: action.feeds, myFeaturedFetching: false })

      case 'FEEDS_BOOKMARK_RETRIEVED':
        return s.feeds.merge({ feedsBookmark: action.feeds, feedsBookmarkFetching: false })

      case 'FEEDS_FIRED_RETRIEVED':
        return s.feeds.merge({ feedsFired: action.feeds, feedsFiredFetching: false })

      case 'FEED_RETRIEVED':
        return s.feeds.merge({ feed: action.feed, fetching: false })

      case 'ADD_FEED_FIRES':
        currentFeed = s.feeds.feed?.value
        return s.feeds.merge({
          feeds: s.feeds.feeds.value.map((feed) => {
            if (feed.id === action.feedId) {
              return { ...feed, fires: ++feed.fires, isFired: true }
            }
            return { ...feed }
          }),
          feed: currentFeed ? { ...currentFeed, fires: ++currentFeed.fires, isFired: true } : {}
        })

      case 'REMOVE_FEED_FIRES':
        currentFeed = s.feeds.feed?.value
        return s.feeds.merge({
          feeds: s.feeds.feeds?.value?.map((feed) => {
            if (feed.id === action.feedId) {
              return { ...feed, fires: feed.fires - 1, isFired: false }
            }
            return { ...feed }
          }),
          feed: currentFeed ? { ...currentFeed, fires: --currentFeed.fires, isFired: false } : {}
        })

      case 'ADD_FEED_BOOKMARK':
        return s.feeds.merge({
          feeds: s.feeds.feeds?.value?.map((feed) => {
            if (feed.id === action.feedId) {
              return { ...feed, isBookmarked: true }
            }
            return { ...feed }
          }),
          feed: currentFeed ? { ...currentFeed, isBookmarked: true } : {}
        })

      case 'REMOVE_FEED_BOOKMARK':
        return s.feeds.merge({
          feeds: s.feeds.feeds?.value?.map((feed) => {
            if (feed.id === action.feedId) {
              return { ...feed, isBookmarked: false }
            }
            return { ...feed }
          }),
          feed: currentFeed ? { ...currentFeed, isBookmarked: false } : {}
        })

      case 'ADD_FEED_VIEW':
        return s.feeds.merge({
          feedsFeatured: s.feeds.feedsFeatured?.value?.map((feed) => {
            if (feed.id === action.feedId) {
              return { ...feed, viewsCount: ++feed.viewsCount }
            }
            return { ...feed }
          }),
          feed: currentFeed ? { ...currentFeed, viewsCount: ++currentFeed.viewsCount } : {}
        })
      case 'ADD_FEED':
        return s.feeds.merge({ feeds: [...s.feeds.feeds.value, action.feed], feedsFetching: false })
      case 'ADD_FEED_FEATURED':
        return s.feeds.feedsCreator.set(
          s.feeds.feedsCreator?.value?.map((feed) => {
            if (feed.id === action.feedId) {
              return { ...feed, featured: true }
            }
            return { ...feed }
          })
        )

      case 'REMOVE_FEED_FEATURED':
        const myFeatured = s.feeds.myFeatured?.value
        return s.feeds.merge({
          feedsCreator: s.feeds.feedsCreator?.value?.map((feed) => {
            if (feed.id === action.feedId) {
              return { ...feed, featured: false }
            }
            return { ...feed }
          }),
          myFeatured: myFeatured
            ? myFeatured.splice(
                myFeatured.findIndex((item) => item.id === action.feedId),
                1
              )
            : []
        })

      case 'FEEDS_AS_ADMIN_RETRIEVED':
        s.feeds.feedsAdmin.feeds.set(action.feeds)
        s.feeds.feedsAdmin.updateNeeded.set(false)
        s.feeds.feedsAdmin.lastFetched.set(new Date())
        return s.feeds.fetching.set(false)

      case 'UPDATE_FEED':
        s.feeds.feedsAdmin.feeds.set(
          s.feeds.feedsAdmin.feeds?.value?.map((feed) => {
            if (feed.id === action.feed.id) {
              return { ...feed, ...action.feed }
            }
            return { ...feed }
          })
        )
        return s.feeds.feedsAdminFetching.set(false)

      case 'DELETE_FEED':
        return s.feeds.feedsFeatured.set([...s.feeds.feedsFeatured?.value?.filter((feed) => feed.id !== action.feedId)])

      case 'LAST_FEED_VIDEO_URL':
        return s.feeds.lastFeedVideoUrl.set(action.feedId)
    }
  }, action.type)
}

export const accessFeedState = () => state
export const useFeedState = () => useState(state)
