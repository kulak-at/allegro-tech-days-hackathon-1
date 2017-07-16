import userDataReports from './userReportsData'
import alertData from './alertData'
import bikeData from './userBikeData'
import axios from 'axios'

import Promise from 'bluebird'

class DataService {
  static getUserReports () {
    return axios.get('/api/user-report')
    .then(d => d.data)
  }

  static getAlerts () {
    return axios.get('/api/accidents')
    .then(d => d.data)
  }

  static getBikeData () {
    return axios.get('/api/bike-coords')
    .then(d => d.data)
  }
}

export default DataService
