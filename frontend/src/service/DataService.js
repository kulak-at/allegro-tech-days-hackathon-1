import userDataReports from './userReportsData'
import alertData from './alertData'
import bikeData from './userBikeData'

import Promise from 'bluebird'

class DataService {
  static getUserReports () {
    return Promise.resolve(userDataReports)
  }

  static getAlerts () {
    return Promise.resolve(alertData)
  }

  static getBikeData () {
    return Promise.resolve(bikeData)
  }
}

export default DataService
