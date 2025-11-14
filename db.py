# db.py - conexión PostgreSQL para Vercel y local con Neon
import psycopg2
import os


def get_connection():
    """
    Crea una nueva conexión a PostgreSQL usando variables de entorno.

    En Vercel (Environment Variables) debes configurar:
      PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE=require
    """
    conn = psycopg2.connect(
        host=os.environ["PGHOST"],
        port=os.environ.get("PGPORT", 5432),
        database=os.environ["PGDATABASE"],
        user=os.environ["PGUSER"],
        password=os.environ["PGPASSWORD"],
        sslmode=os.environ.get("PGSSLMODE", "require"),
    )
    return conn
