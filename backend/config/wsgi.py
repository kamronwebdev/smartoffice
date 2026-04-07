import os
import sys

from django.core.wsgi import get_wsgi_application
from django.core.management import execute_from_command_line

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

print('Auto-migrating and collecting static files before running WSGI server...')
try:
    execute_from_command_line(['manage.py', 'migrate'])
    print('Migrate tugallandi.')
except Exception as e:
    print('Migrate xatolik berdi:', e)

try:
    execute_from_command_line(['manage.py', 'collectstatic', '--no-input'])
    print('Collectstatic tugallandi.')
except Exception as e:
    print('Collectstatic xatolik:', e)

try:
    os.system('python create_superuser.py')
    print('Admin tekshiruvi tugadi.')
except Exception as e:
    pass

application = get_wsgi_application()
