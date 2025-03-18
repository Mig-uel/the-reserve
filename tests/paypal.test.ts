import { generateAccessToken } from '@/lib/paypal'

/**
 * Test to generate access token from PayPal API
 */
test('generates access token from PayPal API', async () => {
  const tokenResponse = await generateAccessToken()

  console.log(tokenResponse)

  expect(typeof tokenResponse).toBe('string')
  expect(tokenResponse.length).toBeGreaterThan(0)
})
