import { Polygon, MultiPolygon, Position, Feature } from 'geojson'
import rewind from '@mapbox/geojson-rewind'
import { bbox } from '@turf/turf'

export function scalePolygon(coords: Position[], xFactor: number, zFactor: number): Position[] {
  return coords.map(([x, z]) => [x * xFactor, z * zFactor])
}
export function translatePolygon(coords: Position[], xDiff: number, zDiff: number): Position[] {
  return coords.map(([x, z]) => [x + xDiff, z + zDiff])
}

/**
 * Assumptions:
 *   - self completely surrounds all of the other polygons
 *   - self does not contain holes/interior rings
 *   - self is a simple polygon without overlapping edges
 *   - other polygons do not have holes, or not ones we care about
 */
export function subtract(self: Polygon, others: (Polygon | MultiPolygon)[]): Polygon {
  others.forEach((other) => {
    switch (other.type) {
      case 'Polygon':
        subtractPolygonCoordinates(self, other.coordinates)
      case 'MultiPolygon':
        other.coordinates.forEach((polygonCoords) => {
          subtractPolygonCoordinates(self, polygonCoords)
        })
    }
  })
  return rewind(self)
}

function subtractPolygonCoordinates(self: Polygon, other: Position[][]) {
  self.coordinates.push(other[0])
}

export function computeBoundingBox(set: (Polygon | MultiPolygon)[]): Polygon {
  let minX = 0
  let minY = 0
  let maxX = 0
  let maxY = 0

  set.forEach((item) => {
    switch (item.type) {
      case 'Polygon':
        item.coordinates[0].forEach((coord) => {
          minX = Math.min(minX, coord[0])
          minY = Math.min(minY, coord[1])
          maxX = Math.max(maxX, coord[0])
          maxY = Math.max(maxY, coord[1])
        })
        break
      case 'MultiPolygon':
        item.coordinates.forEach((polygonCoords) => {
          polygonCoords[0].forEach((coord) => {
            minX = Math.min(minX, coord[0])
            minY = Math.min(minY, coord[1])
            maxX = Math.max(maxX, coord[0])
            maxY = Math.max(maxY, coord[1])
          })
        })
        break
    }
  })

  return {
    type: 'Polygon',
    coordinates: [
      [
        [minX, minY],
        [maxX, minY],
        [maxX, maxY],
        [minX, maxY],
        [minX, minY]
      ]
    ]
  }
}

export function copy(self: Polygon): Polygon {
  return {
    type: 'Polygon',
    coordinates: self.coordinates.slice()
  }
}

export function addTileIndex(featuresFromTile: Feature[]) {
  featuresFromTile.forEach(({ properties }, index) => {
    properties.tileIndex = `${index}`
  })
}

export function scaleAndTranslatePosition(position: Position, llCenter: Position, scale = 1) {
  return [(position[0] - llCenter[0]) * scale, (position[1] - llCenter[1]) * scale]
}

export function scaleAndTranslatePolygon(coords: Position[][], llCenter: Position, scale = 1) {
  return [coords[0].map((position) => scaleAndTranslatePosition(position, llCenter, scale))]
}

export function scaleAndTranslate(geometry: Polygon | MultiPolygon, llCenter: Position, scale = 1) {
  switch (geometry.type) {
    case 'MultiPolygon':
      geometry.coordinates = geometry.coordinates.map((coords) => scaleAndTranslatePolygon(coords, llCenter, scale))
      break
    case 'Polygon':
      geometry.coordinates = scaleAndTranslatePolygon(geometry.coordinates, llCenter, scale)
      break
  }

  return geometry
}

export function computeBoundingCircleRadius(feature: Feature) {
  const [minX, minY, maxX, maxY] = bbox(feature)

  return Math.max(maxX - minX, maxY - minY) / 2
}
