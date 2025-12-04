def get_location_info(lat, lon):
    """Get location information using multiple geocoding services for precision"""
    
    # Try Method 1: Nominatim (OpenStreetMap) - Most accurate for Indian locations
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=18&addressdetails=1"
        headers = {'User-Agent': 'CropRecommendationApp/1.0'}
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'address' in data:
                address = data['address']
                logger.info(f"Nominatim response: {address}")
                
                # Extract location components
                area = (address.get('city') or 
                       address.get('town') or 
                       address.get('municipality') or
                       address.get('suburb') or
                       address.get('village') or
                       address.get('neighbourhood') or 'Unknown Area')
                
                district = (address.get('state_district') or
                           address.get('county') or 
                           address.get('administrative_area_level_2') or 'Unknown District')
                
                state = (address.get('state') or
                        address.get('administrative_area_level_1') or 'Unknown State')
                
                country = address.get('country', 'India')
                
                return {
                    "area": area,
                    "district": district,
                    "state": state,
                    "country": country
                }
    except Exception as e:
        logger.error(f"Nominatim geocoding error: {e}")
    
    # Try Method 2: BigDataCloud (Free, accurate for India)
    try:
        url = f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lon}&localityLanguage=en"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"BigDataCloud response: {data}")
            
            area = (data.get('city') or 
                   data.get('locality') or 
                   data.get('localityInfo', {}).get('administrative', [{}])[0].get('name') or 'Unknown Area')
            
            # Get district from administrative levels
            admin_levels = data.get('localityInfo', {}).get('administrative', [])
            district = 'Unknown District'
            state = 'Unknown State'
            
            for level in admin_levels:
                admin_level = level.get('adminLevel', 0)
                if admin_level == 4:  # District level in India
                    district = level.get('name', district)
                elif admin_level == 2:  # State level in India
                    state = level.get('name', state)
            
            # Fallback to principalSubdivision
            if district == 'Unknown District':
                district = data.get('principalSubdivision', 'Unknown District')
            if state == 'Unknown State':
                state = data.get('principalSubdivision', 'Unknown State')
            
            return {
                "area": area,
                "district": district,
                "state": state,
                "country": data.get('countryName', 'India')
            }
    except Exception as e:
        logger.error(f"BigDataCloud geocoding error: {e}")
    
    # Try Method 3: OpenWeatherMap Geocoding
    try:
        url = f"https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={OPENWEATHER_API_KEY}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                location_data = data[0]
                logger.info(f"OpenWeatherMap response: {location_data}")
                
                return {
                    "area": location_data.get('name', 'Unknown Area'),
                    "district": location_data.get('state', 'Unknown District'),
                    "state": location_data.get('country', 'India'),
                    "country": "India"
                }
    except Exception as e:
        logger.error(f"OpenWeatherMap geocoding error: {e}")
    
    # Try Method 4: Google-style geocoding with another service
    try:
        url = f"https://api.geoapify.com/v1/geocode/reverse?lat={lat}&lon={lon}&format=json&apiKey=demo"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 0:
                result = data['results'][0]
                logger.info(f"Geoapify response: {result}")
                
                area = (result.get('city') or 
                       result.get('town') or 
                       result.get('municipality') or
                       result.get('suburb') or 'Unknown Area')
                
                district = (result.get('county') or 
                           result.get('state_district') or 'Unknown District')
                
                state = result.get('state', 'Unknown State')
                
                return {
                    "area": area,
                    "district": district,
                    "state": state,
                    "country": result.get('country', 'India')
                }
    except Exception as e:
        logger.error(f"Geoapify geocoding error: {e}")
    
    # Final fallback - return coordinates info
    logger.warning(f"All geocoding services failed for {lat}, {lon}")
    return {
        "area": f"Location {lat:.3f}°N, {lon:.3f}°E",
        "district": "Unknown District",
        "state": "Unknown State",
        "country": "India"
    }