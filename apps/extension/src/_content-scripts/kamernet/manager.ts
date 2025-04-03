import { PlatformManager } from '@features'
import {
  applicationPageController,
  propertyListPageController,
  singlePropertyPageController,
  applicationResultPageController,
} from './controllers'
import { PLATFORM_PAGE } from '~core/database'

export const kamernetManager = new PlatformManager({
  singlePropertyPageController,
  propertyListPageController,
  applicationPageController,
  applicationResultPageController,
  pickController: () => {
    const { pathname } = window.location

    if (
      pathname.includes('room-') ||
      pathname.includes('huren-') ||
      pathname.includes('studio-') ||
      pathname.includes('apartment-')
    ) {
      return PLATFORM_PAGE.SinglePropertyPage
    }

    if (pathname.includes('for-rent') || pathname.includes('huurwoningen')) {
      return PLATFORM_PAGE.PropertyListPage
    }

    return null
  },
})
