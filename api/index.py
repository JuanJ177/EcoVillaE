# api/index.py - handler para Vercel (WSGI)
from app import app as application

# opcional, pero ayuda si en algún lado esperan "app"
app = application