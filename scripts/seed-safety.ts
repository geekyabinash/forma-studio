type SeedEnvironment = Record<string, string | undefined>

function isProduction(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'production'
}

export function assertSeedAllowed(
  scriptName: string,
  env: SeedEnvironment = process.env
): void {
  const productionLike =
    isProduction(env.VERCEL_ENV) || isProduction(env.NODE_ENV)

  if (!productionLike || env.ALLOW_PRODUCTION_SEED === 'true') {
    return
  }

  throw new Error(
    [
      `Refusing to run ${scriptName} in production.`,
      'These scripts seed dummy/static data and can interfere with admin-managed content.',
      'Set ALLOW_PRODUCTION_SEED=true only for an intentional, backed-up production seed.',
    ].join(' ')
  )
}
