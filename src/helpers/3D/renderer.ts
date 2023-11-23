import { WebGLRenderer } from 'three'

export const createRenderer = () => {
  const renderer = new WebGLRenderer({ antialias: true })

  // Turn on the physically correct lighting model.
  renderer.physicallyCorrectLights = true

  return renderer
}
