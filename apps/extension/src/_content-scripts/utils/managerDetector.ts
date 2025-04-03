import { websiteConfig } from '../config/websites'

//Detects which website we're on and returns the corresponding manager

export const detectManager = (host: string) => {
  for (const [website, config] of Object.entries(websiteConfig)) {
    console.log('Checking website:', website, 'for host:', host)
    if (config.domains.some(domain => host.includes(domain.split('.')[0]))) {
      return config.manager
    }
  }
  return null
}
