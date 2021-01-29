import { expect } from 'chai'
import { parseManifest } from '../src/start/manifest'

describe('manifest', () => {
  it('parses manifest', () => {
    const manifest = parseManifest('./test/fixtures/manifest.yml')

    expect(Object.keys(manifest.mappings.eventHandlers).length).to.be.equal(
      2,
      'Has 2 event handlers'
    )
    expect(Object.keys(manifest.mappings.extrinsicHandlers).length).to.be.equal(
      2,
      'Has 2 extrinsic handlers'
    )
    expect(manifest.mappings.preBlockHooks.length).to.be.equal(
      2,
      'Has 2 pre block hooks'
    )
    expect(manifest.mappings.postBlockHooks.length).to.be.equal(
      2,
      'Has 2 post block hooks'
    )
  })
})