import pandas as pd

# Dada una serie de condiciones (por ejemplo, objeto de tipo Game) obtener sus indices en el dataframe
def find_indices_by_conditions(df, conditions):
	mask = pd.Series([True] * len(df), index=df.index)
	for col, val in conditions:
		if val=="notna":
			mask &= df[col].notna()
		else:
			mask &= df[col] == val
	return df[mask].index.tolist()

# Dada una serie de condiciones (por ejemplo, objeto de tipo Game) obtener el primer indice en el dataframe
def find_first_index_by_conditions(df, conditions,index=0):
	indices = find_indices_by_conditions(df.iloc[index:], conditions)
	return indices[0] if indices else None

def find_values_by_conditions(df, conditions, target_column):
	mask = pd.Series([True] * len(df), index=df.index)
	for col, val in conditions:
		if val == "notna":
			mask &= df[col].notna()
		else:
			mask &= df[col] == val
	return df.loc[mask, target_column].tolist()


# Devuelve el valor de una columna específica en la primera fila que cumple las condiciones
def find_first_value_by_conditions(df, conditions, target_column):
	values = find_values_by_conditions(df, conditions, target_column)
	return values[0] if values else None



# Dado dos indices obtener la diferencia de tiempos
def time_between_indices(df, index1, index2):
	t1 = pd.to_datetime(df.loc[index1, "timestamp"])
	t2 = pd.to_datetime(df.loc[index2, "timestamp"])
	delta = t2 - t1
	return abs(delta.total_seconds()) 


def show_metric(section, title, info = None):
	N_SEPARATORS = 10
	print("#"*N_SEPARATORS)
	print(f"APARTADO {section}")
	print(f"{title}:")
	if info:
		print(str(info))
	print("#"*N_SEPARATORS + "\n")