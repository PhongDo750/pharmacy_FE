import { ToastContainer } from 'react-toastify';
import { AppRoutes } from './routes/AppRoutes';
import { useEffect } from 'react';
import { initWebSocket } from './services/websocket/WebSocketService';

function App() {
  useEffect(() => {
    // Tự động kết nối lại WebSocket khi load/refresh trang nếu đã có token
    initWebSocket();
  }, []);
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={2500} closeButton={false}/>
    </>
  )
}

export default App
