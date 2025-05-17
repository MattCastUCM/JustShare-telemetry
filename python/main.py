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
df, df_list = loader.load_all_files(files_path, files_extension, "timestamp", cols_to_drop, use_scorm)
n_users = utils.get_n_users(df)


############################
# APARTADO 2ai,
# Media de tiempo de juego total
############################
def average_total_time(sessions):
    durations  = []
    start_conditions = [('object.id', 'Session'), ('verb.id', 'initialized')]
    end_conditions = [('object.id', 'Session'), ('verb.id', 'completed')]
    for df in sessions:
        start_idx = utils.find_first_index_by_conditions(df, start_conditions)
        end_idx = utils.find_first_index_by_conditions(df, end_conditions)
        d = utils.time_between_indices(df,start_idx,end_idx)
        durations.append(d)
    return sum(durations ) / len(durations ) if durations  else 0

utils.show_metric(
    section='2ai',
    title="Media de tiempo de juego total",
    info=f"{average_total_time(df_list)} segundos"
)

############################
# APARTADO 2aii,
# Media de tiempo de juego desde que se pasa de la pantalla de login
############################
def average_login_time(sessions):
    durations  = []
    start_conditions = [('object.id', 'Game'), ('verb.id', 'initialized')]
    end_conditions = [('object.id', 'Session'), ('verb.id', 'completed')]
    for df in sessions:
        start_idx = utils.find_first_index_by_conditions(df, start_conditions)
        end_idx = utils.find_first_index_by_conditions(df, end_conditions)
        d = utils.time_between_indices(df,start_idx,end_idx)
        durations.append(d)
    return sum(durations ) / len(durations ) if durations else 0

utils.show_metric(
    section='2aii',
    title="Media de tiempo de juego desde que se pasa la pantalla de login",
    info=f'{average_login_time(df_list)} segundos'
)

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
        indices=utils.find_indices_by_conditions(df,conditions)
        if len(indices) != 6: return
        start_idx = utils.find_first_index_by_conditions(df, start_conditions)
        end_idx = utils.find_first_index_by_conditions(df, end_conditions)
        all_durations[0].append(utils.time_between_indices(df,start_idx,indices[0]))
        all_durations[6].append(utils.time_between_indices(df,end_idx,indices[5]))
        for i in range(1,6):
            all_durations[i].append(utils.time_between_indices(df,indices[i-1],indices[i]))
    
    return all_durations

daily_times = average_daily_time(df_list)
result = '\n'.join([f'Dia {i+1}: {value[0]} segundos' for i, value in enumerate(daily_times)])

utils.show_metric(
    section='2aiii',
    title="Media de tiempo de juego en cada día",
    info=result
)
############################
# APARTADO 2bi,
# Número medio de veces que se pulsa sin éxito el botón de “aceptar” en la pantalla de login (si no ha seleccionado correctamente las opciones de personalización iniciales).
############################

login = df[df["object.id"] == "loginButton"].index
game_initialized = df[(df["object.id"] == "Game") & (df["verb.id"] == "initialized")].index
utils.show_metric(
    section='2bi',
    title="Número medio de veces que se pulsa sin éxito el botón de “aceptar” en la pantalla de login (si no ha seleccionado correctamente las opciones de personalización iniciales)",
    info=(login.size - game_initialized.size) / n_users
)
