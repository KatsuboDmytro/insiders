import { toast } from 'react-toastify'
import { useCallback } from 'react'

const useNotification = () => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message, {
      position: 'bottom-right',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
    })
  }, [])

  const showError = useCallback((message: string) => {
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
    })
  }, [])

  return { showSuccess, showError }
}

export default useNotification
