import AWS from 'aws-sdk'
import config from '../../config'

export async function sendSms (phone: string, text: string): Promise<void> {
  const params = {
    Message: text,
    PhoneNumber: phone
  }

  // Create promise and SNS service object
  const publishTextPromise = new AWS.SNS({
    apiVersion: '2010-03-31',
    ...config.aws.sms
  }).publish(params).promise()

  return await publishTextPromise
    .then((data: any) => {
      console.log(`MessageID is ${data.MessageId as string}`)
    })
    .catch((err: any) => {
      console.error(err, err.stack)
    })
}
