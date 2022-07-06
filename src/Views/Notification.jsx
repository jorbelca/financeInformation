import React from "react"
import { Toast, ToastContainer } from "react-bootstrap"
import { notificationStore } from "../state/store"

const Notification = () => {
  const notifications = notificationStore((state) => state.notifications)
  const removeNotifications = notificationStore(
    (state) => state.removeNotifications
  )

  if (notifications.length > 0) setTimeout(() => removeNotifications(), 3000)

  return (
    <>
      {notifications.length > 0 ? (
        <>
          <div>Notification</div>
          <ToastContainer position={"top-center"}>
            <Toast animation={true} bg={"danger"} className="m-2">
              <Toast.Header>
                <strong className="me-auto">Error</strong>
              </Toast.Header>
              <Toast.Body>{notifications}</Toast.Body>
            </Toast>
          </ToastContainer>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default Notification
