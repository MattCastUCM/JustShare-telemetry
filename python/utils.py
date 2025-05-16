import pandas as pd

# Dada una serie de condiciones (por ejemplo, objeto de tipo Game) obtener sus indices en el dataframe
def find_indices_by_conditions(df, conditions):
    mask = pd.Series([True] * len(df), index=df.index)
    for col, val in conditions:
        mask &= df[col] == val
    return df[mask].index.tolist()

# Dada una serie de condiciones (por ejemplo, objeto de tipo Game) obtener el primer indice en el dataframe
def find_first_index_by_conditions(df, conditions):
    indices = find_indices_by_conditions(df, conditions)
    return indices[0] if indices else None

# Dado dos indices obtener la diferencia de tiempos
def time_between_indices(df, index1, index2):
    t1 = pd.to_datetime(df.loc[index1, 'timestamp'])
    t2 = pd.to_datetime(df.loc[index2, 'timestamp'])
    delta = t2 - t1
    return abs(delta.total_seconds()) 

# Obtener el numero de usuarios
def get_n_users(df):
    account_names = df["actor.account.name"]
    names = set(name for name in account_names)
    return len(names)

def show_metric(section, title, info):
    print("#####################")
    print(f"APARTADO {section}")
    print(f"{title}:")
    print(str(info))
    print("#####################\n")

# def get_events_between_different_parameters(dataframe, parameter1, parameter2, firstPValue, secondPValue):
# 	# Buscar el primer y ultimo indice de la fila
# 	start_idx = dataframe[dataframe[parameter1] == firstPValue].index
# 	end_idx = dataframe[dataframe[parameter2] == secondPValue].index

# 	# Se juntan todas las filas entre ambos eventos
# 	data = pd.DataFrame()
# 	for i, j in zip(start_idx, end_idx):
# 		data = pd.concat([data, dataframe[i:j + 1]], ignore_index=True)
    
# 	return data