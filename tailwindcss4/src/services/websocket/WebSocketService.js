import { Cookies } from '../../contants/Cookies'
import { toast } from 'react-toastify'

let reconnectTimer = null

export function initWebSocket() {
  const token = Cookies.getCookie(Cookies.accessToken)
  if (!token) {
    console.warn('[WS] No token found; skipping websocket init')
    return
  }

  if (window.globalSocket) {
    const state = window.globalSocket.readyState
    if (state === WebSocket.OPEN) {
      console.info('[WS] Already connected; skipping new connection')
      return
    }
    if (state === WebSocket.CONNECTING) {
      console.info('[WS] Connection in progress; skipping new connection')
      return
    }
  }

  const socket = new WebSocket(`ws://localhost:8888/notification?${token}`)
  window.globalSocket = socket

  socket.onopen = () => {
    console.log('[WS] Connected')
  }

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data)
      console.log('[WS] Message received', message)
      // Show toast notification
      let toastText = 'Bạn có thông báo mới'
      if (message.type === 'failedStock') {
        toast.error(message.message)
      } else if (message.type === 'successStock') {
        toast.success(message.message)
      } 
      // Broadcast to the app; listeners can handle badge updates etc.
      window.dispatchEvent(new CustomEvent('ws:message', { detail: message }))
    } catch (error) {
      console.error('[WS] Error parsing message', error)
    }
  }

  socket.onerror = (error) => {
    console.error('[WS] Error', error)
  }

  socket.onclose = () => {
    console.warn('[WS] Closed; will attempt reconnect in 3s')
    window.globalSocket = null
    if (reconnectTimer) clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(initWebSocket, 3000)
  }
}

export function closeWebSocket() {
  if (window.globalSocket) {
    try {
      window.globalSocket.close()
    } finally {
      window.globalSocket = null
    }
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}


