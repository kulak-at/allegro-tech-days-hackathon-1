import userDataReports from './userReportsData'
import alertData from './alertData'
import bikeData from './userBikeData'
import axios from 'axios'

import Promise from 'bluebird'

class DataService {
  static getUserReports (lat, lng, radius) {
    return axios.get('/api/user-report', {
      params: {
        lat: lat,
        lng: lng,
        radius: radius
      }
    })
    .then(d => d.data)
  }

  static getAlerts (lat, lng, radius) {
    return axios.get('/api/accidents', {
      params: {
        lat: lat,
        lng: lng,
        radius: radius
      }
    })
    .then(d => d.data)
  }

  static getBikeData (lat, lng, radius) {
    return axios.get('/api/bike-coords', {
      params: {
        lat: lat,
        lng: lng,
        radius: radius
      }
    })
    .then(d => d.data)
  }

  static getNewestUserReports (since) {
    return axios.get('/api/new-user-report', {
      params: {
        since: since
      }
    })
    .then(d => d.data)
  }

}

export default DataService
