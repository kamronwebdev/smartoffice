import urllib.request as r
import urllib.error as e
import json

urls = [
    'https://smartoffice-1.onrender.com/api/v1/',
    'https://smartoffice-1.onrender.com/api/v1/business-centers/'
]

for url in urls:
    print(f"Testing {url}...")
    try:
        req = r.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = r.urlopen(req)
        print(f"STATUS: {res.getcode()}")
        print(f"BODY: {res.read().decode()[:200]}...")
    except e.HTTPError as err:
        print(f"ERROR: {err.code}")
        body = err.read().decode('utf-8', errors='ignore')
        import re
        match = re.search(r'<title>(.*?)</title>', body, re.IGNORECASE)
        title = match.group(1) if match else 'No title'
        print(f"ERROR TITLE: {title}")
        if 'Exception Value:' in body:
            ex_val = body.split('Exception Value:')[1].split('</pre>')[0][:500].strip()
            print(f"EXCEPTION: {ex_val}")
    except Exception as ex:
        print(f"FATAL ERROR: {ex}")
    print("-" * 40)
