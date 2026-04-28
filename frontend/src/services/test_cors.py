import urllib.request as r
import urllib.error as e

url = 'https://smartoffice-1.onrender.com/api/v1/business-centers/'
req = r.Request(url, method='OPTIONS', headers={
    'Origin': 'https://smartoffice-virid.vercel.app',
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'Authorization',
    'User-Agent': 'Mozilla/5.0'
})

try:
    res = r.urlopen(req)
    print("STATUS:", res.getcode())
    print("HEADERS:")
    for k, v in res.getheaders():
        if 'access-control' in k.lower():
            print(f"  {k}: {v}")
except e.HTTPError as err:
    print("ERROR:", err.code)
