import sampleData from '@/db/sample-data'
import { formatCurrency } from '@/lib/utils'
import type { Order } from '@/zod'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '\@react-email/components'
import dotenv from 'dotenv'
dotenv.config()

type OrderInformationProps = {
  order: Order
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
})

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: '1234567890',

    user: {
      name: 'John Doe',
      email: 'john@email.com',
    },

    paymentMethod: 'Stripe',
    shippingAddress: {
      fullName: 'John Doe',
      streetAddress: '123 N Main St',
      city: 'Los Angeles',
      postalCode: '90001',
      country: 'US',
    },

    createdAt: new Date().toString(),
    totalPrice: '100',
    taxPrice: '10',
    shippingPrice: '10',
    itemsPrice: '80',

    orderItems: sampleData.products.map((i) => ({
      name: i.name,
      orderId: '1234',
      productId: '1234',
      slug: i.slug,
      qty: i.stock,
      image: i.images[0],
      price: i.price.toString(),
    })),

    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: '1234',
      status: 'succeeded',
      pricePaid: '100',
      email_address: 'john@email.com',
    },
  },
} satisfies OrderInformationProps

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Purchase Receipt</Heading>

            <Section>
              <Row>
                <Column>
                  <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                    Order ID
                  </Text>
                  <Text className='mt-0 mr-4'>{order.id.toString()}</Text>
                </Column>

                <Column>
                  <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                    Purchase Date
                  </Text>
                  <Text className='mt-0 mr-4'>
                    {dateFormatter.format(new Date(order.createdAt))}
                  </Text>
                </Column>

                <Column>
                  <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                    Price Paid
                  </Text>
                  <Text className='mt-0 mr-4'>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
              {order.orderItems.map((item) => (
                <Row key={item.productId} className='mt-8'>
                  <Column className='w-20'>
                    <Img
                      width={80}
                      alt={item.name}
                      src={
                        item.image.startsWith('/')
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className='align-top'>
                    {item.name} x {item.qty}
                  </Column>
                  <Column className='align-top' align='right'>
                    {formatCurrency(item.price)}
                  </Column>
                </Row>
              ))}

              {[
                {
                  name: 'Items',
                  price: order.itemsPrice,
                },
                {
                  name: 'Tax',
                  price: order.taxPrice,
                },
                {
                  name: 'Shipping',
                  price: order.shippingPrice,
                },
                {
                  name: 'Total',
                  price: order.totalPrice,
                },
              ].map((i) => (
                <Row key={i.name} className='py-1'>
                  <Column align='right'>{i.name}: </Column>
                  <Column align='right' width={70} className='align-top'>
                    <Text className='m-0'>{formatCurrency(i.price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
