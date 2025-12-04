"""
Utility functions and helpers for the application
"""

import logging
import time
import functools
from typing import Any, Callable, Optional, Dict, List
import requests
from requests.exceptions import RequestException
from flask import jsonify

class APILogger:
    """Enhanced API logging with structured logging"""
    
    def __init__(self, log_file: str = None):
        self.logger = logging.getLogger(__name__)
        
        if log_file:
            handler = logging.FileHandler(log_file)
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
    
    def log_info(self, message: str, extra: Dict = None):
        """Log info message with structured data"""
        self.logger.info(message, extra=extra)
    
    def log_error(self, message: str, error: Exception = None, extra: Dict = None):
        """Log error with stack trace and context"""
        if error:
            self.logger.error(f"{message}: {str(error)}", exc_info=True, extra=extra)
        else:
            self.logger.error(message, extra=extra)
    
    def log_warning(self, message: str, extra: Dict = None):
        """Log warning message"""
        self.logger.warning(message, extra=extra)

def safe_api_request(url: str, params: Dict = None, headers: Dict = None, 
                     timeout: int = 30, method: str = 'GET') -> Optional[Dict]:
    """
    Make safe API requests with comprehensive error handling
    """
    try:
        if method.upper() == 'GET':
            response = requests.get(url, params=params, headers=headers, timeout=timeout)
        elif method.upper() == 'POST':
            response = requests.post(url, json=params, headers=headers, timeout=timeout)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        response.raise_for_status()
        return response.json()
        
    except RequestException as e:
        logger = APILogger()
        logger.log_error(f"API request failed to {url}", e, {
            'url': url,
            'params': params,
            'method': method
        })
        return None

def retry_api_call(max_retries: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """
    Decorator for retrying API calls with exponential backoff
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            current_delay = delay
            
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries == max_retries:
                        raise e
                    
                    logger = APILogger()
                    logger.log_warning(
                        f"Retry {retries}/{max_retries} for {func.__name__}",
                        e,
                        {'retry_count': retries, 'delay': current_delay}
                    )
                    
                    time.sleep(current_delay)
                    current_delay *= backoff
            
            return None
        return wrapper
    return decorator

def cache(ttl: int = 300):
    """
    Simple in-memory cache decorator
    """
    cache_store = {}
    
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            if cache_key in cache_store:
                cached_data, timestamp = cache_store[cache_key]
                if time.time() - timestamp < ttl:
                    return cached_data
            
            result = func(*args, **kwargs)
            cache_store[cache_key] = (result, time.time())
            return result
        
        return wrapper
    return decorator

def validate_coordinates(latitude: float, longitude: float) -> bool:
    """Validate geographic coordinates"""
    return (-90 <= latitude <= 90) and (-180 <= longitude <= 180)

def format_error_response(message: str, error_code: str = None, 
                         status_code: int = 400, details: Any = None):
    """Format consistent error responses"""
    response = {
        'success': False,
        'error': {
            'message': message,
            'code': error_code,
            'details': details
        }
    }
    
    return jsonify(response), status_code

def format_success_response(data: Any, message: str = None, 
                           status_code: int = 200):
    """Format consistent success responses"""
    response = {
        'success': True,
        'data': data,
        'message': message
    }
    
    return jsonify(response), status_code