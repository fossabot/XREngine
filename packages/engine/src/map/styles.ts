/*
address:44
alcohol:5
artwork:3
attraction:3
bank:5
bar:4
beach:2
bench:3
bicycle_repair_station:2
books:2
building:457
building_part:3
bus_stop:6
cafe:5
car_repair:5
cinema:2
clinic:3
clothes:3
college:4
commercial:2
convenience:2
courthouse:2
drinking_water:4
fast_food:11
fence:21
fitness:2
florist:2
footway:4
gate:2
government:3
grass:12
greengrocer:2
hedge:18
hotel:2
kindergarten:2
level_crossing:16
major_road:46
mall:2
military:2
mini_roundabout:2
minor_road:253
monument:4
museum:3
park:10
parking:25
path:168
pedestrian:18
pharmacy:3
pier:4
pitch:12
place_of_worship:2
platform:3
playground:13
police:2
post_box:5
post_office:2
power_pole:3
pub:2
rail:48
railway:8
residential:16
restaurant:20
retail:8
river:5
riverbank:15
school:3
scrub:2
station:3
subway_entrance:2
supermarket:3
toilets:4
townhall:2
traffic_signals:3
tree:11
viewpoint:2
waste_basket:2
*/

export interface IFeatureStyles {
  color?: number
  height?: 'a' | number
  height_scale?: number
  width?: number
  extrude?: string
  offy?: number
  opacity?: number
}

export interface IFeatureStylesByLayerName {
  [layerName: string]: IFeatureStyles
}

export const DEFAULT_FEATURE_STYLES: IFeatureStylesByLayerName = {
  building: {
    /*fragment_shader:
           "uniform vec2 resolution;\n"
          +"uniform float time;\n"
          +"varying vec3 worldPos;\n"
          +"void main(void)\n"
          +"{\n"
          +"  float opacity = 1.0;\n"
          +"  vec3 color = vec3(1.0,1.0,1.0);"
          +"  opacity = pow(sin(worldPos.x) / 2.0 + sin(worldPos.y - time) / 2.0, 4.0);\n"
          +"  gl_FragColor=vec4(color,opacity);\n"
          +"}\n",
        vertex_shader:
           "uniform float time;\n"
          +"varying vec3 worldPos;\n"
          +"void main()\n"
          +"{\n"
          +"  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n"
          +"  worldPos = position;\n"
          +"  mvPosition.x += sin(mvPosition.y);\n"
          +"  gl_Position = projectionMatrix * mvPosition;\n"
          +"}\n"*/

    color: 0x999999,
    height: 'a'
  },

  road: {
    color: 0x333333,
    offy: 0.2,
    extrude: 'flat'
  },

  poi: {
    color: 0xff0000,
    height: 20
  },

  landuse: {
    color: 0xffff00,
    opacity: 1,
    extrude: 'flat',
    offy: -0.2
  },

  landcover: {
    color: 0x6688ff,
    extrude: 'flat',
    offy: -0.4
  },

  address: {
    color: 0xffffff
  },
  path: {
    width: 3
  },
  service: {
    width: 5
  },
  minor: {
    width: 5
  },
  major: {
    width: 7
  },
  highway: {
    width: 9
  },

  pedestrian: {
    color: 0xffffff
  },
  playground: {
    height: 10,
    color: 0xffff00,
    opacity: 0.5
  },
  tree: {
    color: 0x00ff00,
    height: 40,
    width: 3
  },
  grass: {
    color: 0x00ff00,
    height: 0.7
  },
  hedge: {
    color: 0x006600,
    height: 8
  },
  park: {
    color: 0x008800,
    opacity: 0.33,
    exrude: 'flat',
    offy: -0.4
  },
  forest: {
    color: 0x008800,
    opacity: 0.8,
    offy: -0.4
  },
  pitch: {
    color: 0x88ff88
  },
  parking: {
    color: 0x555555,
    opacity: 0.8,
    offy: 0
  },
  fence: {
    color: 0xff0000,
    height: 9
  },
  railway: {
    color: 0x888800,
    height: 1.5
  },
  retail: {
    height: 0.8,
    color: 0xcc44cc
  },
  military: {
    color: 0x448800
  },
  place_of_worship: {
    color: 0x000000
  },
  residential: {
    color: 0xcc8800
  },
  commercial: {
    color: 0x880088
  },
  cemetery: {
    offy: -0.1
  },
  school: {
    color: 0xddaaaa
  }
}
