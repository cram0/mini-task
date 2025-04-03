import { PropertyListPageController } from '@features'
import { CommuteTimes } from '~ui/components'

class KamernetController extends PropertyListPageController {
  initialized = false

  constructor() {
    super()
  }

  onPageMutation() {
    if (this.initialized) {
      return
    }
    this.initialized = true

    // We use attribute selectors kinda like regex to match the class names
    // Because the class names are dynamnic and will probably change on next website compilation
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
    const container = document.querySelector<HTMLDivElement>(
      '[class^="Search_root"]',
    )
    if (!container) return

    this.insertCommuteTime()
  }

  insertCommuteTime() {
    const commuteButtonContainers = document.querySelectorAll<HTMLDivElement>(
      '[class^="ListingCard_cardContent"]',
    )
    if (!commuteButtonContainers.length) return

    commuteButtonContainers.forEach(commuteButtonContainer => {
      const travelTimeTarget = document.createElement('div')
      travelTimeTarget.classList.add('uprent-travel-time')
      travelTimeTarget.classList.add('uprent-pararius-travel-time')

      // There's an issue where if you click on the injected widget,
      // it will trigger the <a> link click, which sucks
      // this hack should prevent it
      travelTimeTarget.addEventListener(
        'click',
        e => {
          e.stopPropagation()
          e.preventDefault()
        },
        true,
      )

      commuteButtonContainer.append(travelTimeTarget)

      new CommuteTimes({
        target: travelTimeTarget,
      })
    })
  }
}

export const propertyListPageController = new KamernetController()
