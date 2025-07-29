import os
import re
import psycopg2
import geopandas as gpd
from shapely import wkb
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("POSTGRES_HOST")
DB_PORT = os.getenv("POSTGRES_PORT")
DB_NAME = os.getenv("POSTGRES_DB")
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")

# Carpeta de entrada de archivos
DIRECTORIO_GEOJSON = "../../../public/geojsons"

# Tabla destino en la base de datos
TABLA_DESTINO = "t_raster"

# Expresión regular para extraer el nivel del nombre de archivo
NIVEL_REGEX = re.compile(r"geom_(\d+)\.geojson")

contador_id = 1

def insertar_geometrias(geometria, nivel, conn):
    """Inserta una geometría, su nivel y un id autogenerado en la tabla t_raster."""
    global contador_id  # Usa el contador global para generar el id
    
    with conn.cursor() as cursor:
        # Insertar geometría, nivel y id en la base de datos
        cursor.execute(
            f"""
            INSERT INTO {TABLA_DESTINO} (id, geometry, level)
            VALUES (%s, ST_GeomFromText(%s, 4326), %s)
            """,
            (contador_id, geometria.wkt, nivel)
        )
    conn.commit()
    
    # Incrementa el contador de IDs
    contador_id += 1

def procesar_archivos_geojson():
    # Establece la conexión con la base de datos
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

    try:
        # Iterar sobre cada archivo en el directorio
        for nombre_archivo in os.listdir(DIRECTORIO_GEOJSON):
            if nombre_archivo.endswith(".geojson"):
                # Extraer nivel del nombre de archivo
                match = NIVEL_REGEX.match(nombre_archivo)
                if match:
                    nivel = int(match.group(1))

                    # Leer el archivo GeoJSON
                    archivo_geojson = os.path.join(DIRECTORIO_GEOJSON, nombre_archivo)
                    gdf = gpd.read_file(archivo_geojson)

                    # Insertar cada geometría en la base de datos
                    for geom in gdf.geometry:
                        insertar_geometrias(geom, nivel, conn)

                    print(f"Geometrías del archivo {nombre_archivo} insertadas con nivel {nivel}")

    finally:
        # Cerrar la conexión
        conn.close()

# Llamar a la función de procesamiento
procesar_archivos_geojson()
