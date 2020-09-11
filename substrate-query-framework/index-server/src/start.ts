import { HydraServer } from './HydraServer'
import { numberEnv } from '@dzlzv/hydra-indexer-lib/lib/utils/env-flags'
import { createDBConnection } from '@dzlzv/hydra-indexer-lib/lib/db/helper'
import { Logger } from '@overnightjs/logger'
import * as dotenv from 'dotenv'

dotenv.config()

const port = numberEnv(`HYDRA_SERVER_PORT`) || 4001

createDBConnection()
  .then(() => {
    const server = new HydraServer()
    server.start(port)
  })
  .catch((e) =>
    Logger.Err(`Error connecting the database, ${JSON.stringify(e, null, 2)}`)
  )
