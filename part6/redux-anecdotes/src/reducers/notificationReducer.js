const notificationReducer = (state = 'default message', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    case 'REMOVE_NOTIFICATION':
      return ''
    default:
      return 'default message'
  }
}

export const createNotification = message => {
  return {
    type: 'SET_NOTIFICATION',
    data: message
  }
}

export const removeNotification = () => ({
    type: 'REMOVE_NOTIFICATION'
})

export default notificationReducer
