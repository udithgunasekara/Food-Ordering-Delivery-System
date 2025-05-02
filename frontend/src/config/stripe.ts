import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe('pk_test_51RHmKnRLHTWS66gqF2SQ8RQGFgpiuaaAM6j5hVOATCTcdjC3ZcqfQwHJvIZTx9jtfO88wrUbZttlTJoYHPPTVNnB00eY48e2Xn');