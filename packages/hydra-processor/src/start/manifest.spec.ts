import { expect } from 'chai'
import {
  inferDefault,
  parseBlockInterval,
  parseHandlerDef,
  validateArgTypes,
} from './manifest'

describe('manifest', () => {
  it('parses block intervals', () => {
    const empty = parseBlockInterval(undefined)
    expect(empty.from).equals(0)
    expect(empty.to).equals(Number.MAX_SAFE_INTEGER)

    const left = parseBlockInterval('[42,]')
    expect(left).not.to.be.an('undefined')
    expect(left.from).equals(42, 'should read the from block')
    expect(left.to).equals(Number.MAX_SAFE_INTEGER)

    const right = parseBlockInterval('[,42]')
    expect(right).not.to.be.an('undefined')
    expect(right.to).equals(42, 'should read the to block')
    expect(right.from).equals(0)

    const both = parseBlockInterval(' [ 2 , 42 ] ')
    expect(both).not.to.be.an('undefined')
    expect(both.from).equals(2, 'should read the from block')
    expect(both.to).equals(42, 'should read the from block')
  })

  it('parses handlers', () => {
    const { name, argTypes } = parseHandlerDef(
      'balancesTransfer(DatabaseManager, SubstrateEvent) '
    )
    expect(name).equals('balancesTransfer')
    expect(argTypes).contains('DatabaseManager')
    expect(argTypes).contains('SubstrateEvent')
    expect(argTypes.length).equals(2)
  })

  it('infers default handler names', () => {
    const { name, argTypes } = inferDefault('Balances.Transfer', 'Event')

    expect(name).equals('balances_TransferEvent')
    expect(argTypes).contains('DatabaseManager')
    expect(argTypes).contains('Balances.TransferEvent')
    expect(argTypes.length).equals(2)
  })

  it('validate handler args', () => {
    expect(() =>
      validateArgTypes({
        handler: 'test',
        argTypes: ['DatabaseManager', 'DatabaseManager'],
      })
    ).to.throw('multiple arguments')

    expect(() =>
      validateArgTypes({
        handler: 'test',
        argTypes: ['DatabaseManager', 'XEvent', 'YEvent'],
      })
    ).to.throw('multiple arguments of event type')

    expect(() =>
      validateArgTypes({
        handler: 'test',
        argTypes: ['DatabaseManager', 'XCall', 'YCall'],
      })
    ).to.throw('multiple arguments of call type')
  })

  it('Parse handler definitions', () => {
    expect(parseHandlerDef('test()').argTypes.length).to.equal(
      0,
      'Should parse empty arg list'
    )
  })
})
