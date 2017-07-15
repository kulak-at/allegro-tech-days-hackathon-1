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
      heatmapRadius: 5
    }

    this.toggleFilters = this.toggleFilters.bind(this)
    this.changeRadius = this.changeRadius.bind(this)
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

  render () {
    return <div className='full-container'>
      <Sidebar className='pointer-enable' as={Menu} animation='overlay' width='wide' visible={this.state.filtersOpen} icon='labeled' vertical inverted>
        <Menu.Item><Radio toggle /> Bikes</Menu.Item>
        <Menu.Item><Radio toggle /> Accidents</Menu.Item>
        <Menu.Item><Radio toggle /> User Requests</Menu.Item>
        <Menu.Item>
          <input type='range' min='1' max='100' value={this.state.heatmapRadius} onChange={this.changeRadius} />
        </Menu.Item>
      </Sidebar>
      <Map heatmapRadius={this.state.heatmapRadius} />
      <div className='overlay'>
        <Button primary circular icon='settings' floated='left' onClick={this.toggleFilters} />
      </div>
      </div>
  }
}

export default MainView
