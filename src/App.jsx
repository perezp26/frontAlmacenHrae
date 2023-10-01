import { Provider } from 'react-redux'
import { AppRouter } from './Routes/AppRouter'
import { store } from './store/store'

import { io } from "socket.io-client";
import { SocketContext } from '../SocketContext'

function App() {

//const socket = io( "http://192.168.151.51:3001" );
const socket = io( "http://localhost:3001" );

  return (
    <Provider store={ store }>
        <SocketContext.Provider value={ socket }>
          <AppRouter />
        </SocketContext.Provider>
    </Provider>
  )
}

export default App
