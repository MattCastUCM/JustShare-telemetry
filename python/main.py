import utils
import loader
import graphics


# Se usan las trazas de Simva o las de Scorm
use_scorm = False

files_path = "./trazas/simva/"
cols_to_drop = ["stored", "id", "version", "actor.account.homePage", "authority.name", "authority.homePage", "context.contextActivities.category", "context.registration", "object.definition.name.en-US", "object.definition.description.en-US", "object.definition.type", "verb.display.en-US", "verb.id", "object.objectType", "result.response", "result.score.scaled", "result.completion", "result.success"]

if use_scorm:
	files_path = "./trazas/scorm/"
	cols_to_drop = ["verb.display.en-US", "id", "stored", "version", "actor.objectType", "actor.account.homePage", "result.success", "result.completion", "context.registration", "authority.objectType", "authority.account.homePage", "authority.account.name", "authority.name", "object.definition.description.en-US", "object.definition.name.en-US", "object.objectType", "context.contextActivities.category"]

files_extension = "json"


############################
# Datos comunes
# Sacado de los JSONs
############################
all_users_df, users_individual_df_list = loader.load_all_files(files_path, files_extension, "timestamp", cols_to_drop, use_scorm)
n_users = len(users_individual_df_list)


############################
# APARTADO 1 a i,
# Porcentaje de elección de las diferentes respuestas cuando se presentan varias opciones en las siguientes situaciones:
#   Cuando habla con el acosador.
#   Al discutir con sus amigas en el cumpleaños.
#   Cuando le revela a su amiga que sale con el acosador.
#   Si decide o no contarle el problema a sus padres.
############################

def get_choices_stats(all_users_df, notable_nodes = []): 
	# Dataframe solo con las filas en las que la columna Response no es nan
	only_choices = all_users_df.dropna(subset=["Response"])

	# Elimina las filas que tengan la misma respuesta, nodo y nombre de actor (por si acaso se envian duplicadas)
	only_choices = only_choices.drop_duplicates(subset=["Response", "actor.account.name", "Node"])

	# only_choices = only_choices.sort_values(by=["timestamp", "Node"])
	# unique_choices = only_choices["Response"].unique()
	# unique_nodes = only_choices["Node"].unique()


	# Respuestas distintas que tiene cada nodo
	nodes_responses = []

	# Numero de veces que se ha respondido cada nodo
	nodes_total_responses = []

	# Numero de veces que se ha respondido cada respuesta en cada nodo
	nodes_individual_responses = []

	# Recorrer todos los nodos que se quieren comprobar
	for node in notable_nodes:
		# Obtener los distintos valores que pueden tener las respuestas de ese nodo
		responses = only_choices[only_choices["Node"] == node]
		unique_responses = responses["Response"].unique()

		nodes_responses.append(unique_responses)
		nodes_total_responses.append(len(responses.index))

		# Recorrer cada opcion del nodo
		unique_responses_selection = []
		for choice in unique_responses:
			# Obtener cuantas veces se ha elegido esa oopcion
			conditions = [('Node', node), ('Response', choice)]
			count = utils.find_indices_by_conditions(only_choices, conditions)
			
			unique_responses_selection.append(len(count))

		nodes_individual_responses.append(unique_responses_selection)

	return nodes_responses, nodes_total_responses, nodes_individual_responses

# Nodos cuyas respuestas se quieren comprobar
notable_nodes = ["Scene1Bedroom1.computer1.choices", "Scene1Bedroom1.computer2.choices3", "Scene1Bedroom2.computer.choices", "Scene1Bedroom2.computer.choices2", "Scene2Bedroom.phone.choices", "Scene4Garage.photo.choices", "Scene4Garage.interruption.choices", "Scene4Bedroom.phone.choices", "Scene5Livingroom.choices", "Scene5Bedroom.phone.choices2", "Scene5Bedroom.phone.choices3", "Scene6Bedroom.phone.choices2", ]
nodes_responses, nodes_total_responses, nodes_individual_responses = get_choices_stats(all_users_df, notable_nodes)

result = "\n"
for i in range (len(notable_nodes)):
	result += f'Nodo {notable_nodes[i]}:\n'
	for j in range(len(nodes_responses[i])):
		percentage = nodes_individual_responses[i][j] / nodes_total_responses[i]
		percentage = percentage * 100
		result += f'   {nodes_responses[i][j]}: {percentage}%\n'
	result += "\n"
	
utils.show_metric(
    section='1 a i',
    title="Porcentaje de elección de las diferentes respuestas cuando se presentan varias opciones en las siguientes situaciones",
    info=result
)

# Mostrar las graficas
# for i in range(len(notable_nodes)):
# 	graphics.display_pie_chart(nodes_individual_responses[i], nodes_responses[i], notable_nodes[i])


############################
# APARTADO 2 a i,
# Media de tiempo de juego total
############################

def average_total_time(sessions):
    durations  = []
    start_conditions = [('object.id', 'SessionStart')]
    end_conditions = [('object.id', 'SessionEnd')]
    
    for user in users_individual_df_list:
        start_idx = utils.find_first_index_by_conditions(user, start_conditions)
        end_idx = utils.find_first_index_by_conditions(user, end_conditions)
        d = utils.time_between_indices(user,start_idx,end_idx)
        durations.append(d)
    return sum(durations ) / len(durations ) if durations  else 0

utils.show_metric(
    section='2 a i',
    title="Media de tiempo de juego total",
    info=f"{average_total_time(users_individual_df_list)} segundos"
)


############################
# APARTADO 2 a ii,
# Media de tiempo de juego desde que se pasa de la pantalla de login
############################
def average_login_time(sessions):
    durations  = []
    start_conditions = [('object.id', 'GameStart')]
    end_conditions = [('object.id', 'GameEnd')]
    
    for user in users_individual_df_list:
        start_idx = utils.find_first_index_by_conditions(user, start_conditions)
        end_idx = utils.find_first_index_by_conditions(user, end_conditions)
        d = utils.time_between_indices(user,start_idx,end_idx)
        durations.append(d)
    return sum(durations ) / len(durations ) if durations  else 0

utils.show_metric(
    section='2 a ii',
    title="Media de tiempo de juego desde que se pasa la pantalla de login",
    info=f'{average_login_time(users_individual_df_list)} segundos'
)


############################
# APARTADO 2 a iii,
# Media de tiempo de juego en cada día.
############################

def average_daily_time(users_individual_df_list):
    conditions = [('object.id', 'GameProgress')]
    start_conditions = [('object.id', 'GameStart')]
    end_conditions = [('object.id', 'GameEnd')]

    # Duraciones de todos los dias. Cada elemento de la lista es otra lista con la duracion de ese dia para cada usuario
    all_durations = [[] for _ in range(7)]

    for user in users_individual_df_list:
        # Indices de los eventos que se van a usar para calcular los tiempos
        indexes = []

        # Indice del evento de inicio del juego
        indexes.append(utils.find_first_index_by_conditions(user, start_conditions))

        # Indices de los eventos de progreso en el juego
        progress_indexes = utils.find_indices_by_conditions(user, conditions)
        aux = []

        # Recorre todos los indices de los eventos de progreso y solo se guardan si el dia no esta repetido (por si se repiten los eventos)
        for i in range (len(progress_indexes)):
            day = user.loc[progress_indexes[i], "EndingDay"]
            if not (day in aux):
                aux.append(day)
                indexes.append(progress_indexes[i])

        # Indice del evento de final del juego
        indexes.append(utils.find_first_index_by_conditions(user, end_conditions))
        
        # Si hay 8 indices (inicio, 6 dias y fin), se calculan los tiempos para el usuario y se guardan
        if len(indexes) == 8:
            for i in range (len(indexes) - 1):
                time = utils.time_between_indices(user, indexes[i], indexes[i + 1])
                all_durations[i].append(time)

    return all_durations

daily_times = average_daily_time(users_individual_df_list)
result = '\n'.join([f'Dia {i+1}: {value[0]} segundos' for i, value in enumerate(daily_times)])

utils.show_metric(
    section='2 a iii',
    title="Media de tiempo de juego en cada día",
    info=result
)


############################
# APARTADO 2 b i,
# Número medio de veces que se pulsa sin éxito el botón de “aceptar” en la pantalla de login (si no ha seleccionado correctamente las opciones de personalización iniciales).
############################

login = all_users_df[all_users_df["Object"] == "loginButton"].index
game_initialized = all_users_df[(all_users_df["object.id"] == "GameStart")].index
utils.show_metric(
    section='2 b i',
    title="Número medio de veces que se pulsa sin éxito el botón de “aceptar” en la pantalla de login (si no ha seleccionado correctamente las opciones de personalización iniciales)",
    info=(login.size - game_initialized.size) / n_users
)
