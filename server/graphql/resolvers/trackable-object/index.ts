import { trackableObjectResolver } from './trackable-object'
import { trackableObjectsResolver } from './trackable-objects'

import { updateTrackableObjectState } from './update-trackable-object-state'

export const Query = {
  ...trackableObjectsResolver,
  ...trackableObjectResolver
}

export const Mutation = {
  ...updateTrackableObjectState
}
