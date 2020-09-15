import { Controller, Get } from '@overnightjs/core'
import { OK } from 'http-status-codes'
import { Logger } from '@overnightjs/logger'
import { getIndexerHead } from '@dzlzv/hydra-indexer-lib/lib/db/dal'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response } from 'express'

@Controller('api/indexer')
export class IndexerController {
  @Get()
  private async head(req: Request, res: Response): Promise<any> {
    Logger.Info('Indexer get header called')
    const head = await getIndexerHead()
    return res.status(OK).json({
      head: head,
    })
  }
}
