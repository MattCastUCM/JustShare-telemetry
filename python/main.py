import os
import pandas as pd
import json

filesPath = "./trazas/"
filesExtension = "json"


def getLastValueUri(value):
	if isinstance(value, str) and '/' in value:
		return value.rsplit('/', 1)[-1]
	else: 
		return value


def getEventsBetweenLastFirstAndFirstSecond(dataframe, objectId, firstVerb, lastVerb):
	# Buscar el primer y ultimo indice de la fila
	start_idx = dataframe[(dataframe["object.id"] == objectId) & (dataframe["verb.id"] == firstVerb)].index[-1]
	end_idx = dataframe[(dataframe["object.id"] == objectId) & (dataframe["verb.id"] == lastVerb)].index[0]

	print(objectId, firstVerb, lastVerb)
	print(start_idx, end_idx)

	# Se juntan todas las filas entre ambos eventos
	data = pd.DataFrame()
	data = pd.concat([data, dataframe[start_idx:end_idx + 1]], ignore_index=True)
	
	# display(data)
	return data



# Cargar en un dataframe todos los archivos de un formato especifico del directorio
def loadAllFiles(path, extension = "json", sortBy = "eventId"):
	allFilesDf = pd.DataFrame()

	# Recorrer todos los archivos del directorio
	for file_name in os.listdir(path):

		# Si el archivo tiene la extension indicada
		if (file_name.endswith(extension)):
			fileDf = pd.DataFrame()	

			# Intenta leer el archivo. Si hay algun error, el dataframe estara vacio

			try:
				if (extension == "json"):
					with open(path + file_name) as f:
						# Cargar json
						file = json.load(f)
						fileDf = pd.json_normalize(file)
						# Eliminar columnas que no se van a usar
						fileDf = fileDf.drop(columns=["verb.display.en-US", "id", "stored", "version", "actor.objectType", "actor.account.homePage", "actor.account.name", "result.success", "result.completion", "context.registration", "authority.objectType", "authority.account.homePage", "authority.account.name", "authority.name", "object.definition.description.en-US", "object.definition.name.en-US", "object.objectType", "context.contextActivities.category"])
		
						# Quedarse solo con la ultima palabra de las uris (tanto en los titulos de las columnas como el los valores de las mismas)
						for column in fileDf.columns:
							fileDf[column] = fileDf[column].map(getLastValueUri)
							fileDf = fileDf.rename(columns={column: getLastValueUri(column)})
						
						
			except:
				pass

			# Si el dataframe esta vacio
			if (not fileDf.empty):
				# Se ordenan los eventos (por defecto por eventId)
				fileDf['timestamp'] = pd.to_datetime(fileDf['timestamp'])
				fileDf = fileDf.sort_values(by=[sortBy])
				fileDf = fileDf.reset_index(drop=True)
				fileDf = getEventsBetweenLastFirstAndFirstSecond(fileDf, "Session", "initialized", "completed")
				
				# Se unen los datasets
				allFilesDf = pd.concat([allFilesDf, fileDf], ignore_index=True)

	return allFilesDf



display(loadAllFiles(filesPath, filesExtension, "timestamp"))


def getEventsBetweenDifferentParameters(dataframe, parameter1, parameter2, firstPValue, secondPValue):
	# Buscar el primer y ultimo indice de la fila
	start_idx = dataframe[dataframe[parameter1] == firstPValue].index
	end_idx = dataframe[dataframe[parameter2] == secondPValue].index

	# Se juntan todas las filas entre ambos eventos
	data = pd.DataFrame()
	for i, j in zip(start_idx, end_idx):
		data = pd.concat([data, dataframe[i:j + 1]], ignore_index=True)

	return data




