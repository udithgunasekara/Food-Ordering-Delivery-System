export const mockRestaurants = [
  {
    id: 'rest-1',
    name: 'Burger Heaven',
    description: 'The best burgers in town with fresh ingredients and homemade sauces.',
    cuisine: 'American',
    priceRange: '$$',
    rating: 4.8,
    reviewCount: 245,
    imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: {
      street: '123 Burger Ave',
      city: 'Foodville',
      state: 'CA',
      zipCode: '90210'
    },
    phone: '(555) 123-4567',
    website: 'https://burgerheavenexample.com',
    hours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '11:00 AM - 11:00 PM',
      sunday: '12:00 PM - 9:00 PM'
    },
    isOpen: true,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minimumOrder: 10.00,
    ownerId: 'user-2'
  },
  {
    id: 'rest-2',
    name: 'Pizza Paradise',
    description: 'Authentic Italian pizzas made in a wood-fired oven with premium toppings.',
    cuisine: 'Italian',
    priceRange: '$$',
    rating: 4.6,
    reviewCount: 189,
    imageUrl: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: {
      street: '456 Pizza Ln',
      city: 'Foodville',
      state: 'CA',
      zipCode: '90211'
    },
    phone: '(555) 987-6543',
    website: 'https://pizzaparadiseexample.com',
    hours: {
      monday: '12:00 PM - 10:00 PM',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 12:00 AM',
      saturday: '12:00 PM - 12:00 AM',
      sunday: '12:00 PM - 10:00 PM'
    },
    isOpen: true,
    deliveryTime: '30-45 min',
    deliveryFee: 1.99,
    minimumOrder: 15.00
  },
  {
    id: 'rest-3',
    name: 'Sushi Sensation',
    description: 'Fresh and high-quality sushi made by experienced Japanese chefs.',
    cuisine: 'Japanese',
    priceRange: '$$$',
    rating: 4.9,
    reviewCount: 312,
    imageUrl: 'https://images.pexels.com/photos/5900504/pexels-photo-5900504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: {
      street: '789 Sushi St',
      city: 'Foodville',
      state: 'CA',
      zipCode: '90212'
    },
    phone: '(555) 456-7890',
    website: 'https://sushisensationexample.com',
    hours: {
      monday: '11:30 AM - 10:00 PM',
      tuesday: '11:30 AM - 10:00 PM',
      wednesday: '11:30 AM - 10:00 PM',
      thursday: '11:30 AM - 10:00 PM',
      friday: '11:30 AM - 11:00 PM',
      saturday: '12:00 PM - 11:00 PM',
      sunday: '12:00 PM - 9:30 PM'
    },
    isOpen: true,
    deliveryTime: '35-50 min',
    deliveryFee: 3.99,
    minimumOrder: 20.00
  },
  {
    id: 'rest-4',
    name: 'Taco Time',
    description: 'Authentic Mexican street tacos and burritos with homemade salsa.',
    cuisine: 'Mexican',
    priceRange: '$',
    rating: 4.7,
    reviewCount: 178,
    imageUrl: 'https://images.pexels.com/photos/2092897/pexels-photo-2092897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: {
      street: '321 Taco Rd',
      city: 'Foodville',
      state: 'CA',
      zipCode: '90213'
    },
    phone: '(555) 789-0123',
    website: 'https://tacotimeexample.com',
    hours: {
      monday: '10:00 AM - 10:00 PM',
      tuesday: '10:00 AM - 10:00 PM',
      wednesday: '10:00 AM - 10:00 PM',
      thursday: '10:00 AM - 10:00 PM',
      friday: '10:00 AM - 12:00 AM',
      saturday: '10:00 AM - 12:00 AM',
      sunday: '11:00 AM - 9:00 PM'
    },
    isOpen: false,
    deliveryTime: '20-30 min',
    deliveryFee: 1.49,
    minimumOrder: 8.00
  },
  {
    id: 'rest-5',
    name: 'Thai Delight',
    description: 'Authentic Thai cuisine with fresh ingredients and bold flavors.',
    cuisine: 'Thai',
    priceRange: '$$',
    rating: 4.5,
    reviewCount: 156,
    imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: {
      street: '555 Thai Blvd',
      city: 'Foodville',
      state: 'CA',
      zipCode: '90214'
    },
    phone: '(555) 234-5678',
    website: 'https://thaidelightexample.com',
    hours: {
      monday: '11:00 AM - 9:30 PM',
      tuesday: '11:00 AM - 9:30 PM',
      wednesday: '11:00 AM - 9:30 PM',
      thursday: '11:00 AM - 9:30 PM',
      friday: '11:00 AM - 10:30 PM',
      saturday: '12:00 PM - 10:30 PM',
      sunday: '12:00 PM - 9:00 PM'
    },
    isOpen: true,
    deliveryTime: '30-40 min',
    deliveryFee: 2.49,
    minimumOrder: 15.00
  },
  {
    id: 'rest-6',
    name: 'Pasta Palace',
    description: 'Traditional Italian pasta dishes made with authentic recipes.',
    cuisine: 'Italian',
    priceRange: '$$',
    rating: 4.4,
    reviewCount: 132,
    imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: {
      street: '777 Pasta Ln',
      city: 'Foodville',
      state: 'CA',
      zipCode: '90215'
    },
    phone: '(555) 345-6789',
    website: 'https://pastapalaceexample.com',
    hours: {
      monday: '11:30 AM - 9:00 PM',
      tuesday: '11:30 AM - 9:00 PM',
      wednesday: '11:30 AM - 9:00 PM',
      thursday: '11:30 AM - 9:00 PM',
      friday: '11:30 AM - 10:00 PM',
      saturday: '12:00 PM - 10:00 PM',
      sunday: '12:00 PM - 8:30 PM'
    },
    isOpen: true,
    deliveryTime: '35-45 min',
    deliveryFee: 2.99,
    minimumOrder: 18.00
  }
];

export const mockMenuItems = {
  'rest-1': [
    {
      id: 'item-1-1',
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, onion, and our special sauce on a brioche bun.',
      price: 9.99,
      imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Burgers',
      popular: true,
      options: [
        {
          id: 'option-1-1-1',
          name: 'Cheese Type',
          required: false,
          multiSelect: false,
          choices: [
            { id: 'choice-1-1-1-1', name: 'American', price: 0.99 },
            { id: 'choice-1-1-1-2', name: 'Cheddar', price: 0.99 },
            { id: 'choice-1-1-1-3', name: 'Swiss', price: 1.29 }
          ]
        },
        {
          id: 'option-1-1-2',
          name: 'Add-ons',
          required: false,
          multiSelect: true,
          choices: [
            { id: 'choice-1-1-2-1', name: 'Bacon', price: 1.99 },
            { id: 'choice-1-1-2-2', name: 'Avocado', price: 1.49 },
            { id: 'choice-1-1-2-3', name: 'Fried Egg', price: 1.29 }
          ]
        }
      ]
    },
    {
      id: 'item-1-2',
      name: 'BBQ Bacon Burger',
      description: 'Beef patty topped with BBQ sauce, crispy bacon, cheddar cheese, and onion rings.',
      price: 12.99,
      imageUrl: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Burgers',
      popular: true,
      options: [
        {
          id: 'option-1-2-1',
          name: 'Cooking Preference',
          required: true,
          multiSelect: false,
          choices: [
            { id: 'choice-1-2-1-1', name: 'Medium Rare', price: 0 },
            { id: 'choice-1-2-1-2', name: 'Medium', price: 0 },
            { id: 'choice-1-2-1-3', name: 'Well Done', price: 0 }
          ]
        }
      ]
    },
    {
      id: 'item-1-3',
      name: 'Veggie Burger',
      description: 'Plant-based patty with lettuce, tomato, red onion, and vegan mayo on a whole wheat bun.',
      price: 10.99,
      imageUrl: 'https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Vegetarian',
      popular: false,
      options: []
    },
    {
      id: 'item-1-4',
      name: 'French Fries',
      description: 'Crispy golden fries seasoned with sea salt.',
      price: 3.99,
      imageUrl: 'https://images.pexels.com/photos/1893555/pexels-photo-1893555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Sides',
      popular: true,
      options: [
        {
          id: 'option-1-4-1',
          name: 'Size',
          required: true,
          multiSelect: false,
          choices: [
            { id: 'choice-1-4-1-1', name: 'Regular', price: 0 },
            { id: 'choice-1-4-1-2', name: 'Large', price: 1.50 }
          ]
        },
        {
          id: 'option-1-4-2',
          name: 'Dipping Sauce',
          required: false,
          multiSelect: true,
          choices: [
            { id: 'choice-1-4-2-1', name: 'Ketchup', price: 0 },
            { id: 'choice-1-4-2-2', name: 'Ranch', price: 0.50 },
            { id: 'choice-1-4-2-3', name: 'Garlic Aioli', price: 0.50 }
          ]
        }
      ]
    },
    {
      id: 'item-1-5',
      name: 'Chocolate Milkshake',
      description: 'Creamy chocolate milkshake topped with whipped cream and a cherry.',
      price: 5.99,
      imageUrl: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Beverages',
      popular: false,
      options: []
    }
  ],
  'rest-2': [
    {
      id: 'item-2-1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil.',
      price: 12.99,
      imageUrl: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Pizzas',
      popular: true,
      options: [
        {
          id: 'option-2-1-1',
          name: 'Size',
          required: true,
          multiSelect: false,
          choices: [
            { id: 'choice-2-1-1-1', name: 'Small (10")', price: 0 },
            { id: 'choice-2-1-1-2', name: 'Medium (14")', price: 4.00 },
            { id: 'choice-2-1-1-3', name: 'Large (18")', price: 8.00 }
          ]
        },
        {
          id: 'option-2-1-2',
          name: 'Crust Type',
          required: true,
          multiSelect: false,
          choices: [
            { id: 'choice-2-1-2-1', name: 'Thin', price: 0 },
            { id: 'choice-2-1-2-2', name: 'Hand Tossed', price: 0 },
            { id: 'choice-2-1-2-3', name: 'Stuffed Crust', price: 2.00 }
          ]
        }
      ]
    },
    {
      id: 'item-2-2',
      name: 'Pepperoni Pizza',
      description: 'Tomato sauce, mozzarella cheese, and pepperoni slices.',
      price: 14.99,
      imageUrl: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Pizzas',
      popular: true,
      options: [
        {
          id: 'option-2-2-1',
          name: 'Size',
          required: true,
          multiSelect: false,
          choices: [
            { id: 'choice-2-2-1-1', name: 'Small (10")', price: 0 },
            { id: 'choice-2-2-1-2', name: 'Medium (14")', price: 4.00 },
            { id: 'choice-2-2-1-3', name: 'Large (18")', price: 8.00 }
          ]
        }
      ]
    },
    {
      id: 'item-2-3',
      name: 'Garlic Knots',
      description: 'Soft bread knots brushed with garlic butter and sprinkled with parmesan.',
      price: 5.99,
      imageUrl: 'https://images.pexels.com/photos/6941010/pexels-photo-6941010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Appetizers',
      popular: false,
      options: []
    },
    {
      id: 'item-2-4',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, croutons, parmesan cheese, and our signature Caesar dressing.',
      price: 7.99,
      imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Salads',
      popular: false,
      options: []
    },
    {
      id: 'item-2-5',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
      price: 6.99,
      imageUrl: 'https://images.pexels.com/photos/6249501/pexels-photo-6249501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Desserts',
      popular: true,
      options: []
    }
  ]
};

export const mockRestaurantRequests = [
  {
    id: 'req-1',
    name: 'Green Garden Veggie',
    description: 'Farm-to-table vegetarian cuisine with locally sourced ingredients.',
    cuisine: 'Vegetarian',
    address: {
      street: '789 Veggie Way',
      city: 'Greenville',
      state: 'CA',
      zipCode: '92345'
    },
    ownerName: 'Sarah Green',
    ownerEmail: 'sarah@greengarden.com',
    ownerPhone: '(555) 987-1234',
    status: 'pending',
    submissionDate: '2023-05-15T10:30:00Z',
    documents: {
      businessLicense: 'uploaded',
      foodPermit: 'uploaded',
      identityProof: 'uploaded'
    }
  },
  {
    id: 'req-2',
    name: 'Spice Route Indian',
    description: 'Authentic Indian cuisine with traditional recipes and spices.',
    cuisine: 'Indian',
    address: {
      street: '456 Curry Lane',
      city: 'Spicetown',
      state: 'CA',
      zipCode: '91234'
    },
    ownerName: 'Raj Patel',
    ownerEmail: 'raj@spiceroute.com',
    ownerPhone: '(555) 456-7890',
    status: 'approved',
    submissionDate: '2023-04-10T14:45:00Z',
    approvalDate: '2023-04-15T09:20:00Z',
    documents: {
      businessLicense: 'approved',
      foodPermit: 'approved',
      identityProof: 'approved'
    }
  },
  {
    id: 'req-3',
    name: 'Seoul Food Korean BBQ',
    description: 'Interactive Korean BBQ experience with authentic flavors.',
    cuisine: 'Korean',
    address: {
      street: '123 Seoul Street',
      city: 'Koreatown',
      state: 'CA',
      zipCode: '93456'
    },
    ownerName: 'Min-Ji Kim',
    ownerEmail: 'minji@seoulfood.com',
    ownerPhone: '(555) 789-4567',
    status: 'rejected',
    submissionDate: '2023-06-01T11:15:00Z',
    rejectionDate: '2023-06-05T16:30:00Z',
    rejectionReason: 'Incomplete documentation - missing food safety certificates',
    documents: {
      businessLicense: 'uploaded',
      foodPermit: 'missing',
      identityProof: 'uploaded'
    }
  }
];