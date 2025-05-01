// import { Kafka } from 'kafkajs';
// import { sendEmail } from './emailService.js';
// import { sendSMS } from './smsService.js';
// import Notification from '../models/Notification.js';

// const kafka = new Kafka({
//   clientId: 'notification-service',
//   brokers: [process.env.KAFKA_BROKER],
// });

// export const startKafkaConsumer = async () => {
//   const consumer = kafka.consumer({ groupId: 'notification-group' });

//   await consumer.connect();
//   await consumer.subscribe({ 
//     topics: [
//       'order-placed', 
//       'delivery-assigned',
//       'payment-events'
//     ], 
//     fromBeginning: true 
//   });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       try {
//         const data = JSON.parse(message.value.toString());
//         let notification;

//         if (topic === 'order-placed') {
//           if (!data.customerEmail || !data.customerPhone) {
//             console.error('Missing customerEmail or customerPhone in order-placed event:', data);
//             return;
//           }
//           await sendEmail(
//             data.customerEmail,
//             'Order Confirmation',
//             `Your order #${data.orderId} has been placed successfully.`
//           );
//           await sendSMS(
//             data.customerPhone,
//             `Your order #${data.orderId} has been placed.`
//           );
//           notification = new Notification({
//             type: 'email',
//             recipient: data.customerEmail,
//             message: `Order #${data.orderId} confirmed`,
//             orderId: data.orderId,
//           });
//           await notification.save();
//           notification = new Notification({
//             type: 'sms',
//             recipient: data.customerPhone,
//             message: `Order #${data.orderId} confirmed`,
//             orderId: data.orderId,
//           });
//           await notification.save();
//         } else if (topic === 'delivery-assigned') {
//           if (!data.driverPhone) {
//             console.error('Missing driverPhone in delivery-assigned event:', data);
//             return;
//           }
//           await sendSMS(
//             data.driverPhone,
//             `New delivery assigned: Order #${data.orderId}.`
//           );
//           notification = new Notification({
//             type: 'sms',
//             recipient: data.driverPhone,
//             message: `Delivery for order #${data.orderId} assigned`,
//             orderId: data.orderId,
//           });
//           await notification.save();
//         } else if (topic === 'payment-events') {
//           if (!data.customerEmail) {
//             console.error('Missing customerEmail in payment-events:', data);
//             return;
//           }
//           switch (data.event) {
//             case 'payment-processed':
//               await sendEmail(
//                 data.customerEmail,
//                 'Payment Confirmation',
//                 `Your payment of ${data.amount} ${data.currency} for order #${data.orderId} has been processed successfully.`
//               );
//               if (data.customerPhone) {
//                 await sendSMS(
//                   data.customerPhone,
//                   `Payment of ${data.amount} ${data.currency} for order #${data.orderId} was successful.`
//                 );
//               }
//               notification = new Notification({
//                 type: 'email',
//                 recipient: data.customerEmail,
//                 message: `Payment for order #${data.orderId} confirmed`,
//                 orderId: data.orderId,
//                 paymentId: data.paymentId,
//               });
//               await notification.save();
//               if (data.customerPhone) {
//                 notification = new Notification({
//                   type: 'sms',
//                   recipient: data.customerPhone,
//                   message: `Payment for order #${data.orderId} confirmed`,
//                   orderId: data.orderId,
//                   paymentId: data.paymentId,
//                 });
//                 await notification.save();
//               }
//               break;
            
//             case 'payment-failed':
//               await sendEmail(
//                 data.customerEmail,
//                 'Payment Failed',
//                 `Your payment for order #${data.orderId} has failed. Reason: ${data.error}. Please update your payment information.`
//               );
//               if (data.customerPhone) {
//                 await sendSMS(
//                   data.customerPhone,
//                   `Payment for order #${data.orderId} failed: ${data.error}. Please update payment info.`
//                 );
//               }
//               notification = new Notification({
//                 type: 'email',
//                 recipient: data.customerEmail,
//                 message: `Payment failed for order #${data.orderId}`,
//                 orderId: data.orderId,
//                 error: data.error,
//               });
//               await notification.save();
//               if (data.customerPhone) {
//                 notification = new Notification({
//                   type: 'sms',
//                   recipient: data.customerPhone,
//                   message: `Payment failed for order #${data.orderId}`,
//                   orderId: data.orderId,
//                   error: data.error,
//                 });
//                 await notification.save();
//               }
//               break;
            
//             case 'refund-processed':
//               await sendEmail(
//                 data.customerEmail,
//                 'Refund Processed',
//                 `Your refund for order #${data.orderId} has been processed successfully.`
//               );
//               if (data.customerPhone) {
//                 await sendSMS(
//                   data.customerPhone,
//                   `Refund for order #${data.orderId} was processed successfully.`
//                 );
//               }
//               notification = new Notification({
//                 type: 'email',
//                 recipient: data.customerEmail,
//                 message: `Refund for order #${data.orderId} processed`,
//                 orderId: data.orderId,
//                 refundId: data.refundId,
//               });
//               await notification.save();
//               if (data.customerPhone) {
//                 notification = new Notification({
//                   type: 'sms',
//                   recipient: data.customerPhone,
//                   message: `Refund for order #${data.orderId} processed`,
//                   orderId: data.orderId,
//                   refundId: data.refundId,
//                 });
//                 await notification.save();
//               }
//               break;
            
//             case 'refund-failed':
//               await sendEmail(
//                 data.customerEmail,
//                 'Refund Processing Issue',
//                 `We're experiencing issues processing your refund for order #${data.orderId}. Our team has been notified and will resolve this shortly.`
//               );
//               if (data.customerPhone) {
//                 await sendSMS(
//                   data.customerPhone,
//                   `Refund issue for order #${data.orderId}. Our team is resolving it.`
//                 );
//               }
//               await sendEmail(
//                 process.env.SUPPORT_EMAIL,
//                 'URGENT: Refund Failed',
//                 `Failed refund for order #${data.orderId}. Error: ${data.error}. Please investigate immediately.`
//               );
//               notification = new Notification({
//                 type: 'email',
//                 recipient: data.customerEmail,
//                 message: `Refund issue for order #${data.orderId}`,
//                 orderId: data.orderId,
//                 error: data.error,
//               });
//               await notification.save();
//               if (data.customerPhone) {
//                 notification = new Notification({
//                   type: 'sms',
//                   recipient: data.customerPhone,
//                   message: `Refund issue for order #${data.orderId}`,
//                   orderId: data.orderId,
//                   error: data.error,
//                 });
//                 await notification.save();
//               }
//               break;
//             default:
//               console.error('Unknown payment event:', data.event);
//           }
//         }
//       } catch (error) {
//         console.error(`Error processing Kafka message on topic ${topic}:`, error);
//       }
//     },
//   });
// };

import { Kafka } from 'kafkajs';
import { sendEmail } from './emailService.js';
import { sendSMS } from './smsService.js';
import { sendWebSocketNotification } from './websocketService.js';
import Notification from '../models/Notification.js';
import { KAFKA_TOPICS } from '../config/config.js';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

export const startKafkaConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'notification-group' });

  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ 
    topics: [
      KAFKA_TOPICS.ORDER_PUBLISHED,
      KAFKA_TOPICS.ORDER_PLACED,
      KAFKA_TOPICS.DELIVERY_ASSIGNED,
      KAFKA_TOPICS.PAYMENT_EVENTS,
    ], 
    fromBeginning: true 
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        let notification;

        if (topic === KAFKA_TOPICS.ORDER_PUBLISHED) {
          if (!data.drivers || !data.orderId) {
            console.error('Missing drivers or orderId in order-published event:', data);
            return;
          }
          // Notify each driver via WebSocket
          for (const driver of data.drivers) {
            if (driver.driverId) {
              sendWebSocketNotification(driver.driverId, {
                orderId: data.orderId,
                orderDetails: data.orderDetails,
                message: `New order #${data.orderId} available for pickup.`,
              });
              notification = new Notification({
                type: 'websocket',
                recipient: driver.driverId,
                message: `Order #${data.orderId} published`,
                orderId: data.orderId,
                driverId: driver.driverId,
              });
              await notification.save();
            }
          }
        } else if (topic === KAFKA_TOPICS.ORDER_PLACED) {
          if (!data.customerEmail || !data.customerPhone) {
            console.error('Missing customerEmail or customerPhone in order-placed event:', data);
            return;
          }
          await sendEmail(
            data.customerEmail,
            'Order Confirmation',
            `Your order #${data.orderId} has been placed successfully.`
          );
          await sendSMS(
            data.customerPhone,
            `Your order #${data.orderId} has been placed.`
          );
          notification = new Notification({
            type: 'email',
            recipient: data.customerEmail,
            message: `Order #${data.orderId} confirmed`,
            orderId: data.orderId,
          });
          await notification.save();
          notification = new Notification({
            type: 'sms',
            recipient: data.customerPhone,
            message: `Order #${data.orderId} confirmed`,
            orderId: data.orderId,
          });
          await notification.save();
        } else if (topic === KAFKA_TOPICS.DELIVERY_ASSIGNED) {
          if (!data.driverPhone) {
            console.error('Missing driverPhone in delivery-assigned event:', data);
            return;
          }
          await sendSMS(
            data.driverPhone,
            `New delivery assigned: Order #${data.orderId}.`
          );
          notification = new Notification({
            type: 'sms',
            recipient: data.driverPhone,
            message: `Delivery for order #${data.orderId} assigned`,
            orderId: data.orderId,
          });
          await notification.save();
        } else if (topic === KAFKA_TOPICS.PAYMENT_EVENTS) {
          if (!data.customerEmail) {
            console.error('Missing customerEmail in payment-events:', data);
            return;
          }
          switch (data.event) {
            case 'payment-processed':
              await sendEmail(
                data.customerEmail,
                'Payment Confirmation',
                `Your payment of ${data.amount} ${data.currency} for order #${data.orderId} has been processed successfully.`
              );
              if (data.customerPhone) {
                await sendSMS(
                  data.customerPhone,
                  `Payment of ${data.amount} ${data.currency} for order #${data.orderId} was successful.`
                );
              }
              notification = new Notification({
                type: 'email',
                recipient: data.customerEmail,
                message: `Payment for order #${data.orderId} confirmed`,
                orderId: data.orderId,
                paymentId: data.paymentId,
              });
              await notification.save();
              if (data.customerPhone) {
                notification = new Notification({
                  type: 'sms',
                  recipient: data.customerPhone,
                  message: `Payment for order #${data.orderId} confirmed`,
                  orderId: data.orderId,
                  paymentId: data.paymentId,
                });
                await notification.save();
              }
              break;
            case 'payment-failed':
              await sendEmail(
                data.customerEmail,
                'Payment Failed',
                `Your payment for order #${data.orderId} has failed. Reason: ${data.error}. Please update your payment information.`
              );
              if (data.customerPhone) {
                await sendSMS(
                  data.customerPhone,
                  `Payment for order #${data.orderId} failed: ${data.error}. Please update payment info.`
                );
              }
              notification = new Notification({
                type: 'email',
                recipient: data.customerEmail,
                message: `Payment failed for order #${data.orderId}`,
                orderId: data.orderId,
                error: data.error,
              });
              await notification.save();
              if (data.customerPhone) {
                notification = new Notification({
                  type: 'sms',
                  recipient: data.customerPhone,
                  message: `Payment failed for order #${data.orderId}`,
                  orderId: data.orderId,
                  error: data.error,
                });
                await notification.save();
              }
              break;
            case 'refund-processed':
              await sendEmail(
                data.customerEmail,
                'Refund Processed',
                `Your refund for order #${data.orderId} has been processed successfully.`
              );
              if (data.customerPhone) {
                await sendSMS(
                  data.customerPhone,
                  `Refund for order #${data.orderId} was processed successfully.`
                );
              }
              notification = new Notification({
                type: 'email',
                recipient: data.customerEmail,
                message: `Refund for order #${data.orderId} processed`,
                orderId: data.orderId,
                refundId: data.refundId,
              });
              await notification.save();
              if (data.customerPhone) {
                notification = new Notification({
                  type: 'sms',
                  recipient: data.customerPhone,
                  message: `Refund for order #${data.orderId} processed`,
                  orderId: data.orderId,
                  refundId: data.refundId,
                });
                await notification.save();
              }
              break;
            case 'refund-failed':
              await sendEmail(
                data.customerEmail,
                'Refund Processing Issue',
                `We're experiencing issues processing your refund for order #${data.orderId}. Our team has been notified and will resolve this shortly.`
              );
              if (data.customerPhone) {
                await sendSMS(
                  data.customerPhone,
                  `Refund issue for order #${data.orderId}. Our team is resolving it.`
                );
              }
              await sendEmail(
                process.env.SUPPORT_EMAIL,
                'URGENT: Refund Failed',
                `Failed refund for order #${data.orderId}. Error: ${data.error}. Please investigate immediately.`
              );
              notification = new Notification({
                type: 'email',
                recipient: data.customerEmail,
                message: `Refund issue for order #${data.orderId}`,
                orderId: data.orderId,
                error: data.error,
              });
              await notification.save();
              if (data.customerPhone) {
                notification = new Notification({
                  type: 'sms',
                  recipient: data.customerPhone,
                  message: `Refund issue for order #${data.orderId}`,
                  orderId: data.orderId,
                  error: data.error,
                });
                await notification.save();
              }
              break;
            default:
              console.error('Unknown payment event:', data.event);
          }
        }
      } catch (error) {
        console.error(`Error processing Kafka message on topic ${topic}:`, error);
      }
    },
  });
};

export const publishDriverSelection = async (driverId, orderId, driverDetails) => {
  try {
    await producer.send({
      topic: KAFKA_TOPICS.DRIVER_SELECTED,
      messages: [
        {
          value: JSON.stringify({
            driverId,
            orderId,
            driverDetails,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
    console.log(`Published driver-selected event for driver ${driverId} and order ${orderId}`);
  } catch (error) {
    console.error('Error publishing driver-selected event:', error);
    throw error;
  }
};