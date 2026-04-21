import os
from dotenv import load_dotenv

load_dotenv()

USER = os.getenv('USER')
PASSWORD = os.getenv('PASS')
EMAIL = os.getenv('EMAIL')
BASE_URL = os.getenv('BASE_URL')
DAISYUSER = os.getenv('DAISYUSER')
DAISYPASS = os.getenv('DAISYPASS')
DAISYEMAIL = os.getenv('DAISYEMAIL')