const base = process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com'

export const paypal = {
  // generate access token
  async generateAccessToken() {
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

    if (!res.ok) {
      const errorText = await res.text()

      throw new Error(errorText)
    }

    const data = await res.json()

    return data.access_token
  },
}
