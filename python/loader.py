import os
import pandas as pd
import json

# Obtener la ultima parte de una URI (que determina el tipo)
def get_last_value_uri(value):
	if isinstance(value, str) and '/' in value:
		return value.rsplit('/', 1)[-1]
	else: 
		return value

# Encontrar todos los eventos de un objeto dentro de un primer verbo y un ultimo verbo
# Se usa para obtener todos los eventos que se ejecutan en una sesion
def get_events_between_last_first_and_first_second(dataframe, objectId, firstVerb, lastVerb):
	# Buscar el primer y ultimo indice de la fila
	start_idx = dataframe[(dataframe["object.id"] == objectId) & (dataframe["verb.id"] == firstVerb)].index[-1]
	end_idx = dataframe[(dataframe["object.id"] == objectId) & (dataframe["verb.id"] == lastVerb)].index[0]

	# Se juntan todas las filas entre ambos eventos
	data = pd.DataFrame()
	data = pd.concat([data, dataframe[start_idx:end_idx + 1]], ignore_index=True)

	return data

# Cargar en un dataframe todos los archivos de un formato especifico del directorio
def loadAllFiles(path, extension = "json", sortBy = "eventId", drop_cols = []):
	all_files_df = pd.DataFrame()
	df_list= []
	# Recorrer todos los archivos del directorio
	for file_name in os.listdir(path):

		# Si el archivo tiene la extension indicada
		if (file_name.endswith(extension)):
			file_df = pd.DataFrame()	

			# Intenta leer el archivo. Si hay algun error, el dataframe estara vacio
			try:
				if (extension == "json"):
					with open(path + file_name) as f:
						# Cargar json
						file = json.load(f)
						file_df = pd.json_normalize(file)

						# Eliminar columnas que no se van a usar
						file_df = file_df.drop(columns=drop_cols)

						# Quedarse solo con la ultima palabra de las uris (tanto en los titulos de las columnas como el los valores de las mismas)
						for column in file_df.columns:
							file_df[column] = file_df[column].map(get_last_value_uri)
							file_df = file_df.rename(columns={column: get_last_value_uri(column)})
						
			except:
				print("Error reading file")
				pass

			# Si el dataframe esta vacio
			if (not file_df.empty):
				# Se ordenan los eventos (por defecto por eventId)
				file_df['timestamp'] = pd.to_datetime(file_df['timestamp'])
				file_df = file_df.sort_values(by=[sortBy])
				file_df = file_df.reset_index(drop=True)
				file_df = get_events_between_last_first_and_first_second(file_df, "Session", "initialized", "completed")
				df_list.append(file_df)
				# Se unen los datasets
				all_files_df = pd.concat([all_files_df, file_df], ignore_index=True)

	return all_files_df, df_list