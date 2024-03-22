interface IRazorpay {
  generatePayment(amount: number): any;
  // generateRefund(paymentId:string, amount:number):any
}

export default IRazorpay;
