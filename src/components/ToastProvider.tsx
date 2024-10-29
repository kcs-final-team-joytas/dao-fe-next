'use client'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

const ToastProvider = () => {
  return (
    <ToastContainer
      position='top-right'
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='dark'
      limit={2}
      closeOnClick
      toastStyle={{
        fontSize: '15px',
      }}
    />
  )
}

export default ToastProvider
