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
    return <div className='map' ref='map' />
  }

  componentWillReceiveProps (newProps) {
    if (this.heatmap) {
      this.heatmap.set('radius', newProps.heatmapRadius) // FIXME:
      if (this.props.showBikes !== newProps.showBikes) {
        this.heatmap.setMap(newProps.showBikes ? this.map : null)
      }
    }

    if (this.reports && this.props.showReports !== newProps.showReports) {
      this.reports.forEach(report => {
        console.log('report', report)
        report.setMap(newProps.showReports ? this.map : null)
      })
    }

    if (this.alerts && this.props.showAccidents !== newProps.showAccidents) {
      this.alerts.forEach(alert => {
        alert.setMap(newProps.showAccidents ? this.map : null)
      })
    }

  }

  mapPoint(pointFile) {
    return (point) => {
      console.log(point)
      return new google.maps.Marker({
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
    this.heatmap.set('radius', this.props.heatmapRadius)
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
    .then(points => {
      console.log('P', points)
      this.reports = points
    })

    DataService.getAlerts()
    .map(this.mapPoint(explosion))
    .then(points => {
      this.alerts = points
    })

    DataService.getBikeData()
    .then(this.makeHeatmap)

  }
}

export default Map
