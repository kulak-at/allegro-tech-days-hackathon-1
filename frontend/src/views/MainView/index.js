import React from 'react'

import { Grid, Menu, Sidebar, Segment, Icon, Container, Button, Radio } from 'semantic-ui-react'
import Map from '../Map'

import Slider from 'react-slider'

import './MainView.less'

class MainView extends React.Component {

  constructor () {
    super()
    this.state = {
      filtersOpen: false,
      heatmapRadius: 15,
      showBikes: true,
      showAccidents: true,
      showReports: true
    }

    this.toggleFilters = this.toggleFilters.bind(this)
    this.changeRadius = this.changeRadius.bind(this)
    this.changeShowBikes = this.changeShowBikes.bind(this)
    this.changeShowAccidents = this.changeShowAccidents.bind(this)
    this.changeShowReports =this.changeShowReports.bind(this)
  }

  toggleFilters () {
    this.setState({
      filtersOpen: !this.state.filtersOpen
    })
  }

  changeRadius (e) {
    this.setState({
      heatmapRadius: parseInt(e.target.value, 10)
    })
  }

  changeShowBikes () {
    this.setState({
      showBikes: !this.state.showBikes
    })
  }

  changeShowAccidents () {
    this.setState({
      showAccidents: !this.state.showAccidents
    })
  }

  changeShowReports () {
    this.setState({
      showReports: !this.state.showReports
    })
  }


  render () {
    return <div className='full-container'>
      <Sidebar className='pointer-enable' as={Menu} animation='overlay' width='wide' visible={this.state.filtersOpen} icon='labeled' vertical inverted>
        <Menu.Item><Radio toggle onChange={this.changeShowBikes} checked={this.state.showBikes} /> Bikes Layer</Menu.Item>
        <Menu.Item><Radio toggle onChange={this.changeShowAccidents} checked={this.state.showAccidents} /> Accidents</Menu.Item>
        <Menu.Item><Radio toggle onChange={this.changeShowReports} checked={this.state.showReports} /> User Requests</Menu.Item>
        <Menu.Item>
          <input type='range' min='1' max='100' value={this.state.heatmapRadius} onChange={this.changeRadius} />
        </Menu.Item>
      </Sidebar>
      <Map
        heatmapRadius={this.state.heatmapRadius}
        showBikes={this.state.showBikes}
        showAccidents={this.state.showAccidents}
        showReports={this.state.showReports}
      />
      <div className='overlay'>
        <Button primary circular icon='settings' floated='left' onClick={this.toggleFilters} />
      </div>
      </div>
  }
}

export default MainView
