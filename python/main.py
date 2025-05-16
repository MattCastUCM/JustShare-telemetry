import os
import pandas as pd
import json
import matplotlib.pyplot as plt

filesPath = "./trazas/"
filesExtension = "json"

def display_pie_chart(values, labels, title='undefined :(',
                      figsize=(6, 6),label_fontsize=12,pct_fontsize=10):
   
    fig, ax = plt.subplots(figsize=figsize)

    wedges, texts, autotexts = ax.pie(
        values,
        labels=labels,
        autopct='%1.1f%%',
        startangle=90
    )

    for text in texts:
        text.set_fontsize(label_fontsize)
    for autotext in autotexts:
        autotext.set_fontsize(pct_fontsize)

    ax.set_title(title, fontsize=label_fontsize + 2)
    ax.axis('equal') 
    #ax.set_aspect('equal')
    plt.show()


def plot_bar_chart(df, title, ylabel, xlabel, bar_color):
    ax = df.plot(kind="bar", legend=False, color=bar_color, figsize=(8, 6))
    for p in ax.patches:
        ax.annotate(f'{p.get_height()}', (p.get_x() + p.get_width() / 2., p.get_height()), ha='center', va='center', xytext=(0, 10), textcoords='offset points')
    plt.title(title)
    plt.ylabel(ylabel)
    plt.xlabel(xlabel)
    plt.xticks(rotation=0)
    plt.show()


def find_indices_by_conditions(df, conditions):
    mask = pd.Series([True] * len(df), index=df.index)
    for col, val in conditions:
        mask &= df[col] == val
    return df[mask].index.tolist()

def find_first_index_by_conditions(df, conditions):
    indices = find_indices_by_conditions(df, conditions)
    return indices[0] if indices else None

def time_between_indices(df, index1, index2):
    t1 = pd.to_datetime(df.loc[index1, 'timestamp'])
    t2 = pd.to_datetime(df.loc[index2, 'timestamp'])
    delta = t2 - t1
    return abs(delta.total_seconds()) 

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
	df_list= []
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
						fileDf = fileDf.drop(columns=["verb.display.en-US", "id", "stored", "version", "actor.objectType", "actor.account.homePage", "result.success", "result.completion", "context.registration", "authority.objectType", "authority.account.homePage", "authority.account.name", "authority.name", "object.definition.description.en-US", "object.definition.name.en-US", "object.objectType", "context.contextActivities.category"])
		
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
				df_list.append(fileDf)
				# Se unen los datasets
				allFilesDf = pd.concat([allFilesDf, fileDf], ignore_index=True)

	return allFilesDf,df_list

def get_n_users(df):
    account_names = df["actor.account.name"]
    names = set(name for name in account_names)
    return len(names)

def getEventsBetweenDifferentParameters(dataframe, parameter1, parameter2, firstPValue, secondPValue):
	# Buscar el primer y ultimo indice de la fila
	start_idx = dataframe[dataframe[parameter1] == firstPValue].index
	end_idx = dataframe[dataframe[parameter2] == secondPValue].index

	# Se juntan todas las filas entre ambos eventos
	data = pd.DataFrame()
	for i, j in zip(start_idx, end_idx):
		data = pd.concat([data, dataframe[i:j + 1]], ignore_index=True)

	return data


############################
# Datos comunes
# Sacado de los JSONs
############################
df,df_list = loadAllFiles(filesPath, filesExtension, "timestamp")
display(df)
n_users = get_n_users(df)




############################
# APARTADO 2ai,
# Media de tiempo de juego total
############################
def average_total_time(sessions):
    durations  = []
    start_conditions = [('object.id', 'Session'), ('verb.id', 'initialized')]
    end_conditions = [('object.id', 'Session'), ('verb.id', 'completed')]
    for df in sessions:
        start_idx = find_first_index_by_conditions(df, start_conditions)
        end_idx = find_first_index_by_conditions(df, end_conditions)
        d= time_between_indices(df,start_idx,end_idx)
        durations.append(d)
    return sum(durations ) / len(durations ) if durations  else 0

print(average_total_time(df_list))
############################
# APARTADO 2aii,
# Media de tiempo de juego desde que se pasa de la pantalla de login
############################
def average_login_time(sessions):
    durations  = []
    start_conditions = [('object.id', 'Game'), ('verb.id', 'initialized')]
    end_conditions = [('object.id', 'Session'), ('verb.id', 'completed')]
    for df in sessions:
        start_idx = find_first_index_by_conditions(df, start_conditions)
        end_idx = find_first_index_by_conditions(df, end_conditions)
        d= time_between_indices(df,start_idx,end_idx)
        durations.append(d)
    return sum(durations ) / len(durations ) if durations  else 0
print(average_login_time(df_list))
############################
# APARTADO 2aiii,
# Media de tiempo de juego en cada día.
############################
def average_daily_time(sessions):
    conditions= [('object.id', 'Game'), ('verb.id', 'progressed')]
    start_conditions = [('object.id', 'Game'), ('verb.id', 'initialized')]
    end_conditions = [('object.id', 'Session'), ('verb.id', 'completed')]
    all_durations = [[] for _ in range(7)]
    for df in sessions:
        indices=find_indices_by_conditions(df,conditions)
        if len(indices) != 6: return
        start_idx = find_first_index_by_conditions(df, start_conditions)
        end_idx = find_first_index_by_conditions(df, end_conditions)
        all_durations[0].append(time_between_indices(df,start_idx,indices[0]))
        all_durations[6].append(time_between_indices(df,end_idx,indices[5]))
        for i in range(1,6):
            all_durations[i].append(time_between_indices(df,indices[i-1],indices[i]))
    
    return all_durations

print(average_daily_time(df_list))
############################
# APARTADO 2bi,
# Número medio de veces que se pulsa sin éxito el botón de “aceptar” en la pantalla de login (si no ha seleccionado correctamente las opciones de personalización iniciales).
############################

login = df[df["object.id"] == "loginButton"].index
game_initialized = df[(df["object.id"] == "Game") & (df["verb.id"] == "initialized")].index
print("#####################")
print("APARTADO 2bi")
print("Número medio de veces que se pulsa sin éxito el botón de “aceptar” en la pantalla de login (si no ha seleccionado correctamente las opciones de personalización iniciales):")
print((login.size - game_initialized.size) / n_users)
print("#####################")