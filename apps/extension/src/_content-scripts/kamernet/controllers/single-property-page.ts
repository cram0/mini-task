import { SinglePropertyPageController } from '@features'
import { CommuteTimes } from '~ui/components'

class KamernetController extends SinglePropertyPageController {
  initialized = false

  constructor() {
    super()
  }

  onPageMutation() {
    if (this.initialized) {
      return
    }
    this.initialized = true

    const container = document.querySelector<HTMLDivElement>(
      '.MuiButtonBase-root',
    )
    if (!container) return

    this.insertCommuteTime()
  }

  insertCommuteTime() {
    const commuteButtonContainer = document.querySelector<HTMLDivElement>(
      '[class^="About_root"]',
    )

    if (!commuteButtonContainer) return

    const travelTimeTarget = document.createElement('div')
    travelTimeTarget.classList.add('uprent-travel-time')
    travelTimeTarget.classList.add('uprent-pararius-travel-time')
    commuteButtonContainer.append(travelTimeTarget)

    new CommuteTimes({
      target: travelTimeTarget,
    })
  }
}

export const singlePropertyPageController = new KamernetController()
