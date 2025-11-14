# db.py - conexión simple con psycopg2
import psycopg2
import os

def get_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv("PGHOST", "localhost"),
            port=int(os.getenv("PGPORT", 5432)),
            database=os.getenv("PGDATABASE", "proyect13"),
            user=os.getenv("PGUSER", "postgres"),
            password=os.getenv("PGPASSWORD", "921535")
        )
        return conn
    except Exception as e:
        print("Error de conexión a la DB:", e)
        raise
