import { Kafka } from 'kafkajs';

// Initialize Kafka client
const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['localhost:29092'],
});

// Create a producer
const producer = kafka.producer();

// Multiple sample messages where driver1 (DRV001) gets 3 orders
const sampleMessages = [
  {
    deliveryId: "DEL123456",
    orderDetails: {
      id: "ORD23",
      customerId: "CUST001",
      restaurantId: "REST001",
      items: [
        {
          itemId: "ITEM001",
          name: "Burger",
          price: 5.99,
          quantity: 2,
          totalPrice: 11.98
        },
        {
          itemId: "ITEM002",
          name: "Fries",
          price: 2.99,
          quantity: 1,
          totalPrice: 2.99
        }
      ],
      totalPrice: 14.97,
      paymentStatus: "PAID",
      orderStatus: "PREPARING",
      placeAt: "2025-05-02T10:15:30Z",
      updatedAt: "2025-05-02T10:45:00Z"
    },
    DriverDetails: [
      {
        id: "DRV001",
        email: "driver1@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        Latitude: "6.9271",
        Longitude: "79.8612"
      }
    ]
  },
  {
    deliveryId: "DEL123457",
    orderDetails: {
      id: "ORD987655",
      customerId: "CUST002",
      restaurantId: "REST002",
      items: [
        {
          itemId: "ITEM003",
          name: "Pizza",
          price: 12.50,
          quantity: 1,
          totalPrice: 12.50
        }
      ],
      totalPrice: 12.50,
      paymentStatus: "PAID",
      orderStatus: "PREPARING",
      placeAt: "2025-05-02T11:00:00Z",
      updatedAt: "2025-05-02T11:15:00Z"
    },
    DriverDetails: [
      {
        id: "DRV001",
        email: "driver1@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        Latitude: "6.9271",
        Longitude: "79.8612"
      }
    ]
  },
  {
    deliveryId: "DEL123458",
    orderDetails: {
      id: "ORD22",
      customerId: "CUST003",
      restaurantId: "REST003",
      items: [
        {
          itemId: "ITEM004",
          name: "Pasta",
          price: 8.99,
          quantity: 1,
          totalPrice: 8.99
        },
        {
          itemId: "ITEM005",
          name: "Garlic Bread",
          price: 3.99,
          quantity: 1,
          totalPrice: 3.99
        }
      ],
      totalPrice: 12.98,
      paymentStatus: "PAID",
      orderStatus: "PREPARING",
      placeAt: "2025-05-02T11:30:00Z",
      updatedAt: "2025-05-02T11:50:00Z"
    },
    DriverDetails: [
      {
        id: "DRV001",
        email: "driver1@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        Latitude: "6.9271",
        Longitude: "79.8612"
      }
    ]
  }
];

// Function to send the messages
const sendMessage = async () => {
  try {
    await producer.connect();
    console.log('Producer connected');

    const kafkaMessages = sampleMessages.map(msg => ({
      value: JSON.stringify(msg),
    }));

    await producer.send({
      topic: 'nearby_drivers',
      messages: kafkaMessages,
    });

    console.log(`Sent ${kafkaMessages.length} messages to nearby_drivers topic`);
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
    console.log('Producer disconnected');
  }
};

// Run the producer
sendMessage();
