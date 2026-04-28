import urllib.request as r
import json
import urllib.error as e

url = 'https://smartoffice-1.onrender.com/api/v1/login/'
data = json.dumps({'username': 'admin', 'password': 'admin'}).encode('utf-8')
try:
    req = r.Request(url, data=data, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    res = r.urlopen(req)
    print("STATUS:", res.getcode())
    print("BODY:", res.read().decode())
except e.HTTPError as err:
    print("ERROR:", err.code)
    print(err.read().decode('utf-8'))
except Exception as ex:
    print("FATAL:", ex)
