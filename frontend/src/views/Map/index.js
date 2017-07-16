import React from 'react'
import './Map.less'
import './markerclusterer'

import styles from './styles'

import DataService from '../../service/DataService'

import userReport from './user_report.png'
import explosion from './explosion.png'

class Map extends React.Component {

  constructor () {
    super()
    this.makeHeatmap = this.makeHeatmap.bind(this)
    // this.clusterData = this.clusterData.bind(this)
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

  // clusterData (data) {
  //   data = data.map(d => ({lng: d.location.coordinates[0], lat: d.location.coordinates[1]}))
  //   const markerCluster = new MarkerCluster(this.map, data,
  //     {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
  //
  // }

  mapPoint(pointFile, withInfoWindow) {
    return (point) => {
      console.log('POINT', point)
      const p = new google.maps.Marker({
        position: {
          lat: parseFloat(point.location.coordinates[1]),
          lng: parseFloat(point.location.coordinates[0])
        },
        map: this.map,
        // label: point.description,
        icon: pointFile
      })

      if (!withInfoWindow) {
        return p
      }

      const infowindow = new google.maps.InfoWindow({
        content: '<h2>Reason: ' + point.reason + '</h2>' + '<p>' + point.description + '</p>'
      })

      let isOpen = false

      p.addListener('click', function() {
        if (isOpen) {
          infowindow.close()
        } else {
          infowindow.open(this.map, p)
        }
        isOpen = !isOpen
      }.bind(this))

      return p
    }
  }

  makeHeatmap (data) {
    console.log('MAKE HEATMAP', data)
    data = data.map(d => new google.maps.LatLng(d.location.coordinates[1], d.location.coordinates[0]))
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
    .then(d => d.map(point => this.mapPoint(userReport, true)(point)))
    .then(points => {
      console.log('P', points)
      this.reports = points
    })

    DataService.getAlerts()
    // .then(this.clusterData)
    .then(d => d.map(point => this.mapPoint(explosion)(point)))
    .then(points => {
      this.alerts = points
    })

    DataService.getBikeData()
    .then(this.makeHeatmap)


  }
}

export default Map
