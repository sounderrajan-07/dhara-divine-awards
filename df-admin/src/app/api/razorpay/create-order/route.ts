import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid payment amount is required' }, { status: 400 });
    }

    const rawKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

    const keyId = rawKeyId.trim() || 'rzp_test_dhara_demo';
    const keySecret = rawKeySecret.trim() || 'test_dhara_secret_key';

    const amountInPaise = Math.round(Number(amount) * 100);
    const orderReceipt = receipt || `rcpt_${Date.now()}`;

    // If using real/test Razorpay credentials configured in environment variables
    if (keyId !== 'rzp_test_dhara_demo' && keySecret !== 'test_dhara_secret_key' && keyId.length > 5) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: currency.toUpperCase(),
            receipt: orderReceipt,
            notes: notes || {}
          })
        });

        if (response.ok) {
          const order = await response.json();
          return NextResponse.json({
            success: true,
            order_id: order.id, // Real Razorpay order ID (e.g. order_PtX8w2...)
            amount: order.amount,
            currency: order.currency,
            key_id: keyId,
            receipt: order.receipt
          }, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
          });
        } else {
          const errorText = await response.text();
          console.error('Razorpay API error response:', response.status, errorText);
        }
      } catch (err) {
        console.warn('Razorpay API request failed:', err);
      }
    }

    // Fallback/Demo mode (When API order creation is not available or keys are demo)
    return NextResponse.json({
      success: true,
      order_id: undefined, // Omit order_id in test mode so Razorpay SDK opens client-side payment
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      key_id: keyId.startsWith('rzp_') ? keyId : 'rzp_test_dhara_demo',
      receipt: orderReceipt,
      isTestMode: true
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create Razorpay order' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
