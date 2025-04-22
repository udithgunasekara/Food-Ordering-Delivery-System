import { Kafka } from 'kafkajs';

     const kafka = new Kafka({
       clientId: 'test-producer',
       brokers: ['localhost:9092'],
     });

     const producer = kafka.producer();

     const sendMessage = async () => {
       await producer.connect();
       await producer.send({
         topic: 'order-placed',
         messages: [
           {
             value: JSON.stringify({
               orderId: '12345',
               customerEmail: 'test@example.com',
               customerPhone: '+1234567890',
             }),
           },
         ],
       });
       await producer.send({
         topic: 'delivery-assigned',
         messages: [
           {
             value: JSON.stringify({
               orderId: '12345',
               driverPhone: '+1234567890',
             }),
           },
         ],
       });
       await producer.disconnect();
     };

     sendMessage().catch(console.error);