// import { Profile } from '../realsense'

export interface CameraStreamDriver {
  // subscribe(type, device, profile: Profile, socket): any
  subscribe(type, device, profile, socket): any
  unsubscribe(subscription: any)
  publish(message, channel)
  handleRequest(request): any
}
