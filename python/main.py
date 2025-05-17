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
