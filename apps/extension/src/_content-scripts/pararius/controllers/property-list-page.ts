import { PropertyListPageController } from '@features'
import { CommuteTimes } from '~ui/components'

class ParariusController extends PropertyListPageController {
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
      '.search-controls__button',
    )
    if (!container) return

    this.insertCommuteTime()
  }

  insertCommuteTime() {
    const commuteButtonContainers = document.querySelectorAll(
      '.listing-search-item',
    )

    commuteButtonContainers.forEach(container => {
      if (!container) return

      const travelTimeTarget = document.createElement('div')
      travelTimeTarget.classList.add('uprent-travel-time')
      travelTimeTarget.classList.add('uprent-pararius-travel-time')
      container.append(travelTimeTarget)

      new CommuteTimes({
        target: travelTimeTarget,
      })
    })
  }
}

export const propertyListPageController = new ParariusController()
