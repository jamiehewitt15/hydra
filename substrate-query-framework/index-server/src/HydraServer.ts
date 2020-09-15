import * as bodyParser from 'body-parser'
import { Server } from '@overnightjs/core'
import { Logger } from '@overnightjs/logger'
import { IndexerController } from './controllers/IndexerController'

export class HydraServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === 'development') // setting showLogs to true
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.setupControllers()
  }

  private setupControllers(): void {
    super.addControllers([new IndexerController()])
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      Logger.Imp(`Server listening on port: ${port}`)
    })
  }
}
