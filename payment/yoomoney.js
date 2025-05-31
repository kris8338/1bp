const RECEIVER = process.env.YOOMONEY_RECEIVER || '41001...';

function createPayment(amount, label) {
  const url = `https://yoomoney.ru/quickpay/confirm.xml` +
              `?receiver=${RECEIVER}` +
              `&label=${label}` +
              `&quickpay-form=button` +
              `&targets=Подписка` +
              `&sum=${amount}` +
              `&paymentType=AC`;

  return { url, label };
}

module.exports = { createPayment };
