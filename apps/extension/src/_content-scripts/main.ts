import { initializeExtension } from './init'
import { verifiedHosts } from './config/websites'
import { detectManager } from './utils/managerDetector'

const { host } = window.location

const main = () => {
  console.log('Initializing extension...')
  console.log('Current host:', host)
  if (verifiedHosts.includes(host)) {
    console.log('Verified hosts:', verifiedHosts)
    console.log('Initializing extension for host:', host)

    const manager = detectManager(host)
    if (manager) {
      initializeExtension(manager)
    } else {
      console.warn('No manager found for host:', host)
    }
    return
  }
}

main()
