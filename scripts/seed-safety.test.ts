import assert from 'node:assert/strict'
import test from 'node:test'

import { assertSeedAllowed } from './seed-safety'

test('rejects seed scripts on Vercel production without an explicit override', () => {
  assert.throws(
    () =>
      assertSeedAllowed('db:seed-content', {
        VERCEL_ENV: 'production',
      }),
    /Refusing to run db:seed-content in production/
  )
})

test('rejects seed scripts when NODE_ENV is production without an explicit override', () => {
  assert.throws(
    () =>
      assertSeedAllowed('db:seed', {
        NODE_ENV: 'production',
      }),
    /Refusing to run db:seed in production/
  )
})

test('allows seed scripts outside production', () => {
  assert.doesNotThrow(() =>
    assertSeedAllowed('db:seed', {
      VERCEL_ENV: 'preview',
      NODE_ENV: 'development',
    })
  )
})

test('allows production seed scripts only with the explicit override', () => {
  assert.doesNotThrow(() =>
    assertSeedAllowed('db:seed-content', {
      VERCEL_ENV: 'production',
      ALLOW_PRODUCTION_SEED: 'true',
    })
  )
})
