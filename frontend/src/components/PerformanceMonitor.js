import { useEffect, useRef } from 'react';

const PerformanceMonitor = () => {
  const metricsRef = useRef({
    navigation: null,
    paint: null,
    resource: null,
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null
  });

  useEffect(() => {
    const observers = [];
    let memoryInterval;

    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          metricsRef.current.fcp = entry.startTime;
          console.log('FCP:', entry.startTime);
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      observers.push(fcpObserver);

      const lcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          metricsRef.current.lcp = entry.startTime;
          console.log('LCP:', entry.startTime);
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observers.push(lcpObserver);

      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            metricsRef.current.cls = (metricsRef.current.cls || 0) + entry.value;
            console.log('CLS:', metricsRef.current.cls);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observers.push(clsObserver);

      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          metricsRef.current.fid = entry.processingStart - entry.startTime;
          console.log('FID:', metricsRef.current.fid);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observers.push(fidObserver);

      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          metricsRef.current.navigation = entry;
          metricsRef.current.ttfb = entry.responseStart - entry.requestStart;
          console.log('TTFB:', metricsRef.current.ttfb);
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      observers.push(navigationObserver);

      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          metricsRef.current.resource = entry;
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      observers.push(resourceObserver);
    }

    if ('PerformanceLongTaskTiming' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('Long task detected:', entry.duration);
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      observers.push(longTaskObserver);
    }

    if ('memory' in performance) {
      const monitorMemory = () => {
        const memory = performance.memory;
        console.log('Memory usage:', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      };
      memoryInterval = setInterval(monitorMemory, 10000);
    }

    const metricsSnapshot = metricsRef.current;

    return () => {
      observers.forEach((observer) => observer.disconnect?.());
      if (memoryInterval) {
        clearInterval(memoryInterval);
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'performance_metrics', {
          fcp: metricsSnapshot.fcp,
          lcp: metricsSnapshot.lcp,
          cls: metricsSnapshot.cls,
          fid: metricsSnapshot.fid,
          ttfb: metricsSnapshot.ttfb
        });
      }
    };
  }, []);

  return null;
};

export default PerformanceMonitor;