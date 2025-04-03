import { ApplicationResultPageController } from '@features'

class KamernetController extends ApplicationResultPageController {
  constructor() {
    super()
  }

  onPageMutation() {
    //
  }
}

export const applicationResultPageController = new KamernetController()
