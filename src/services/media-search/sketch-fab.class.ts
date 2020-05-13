import fetch from 'node-fetch'
import config from 'config'

interface FilterType {
  count: number
  max_face_count: number
  max_filesizes: string
  type: string
  downloadable: boolean
  processing_status: string
  cursor: string
}

export default class GooglePolyMedia {
  private readonly SKETCH_FAB_URL = 'https://api.sketchfab.com/v3/search'

  private readonly SKETCH_FAB_AUTH_TOKEN = config.get('sketchFab.authToken') ?? ''

  private readonly maxCollectionFaceCount = 200_000
  private readonly maxCollectionFileSizeBytes = `gltf:${100 * 1024 * 1024}`

  public async searchSketchFabMedia (filterOptions: any): Promise<any> {
    const { source, filter, cursor, q, collection, pageSize } = filterOptions

    const defaultFilters: FilterType = {
      count: pageSize,
      max_face_count: 60000,
      max_filesizes: `gltf:${20 * 1024 * 1024}`,
      type: 'models',
      downloadable: true,
      processing_status: 'succeeded',
      cursor
    }

    // Collection filter
    if (collection) {
      Object.assign(defaultFilters, this.sketchFabCollectionQueryHandler(collection, q))
    }

    // Category Filter
    if (filter) {
      Object.assign(defaultFilters, this.sketchFabCategoryQueryHandler(filter, q))
    }

    const url = new URL(this.SKETCH_FAB_URL)

    Object.keys(defaultFilters).forEach((key) => url.searchParams.append(key, String(defaultFilters[key as keyof FilterType])))

    return await fetch(url, { headers: { Authorization: this.SKETCH_FAB_AUTH_TOKEN } })
      .then(res => res.json())
      .then((response) => {
        return {
          meta: {
            source: source,
            next_cursor: response.cursors.next
          },
          entries: response.results.map(this.getAndProcessSketchFabResponse),
          suggestions: null
        }
      })
  }

  private getAndProcessSketchFabResponse (item: any): any {
    const preview = item.thumbnails.images.sort((a: any, b: any) => b.size - a.size)[0]
    const uid: string = item.uid

    const url: string = `https://sketchfab.com/models/${uid}`
    const processedResponse = {
      type: 'sketchfab_model',
      id: item.uid,
      name: item.name,
      url: url,
      attributions: { creator: { name: item.user.username, url: item.user.profileUrl } },
      images: {
        preview: {
          url: item.thumbnails.images.sort((a: any, b: any) => b.size - a.size)[0]
        }
      }
    }

    if (preview?.url) {
      processedResponse.images = {
        preview: {
          url: preview.url
        }
      }
    }
    return processedResponse
  }

  // Collection filter
  private sketchFabCollectionQueryHandler (collectionId: number, q: string): any {
    return {
      max_face_count: this.maxCollectionFaceCount,
      max_filesizes: this.maxCollectionFileSizeBytes,
      collection: collectionId,
      sort_by: !q || q === '' ? '-publishedAt' : ''
    }
  }

  // Category filter
  private sketchFabCategoryQueryHandler (category: string, q: string): any {
    const _categoryFilter: any = {
      categories: category
    }
    if (!q || q === '') {
      _categoryFilter.staffpicked = true
      _categoryFilter.sort_by = '-publishedAt'
    }

    // In case of featured filter, enable the staffpicked flag
    if (category === 'featured') {
      _categoryFilter.staffpicked = true
    }
    return _categoryFilter
  }
}
