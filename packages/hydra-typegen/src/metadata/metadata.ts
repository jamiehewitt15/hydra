import { MetadataLatest } from '@polkadot/types/interfaces'
import { Metadata } from '@polkadot/metadata'
import { TypeRegistry } from '@polkadot/types/create'
import WS from '@polkadot/x-ws'
import BN from 'bn.js'
import path from 'path'
import { TypeDefs } from './types'
import { readJson } from '../util'

const debug = require('debug')('hydra-typegen:metadata')

export const registry = new TypeRegistry()

export interface MetadataSource {
  source: string
  blockHash?: string
  spec?: ChainSpec
}

interface ChainSpec {
  chain: string
  name: string
  version: BN
}

export async function getMetadata({
  source,
  blockHash,
}: MetadataSource): Promise<MetadataLatest> {
  let metaHex: string | undefined
  debug(`Reading metadata: from ${source}`)

  if (source.startsWith('wss://') || source.startsWith('ws://')) {
    debug(`Reading from chain: ${source}`)
    metaHex = await fromChain(source, blockHash)
  } else {
    metaHex = require(path.join(process.cwd(), source)).result as string
  }

  const meta = new Metadata(registry, metaHex)

  registry.setMetadata(meta)

  return meta.asLatest
}

export function registerCustomTypes(typeDefs: string): TypeDefs {
  const typeDefsJson = readJson(typeDefs) as TypeDefs
  registry.register(typeDefsJson)
  debug(`Registered ${Object.keys(typeDefsJson).join(',')}`)
  return typeDefsJson
}

// export function registerTypes(custom: CustomTypes = {}, spec?: ChainSpec) {
//   registry.setKnownTypes({ types: custom })
//   if (spec) {
//     registry.register(
//       getSpecTypes(registry, spec.chain, spec.name, spec.version)
//     )
//   }
// }

async function fromChain(endpoint: string, blockHash = ''): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const websocket = new WS(endpoint)

      websocket.onclose = (event: { code: number; reason: string }): void => {
        reject(
          new Error(
            `disconnected, code: '${event.code}' reason: '${event.reason}'`
          )
        )
      }

      websocket.onerror = (event: unknown): void => {
        reject(new Error(JSON.stringify(event, null, 2)))
      }

      websocket.onopen = (): void => {
        debug('connected')
        // TODO: support chain height
        websocket.send(
          `{"id":"1","jsonrpc":"2.0","method":"state_getMetadata","params":[${blockHash}]}`
        )
      }

      websocket.onmessage = (message: any): void => {
        resolve(JSON.parse(message.data).result)
        websocket.close()
      }
    } catch (e) {
      reject(
        new Error(
          `Cannot fetch metadata: ${e.message}, ${JSON.stringify(e, null, 2)}`
        )
      )
    }
  })
}