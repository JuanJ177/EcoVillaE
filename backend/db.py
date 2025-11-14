import pg8000
import os

def get_connection():
    return pg8000.connect(
        host=os.getenv("PGHOST", "localhost"),
        port=int(os.getenv("PGPORT", 5432)),
        database=os.getenv("PGDATABASE", "proyect13"),
        user=os.getenv("PGUSER", "postgres"),
        password=os.getenv("PGPASSWORD", "921535")
    )
