import './styles/main.less'

import React from 'react' // eslint-disable-line
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { syncHistoryWithStore } from 'mobx-react-router'
import { createBrowserHistory } from 'history'

// import { isProduction } from './utils/constants'
import App from './views/MainView'

import 'semantic-ui-css/semantic.min.css'

// const store = rehydrate()

const renderApp = Component => {
  render(
      <Component />,
    document.getElementById('root')
  )
}

renderApp(App)

if (module.hot) {
  module.hot.accept(() => renderApp(App))
}
