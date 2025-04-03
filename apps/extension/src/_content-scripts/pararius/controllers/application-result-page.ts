import { ApplicationResultPageController } from '@features'

class ParariusController extends ApplicationResultPageController {
  constructor() {
    super()
  }

  onPageMutation() {
    // couldnt find the result page lol
  }
}

export const applicationResultPageController = new ParariusController()
