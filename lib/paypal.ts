const base = process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com'

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text()

    throw new Error(errorText)
  }

  return res.json()
}

export const paypal = {
  async createOrder(price: number) {
    const accessToken = await generateAccessToken()
    const url = base + '/v2/checkout/orders'

    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    })

    const body = JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: price,
          },
        },
      ],
    })

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body,
    })

    return handleResponse(res)
  },
}

// generate access token
export async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    'base64'
  )

  // create headers
  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${auth}`,
  })

  const res = await fetch(base + '/v1/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers,
  })

  const data = await handleResponse(res)

  return data.access_token
}
