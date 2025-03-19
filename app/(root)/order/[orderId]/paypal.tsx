'use client'
import { MiniSpinner } from '@/components/shared/spinner'
import {
  approvePaypalOrder,
  createPaypalOrder,
} from '@/lib/actions/order.actions'
import { Order } from '@/zod'
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { toast } from 'sonner'

export default function PayPal({
  order,
  paypalClientId,
}: {
  order: Partial<Order>
  paypalClientId: string
}) {
  const PrintLoadingState = () => {
    let status: string | React.ReactNode = ''
    const [{ isPending, isRejected }] = usePayPalScriptReducer()

    if (isPending) {
      status = <MiniSpinner />
    } else if (isRejected) {
      status = 'Error loading PayPal SDK'
    } else {
      status = ''
    }

    return status
  }

  const handleCreateOrder = async () => {
    const res = await createPaypalOrder(order.id!)

    if (!res.success) {
      toast.error(res.message)
    }

    return res.data
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleApprovePayPalOrder = async (data: any) => {
    const res = await approvePaypalOrder(order.id!, { orderId: data.orderID })

    if (res.success) toast.success(res.message)
    else toast.error(res.message)
  }

  return (
    <div className='mt-4'>
      <PayPalScriptProvider
        options={{
          clientId: paypalClientId,
        }}
      >
        <PrintLoadingState />
        <PayPalButtons
          createOrder={handleCreateOrder}
          onApprove={handleApprovePayPalOrder}
        />
      </PayPalScriptProvider>
    </div>
  )
}
