import requests

def get_current_price(crop, state, market):
    """
    Fetch today’s AGMARKET modal price for the given crop/state/market
    using your local scraper API.
    """
    url = "http://127.0.0.1:5000/request"
    params = {
        "commodity": crop,
        "state": state,
        "market": market
    }
    resp = requests.get(url, params=params, timeout=10)
    data = resp.json()
    # Take the latest record’s modal price
    return float(data[0]["Modal Price"])
