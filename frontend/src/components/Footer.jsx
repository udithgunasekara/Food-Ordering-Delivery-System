import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and about */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">TastyEats</h3>
            <p className="text-gray-300 mb-4">
              Connecting food lovers with the best restaurants in town. 
              Fast delivery, fresh food, and an exceptional experience.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-primary">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary">Home</Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-300 hover:text-primary">Restaurants</Link>
              </li>
              <li>
                <Link to="/restaurant/register" className="text-gray-300 hover:text-primary">Partner with us</Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">Become a Delivery Driver</a>
              </li>
            </ul>
          </div>
          
          {/* Help & Support */}
          <div>
            <h3 className="text-xl font-bold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">Delivery Information</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary">Privacy Policy</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="text-primary mt-1 mr-2" />
                <span className="text-gray-300">123 Food Street, Cuisine City, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-primary mr-2" />
                <span className="text-gray-300">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-primary mr-2" />
                <span className="text-gray-300">support@tastyeats.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} TastyEats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;