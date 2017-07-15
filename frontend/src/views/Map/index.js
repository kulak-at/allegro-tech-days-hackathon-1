import React from 'react'
import './Map.less'

import styles from './styles'

import DataService from '../../service/DataService'

import userReport from './user_report.png'
import explosion from './explosion.png'

class Map extends React.Component {

  constructor () {
    super()
    this.makeHeatmap = this.makeHeatmap.bind(this)
  }

  render () {
    return <div className='map' ref='map'></div>
  }

  componentWillReceiveProps (newProps) {
    if (this.heatmap) {
      this.heatmap.set('radius', newProps.heatmapRadius) // FIXME:
    }
  }

  mapPoint(pointFile) {
    return (point) => {
      console.log(point)
      const marker = new google.maps.Marker({
        position: {
          lat: point.location.coordinates[0],
          lng: point.location.coordinates[1]
        },
        map: this.map,
        // label: point.description,
        icon: pointFile
      })
    }
  }

  makeHeatmap (data) {
    console.log('MAKE HEATMAP', data)
    data = data.map(d => new google.maps.LatLng(d.location.coordinates[0], d.location.coordinates[1]))
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: data
    })

    this.heatmap.setMap(this.map)
  }

  componentDidMount () {
    console.log('Component did mount')
    console.log(this)
    this.map = new google.maps.Map(this.refs.map, {
      center: {lat: 52.3919131, lng: 16.8580715},
      zoom: 14,
      disableDefaultUI: true,
      styles: styles
    })

    DataService.getUserReports()
    .map(this.mapPoint(userReport))

    DataService.getAlerts()
    .map(this.mapPoint(explosion))

    DataService.getBikeData()
    .then(this.makeHeatmap)

  }
}

export default Map
