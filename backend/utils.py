import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(BASE_DIR, 'logs')
os.makedirs(LOG_DIR, exist_ok=True)

import logging
import requests
from functools import wraps
import time
from typing import Dict, Any, Optional
import json

class APILogger:
    def __init__(self, log_file: str):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def log_api_call(self, api_name: str, params: Dict, response_status: int):
        self.logger.info(f"API Call: {api_name} | Params: {params} | Status: {response_status}")
    
    def log_error(self, error_msg: str, exception: Exception = None):
        if exception:
            self.logger.error(f"Error: {error_msg} | Exception: {str(exception)}")
        else:
            self.logger.error(f"Error: {error_msg}")

def retry_api_call(max_retries: int = 3, delay: float = 1.0):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    result = func(*args, **kwargs)
                    if result and result.get('success', True):
                        return result
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise e
                    time.sleep(delay * (2 ** attempt))
            return None
        return wrapper
    return decorator

def validate_coordinates(lat: float, lon: float) -> bool:
    return -90 <= lat <= 90 and -180 <= lon <= 180

def safe_api_request(url: str, params: Dict, timeout: int = 30) -> Optional[Dict]:
    try:
        response = requests.get(url, params=params, timeout=timeout)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger = APILogger("logs/api_errors.log")
        logger.log_error(f"API request failed: {url}", e)
        return None
    except json.JSONDecodeError as e:
        logger = APILogger("logs/api_errors.log")
        logger.log_error(f"JSON decode error for: {url}", e)
        return None

class DataCache:
    def __init__(self, timeout: int = 300):
        self.cache = {}
        self.timeout = timeout
    
    def get(self, key: str) -> Optional[Any]:
        if key in self.cache:
            data, timestamp = self.cache[key]
            if time.time() - timestamp < self.timeout:
                return data
            else:
                del self.cache[key]
        return None
    
    def set(self, key: str, value: Any):
        self.cache[key] = (value, time.time())
    
    def clear(self):
        self.cache.clear()

cache = DataCache()