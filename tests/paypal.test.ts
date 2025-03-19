import { generateAccessToken, paypal } from '@/lib/paypal'

/**
 * Test to generate access token from PayPal API
 */
test('generates access token from PayPal API', async () => {
  const tokenResponse = await generateAccessToken()

  console.log(tokenResponse)

  expect(typeof tokenResponse).toBe('string')
  expect(tokenResponse.length).toBeGreaterThan(0)
})

/**
 * Test to create order from PayPal API
 */
test('creates a paypal order', async () => {
  const token = await generateAccessToken()
  const price = 10.0

  const orderResponse = await paypal.createOrder(price)
  console.log(orderResponse)

  expect(orderResponse).toHaveProperty('id')
  expect(orderResponse).toHaveProperty('status')
  expect(orderResponse.status).toBe('CREATED')
})

/**
 * Test to capture payment with mock order from PayPal API
 */
test('simulate capturing a payment from an order', async () => {
  const orderId = '100' // Mock order ID for testing

  const mockCapturePayment = jest
    .spyOn(paypal, 'capturePayment')
    .mockResolvedValue({
      status: 'COMPLETED',
    })

  const captureResponse = await paypal.capturePayment(orderId)

  expect(captureResponse).toHaveProperty('status')
  expect(captureResponse.status).toBe('COMPLETED')

  mockCapturePayment.mockRestore()
})
