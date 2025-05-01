import { Eureka } from 'eureka-js-client';
import { EUREKA } from './config.js';

const eurekaClient = new Eureka({
  instance: {
    app: EUREKA.appName,
    hostName: EUREKA.instanceHost,
    ipAddr: 'notification-service', // Docker resolves service names, so this is fine
    port: {
      $: EUREKA.instancePort,
      '@enabled': true,
    },
    vipAddress: EUREKA.appName,
    statusPageUrl: EUREKA.healthCheckUrl,
    healthCheckUrl: EUREKA.healthCheckUrl,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: EUREKA.host,
    port: EUREKA.port,
    servicePath: EUREKA.servicePath,
    maxRetries: 5,
    requestRetryDelay: 2000,
  },
});

export const startEureka = () => {
  eurekaClient.start((error) => {
    if (error) {
      console.error('Failed to register with Eureka:', error);
    } else {
      console.log('Registered with Eureka successfully');
    }
  });
};

export const stopEureka = () => {
  eurekaClient.stop((error) => {
    if (error) {
      console.error('Failed to deregister from Eureka:', error);
    } else {
      console.log('Deregistered from Eureka successfully');
    }
  });
};

export const getEurekaClient = () => eurekaClient;