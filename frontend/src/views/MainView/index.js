import React from 'react'

import { Grid, Menu, Sidebar, Segment, Icon, Container, Button, Radio, Loader, Dimmer } from 'semantic-ui-react'
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
      showReports: true,
      showBikeRoads: true
    }

    this.toggleFilters = this.toggleFilters.bind(this)
    this.changeRadius = this.changeRadius.bind(this)
    this.changeShowBikes = this.changeShowBikes.bind(this)
    this.changeShowAccidents = this.changeShowAccidents.bind(this)
    this.changeShowReports =this.changeShowReports.bind(this)
    this.onLoading = this.onLoading.bind(this)
    this.changeShowBikeRoads = this.changeShowBikeRoads.bind(this)
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

  onLoading (isLoading) {
    this.setState({
      isLoading: isLoading
    })
  }

  changeShowBikeRoads () {
    this.setState({
      showBikeRoads: !this.state.showBikeRoads
    })
  }


  render () {
    return <div className='full-container'>
      <Sidebar className='pointer-enable' as={Menu} animation='overlay' width='wide' visible={this.state.filtersOpen} icon='labeled' vertical inverted>
        <Menu.Item>
          <Grid>
            <Grid.Column width={4}>
              <Radio toggle onChange={this.changeShowAccidents} checked={this.state.showAccidents} />
            </Grid.Column>
            <Grid.Column width={12}>Accidents</Grid.Column>
          </Grid>
        </Menu.Item>
        <Menu.Item>
          <Grid>
            <Grid.Column width={4}><Radio toggle onChange={this.changeShowReports} checked={this.state.showReports} /></Grid.Column>
            <Grid.Column width={12}>User Requests</Grid.Column>
          </Grid>
        </Menu.Item>
        <Menu.Item>
          <Grid>
            <Grid.Column width={4}>
              <Radio toggle onChange={this.changeShowBikes} checked={this.state.showBikes} />
            </Grid.Column>
            <Grid.Column width={12}>
              Bikers Layer
            </Grid.Column>
          </Grid></Menu.Item>
        <Menu.Item>
          <Grid>
            <Grid.Column width={4}>
              <Radio toggle onChange={this.changeShowBikeRoads} checked={this.state.showBikeRoads} />
            </Grid.Column>
            <Grid.Column width={12}>
              Current Bike Roads Layer
            </Grid.Column>
          </Grid></Menu.Item>
        <Menu.Item>
          <Grid>
            <Grid.Column width={6}>Radius</Grid.Column>
            <Grid.Column width={10}><input type='range' min='1' max='100' value={this.state.heatmapRadius} onChange={this.changeRadius} /></Grid.Column>
          </Grid>
        </Menu.Item>
      </Sidebar>
      <Map
        heatmapRadius={this.state.heatmapRadius}
        showBikes={this.state.showBikes}
        showAccidents={this.state.showAccidents}
        showReports={this.state.showReports}
        showBikeRoads={this.state.showBikeRoads}
        onLoad={this.onLoading}
      />
      <div className='overlay'>
        <Dimmer active={this.state.isLoading}>
          <Loader />
        </Dimmer>
        <Button primary circular icon='settings' floated='left' onClick={this.toggleFilters} />
      </div>
      </div>
  }
}

export default MainView
