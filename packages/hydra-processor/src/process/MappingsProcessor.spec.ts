import { formatEventId } from '@dzlzv/hydra-common'
import { expect } from 'chai'
import { nextEventQueries, nextState } from '.'

const blockInterval2 = {
  from: 3,
  to: 10,
}

const blockWindow = 20

const globalFilterConfig = {
  blockWindow,
  blockInterval: blockInterval2,
  events: ['event1', 'event2'],
  extrinsics: ['extrinsic1', 'extrinsic2'],
}

describe('MappingsProcessor', () => {
  it('makes an event query based on the current state', () => {
    const context = {
      globalFilterConfig,
      indexerHead: 5,
      state: {
        lastProcessedEvent: undefined,
        lastScannedBlock: 0,
      },
    }

    let nextQuery = nextEventQueries(context)[0]
    expect(nextQuery.block_gte).equals(3, 'should take global filter config')
    expect(nextQuery.block_lte).equals(5, 'should take indexer head')
    expect(nextQuery.events).include('event1', 'should include event names')

    context.indexerHead = 40
    nextQuery = nextEventQueries(context)[0]
    expect(nextQuery.block_lte).equals(10, 'should take global filter config')
  })

  it('creates next state', () => {
    let state = nextState(
      {
        lastProcessedEvent: undefined,
        lastScannedBlock: 0,
      },
      [{ block_lte: 5 }, { block_lte: 6 }]
    )
    expect(state.lastProcessedEvent).equals(formatEventId(0, 0))

    state = nextState(
      {
        lastProcessedEvent: formatEventId(0, 5),
        lastScannedBlock: 4,
      },
      [{ block_lte: 5 }, { block_lte: 5 }]
    )
    expect(state.lastProcessedEvent).equals(formatEventId(0, 5))
    expect(state.lastScannedBlock).equals(
      0,
      'should update last scanned block to the one of the event'
    )

    state = nextState(
      {
        lastProcessedEvent: formatEventId(6, 5),
        lastScannedBlock: 4,
      },
      [{ block_lte: 5 }, { block_lte: 6 }]
    )
    expect(state.lastScannedBlock).equals(
      5,
      'should update last scanned block to min of block_lte and the of the event'
    )
  })

  // it('updates the state after processing an event', () => {})
})
