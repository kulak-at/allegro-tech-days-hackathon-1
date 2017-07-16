import React from 'react'
import './Map.less'
import './markerclusterer'

import styles from './styles'

import DataService from '../../service/DataService'

import userReport from './user_report.png'
import explosion from './explosion.png'

const RADIUS = 4000

class Map extends React.Component {

  constructor () {
    super()
    this.makeHeatmap = this.makeHeatmap.bind(this)
    // this.clusterData = this.clusterData.bind(this)
    this.reports = []
    this.alerts = []
    this.heatmap = null
    this.since = (new Date()).toISOString()
    this.isLoading = false


    this.loadNewReports = this.loadNewReports.bind(this)

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

  mapPoint(pointFile, withInfoWindow, isVisible, animate) {
    return (point) => {
      const p = new google.maps.Marker({
        position: {
          lat: parseFloat(point.location.coordinates[1]),
          lng: parseFloat(point.location.coordinates[0])
        },
        map: isVisible ? this.map : null,
        animation: animate ? google.maps.Animation.DROP : null,
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
    data = data.map(d => new google.maps.LatLng(d.location.coordinates[1], d.location.coordinates[0]))
    // this.heatmap = new google.maps.visualization.HeatmapLayer({
    //   data: data
    // })

    if (!this.heatmap) {
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: data
      })
    }

    this.heatmap.setMap(this.map)
    this.heatmap.set('radius', this.props.heatmapRadius)
    this.heatmap.setData(data)
  }

  componentDidMount () {

    const lat = 52.3919131
    const lng = 16.8580715

    this.map = new google.maps.Map(this.refs.map, {
      center: {lat: lat, lng: lng},
      zoom: 14,
      disableDefaultUI: true,
      styles: styles
    })

    this.heatmap = null

    this.map.addListener('dragend', function() {
      const p = this.map.getCenter()
      this.refreshUserData(p.lat(), p.lng(), RADIUS)
    }.bind(this))

    this.refreshUserData(lat, lng, RADIUS)
    this.loadNewReports()
  }

  refreshUserData (lat, lng, radius) {
    this.props.onLoad(true)
    this.isLoading = true
    Promise.all([DataService.getUserReports(lat,lng,radius)
    .then(d => d.map(point => this.mapPoint(userReport, true, this.props.showReports)(point)))
    .then(points => {
      this.since = (new Date()).toISOString()
      this.reports.forEach(r => {
        r.setMap(null)
      })
      this.reports = points
    }),

    DataService.getAlerts(lat,lng,radius)
    // .then(this.clusterData)
    .then(d => d.map(point => this.mapPoint(explosion, false, this.props.showAccidents)(point)))
    .then(points => {
      this.alerts.forEach(r => {
        r.setMap(null)
      })
      this.alerts = points
    }),

    DataService.getBikeData(lat,lng,radius)
    .then(this.makeHeatmap)])
    .then(() => {
      this.props.onLoad(false)
      this.isLoading = false
    })
  }

  loadNewReports () {
    console.log('Y U NO WORK')
    if (!this.isLoading) {
      DataService.getNewestUserReports(this.since)
      .then(d => {
        console.log(d)
        d.forEach(point => {
          this.reports.push(this.mapPoint(userReport, true, this.props.showReports, true)(point))
        })
        this.since = (new Date()).toISOString()
        setTimeout(this.loadNewReports, 5000)
      })
    } else {
      setTimeout(this.loadNewReports, 5000)
    }

  }

}

export default Map
