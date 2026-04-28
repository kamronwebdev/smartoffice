import urllib.request as r
import urllib.error as e
import json

# Login first
url = 'https://smartoffice-1.onrender.com/api/v1/login/'
data = json.dumps({'username': 'admin', 'password': 'admin'}).encode('utf-8')
req = r.Request(url, data=data, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
res = r.urlopen(req)
token = json.loads(res.read().decode())['access']

url_get = 'https://smartoffice-1.onrender.com/api/v1/business-centers/?managed_by_me=true'
req_get = r.Request(url_get, headers={'Authorization': 'Bearer ' + token, 'User-Agent': 'Mozilla/5.0'})
res_get = r.urlopen(req_get)
print("STATUS:", res_get.getcode())
print("BODY:", res_get.read().decode())
