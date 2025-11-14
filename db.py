# db.py - conexión PostgreSQL para Vercel y local
import psycopg2
import os


def get_connection():
    """
    Crea una nueva conexión a PostgreSQL usando variables de entorno.
    En Vercel configura:
      PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE=require
    """
    conn = psycopg2.connect(
        host=os.getenv("PGHOST"),
        port=os.getenv("PGPORT", 5432),
        database=os.getenv("PGDATABASE"),
        user=os.getenv("PGUSER"),
        password=os.getenv("PGPASSWORD"),
        sslmode=os.getenv("PGSSLMODE", "require"),
    )
    return conn
