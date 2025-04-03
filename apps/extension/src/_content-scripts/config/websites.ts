import { parariusManager } from '../pararius/manager'
import { kamernetManager } from '../kamernet/manager'

export enum Website {
  PARARIUS = 'pararius',
  KAMERNET = 'kamernet',
}

export const websiteConfig = {
  [Website.PARARIUS]: {
    domains: [
      'pararius.nl',
      'pararius.com',
      'www.pararius.nl',
      'www.pararius.com',
    ],
    manager: parariusManager,
  },
  [Website.KAMERNET]: {
    domains: ['kamernet.nl', 'kamernet.com'],
    manager: kamernetManager,
  },
}

export const verifiedHosts = Object.values(websiteConfig).flatMap(
  config => config.domains,
)
