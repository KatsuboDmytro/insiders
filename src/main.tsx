import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import { Root } from './routes/Root'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { store } from './app/store'
import 'react-toastify/dist/ReactToastify.css';
import './styles/reset.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Root />
        <ToastContainer />
      </Router>
    </Provider>
  </StrictMode>,
)
