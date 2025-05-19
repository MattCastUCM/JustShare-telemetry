import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
import loader
from matplotlib.patches import Patch

save_graphics = False
output_directory = "./output/"

def show_graphic(title):
	if save_graphics:
		loader.create_output_directory(output_directory)
		plt.savefig(f'{output_directory}{title}.png',format='png',bbox_inches='tight')
		plt.clf()
	else:
		plt.show()

# Grafica de sectores
def display_pie_chart(values, labels, title, figsize=(6, 6),label_fontsize=12,pct_fontsize=10):
	fig, ax = plt.subplots(figsize=figsize)

	new_labels = []
	for i in range(len(values)):
		new_labels.append('' if values[i] == 0 else labels[i])

	wedges, texts, autotexts = ax.pie(
		values,
		labels=new_labels,
		autopct=lambda p: "{:.1f}%".format(round(p)) if p > 0 else "",
		startangle=90
	)

	for text in texts:
		text.set_fontsize(label_fontsize)
	for autotext in autotexts:
		autotext.set_fontsize(pct_fontsize)

	ax.set_title(title, fontsize=label_fontsize + 2)
	ax.axis("equal")

	show_graphic(title)

# Grafica de sectores anidada
def display_nested_pie_chart(outer_values, inner_values, outer_labels, inner_labels, title, figsize=(8, 8), radius = 1.2):
	fig, ax = plt.subplots(figsize=figsize)

	size = 0.5
	start_angle = 90
	
	# Grafica externa
	wedges, texts, autotexts = ax.pie(
		outer_values,
		radius=radius,
		wedgeprops=dict(width=size, edgecolor="w"),
		autopct=lambda p: "{:.1f}%".format(round(p)) if p > 0 else "",
		pctdistance=0.85,
		startangle = start_angle
	)

	# Escribir las etiquetas como anotaciones
	kw=dict(xycoords="data",textcoords="data",arrowprops=dict(arrowstyle="-"),zorder=0,va="center")
	for i,p in enumerate(wedges):
		# Mini arreglo
		ang=(p.theta2-p.theta1)/2. +p.theta1 + 0.0001
		y=np.sin(np.deg2rad(ang))
		x=np.cos(np.deg2rad(ang))
		horizontalalignment={-1:"right",1:"left"}[int(np.sign(x))]
		connectionstyle="angle,angleA=0,angleB={}".format(ang)
		kw["arrowprops"].update({"connectionstyle":connectionstyle})
		ax.annotate(outer_labels[i],xy=(x, y),xytext=(1.35*np.sign(x),1.4*y), horizontalalignment=horizontalalignment,**kw)
	
	total_segments = sum(len(sublist) for sublist in inner_values)
	flat_values = [val for sublist in inner_values for val in sublist]
	colors = plt.cm.Set3(np.linspace(0, 1, total_segments))

	# Grafica interna
	wedges, texts, autotexts = ax.pie(
		flat_values,
		colors=colors,
		radius=radius-size,
		wedgeprops=dict(width=size, edgecolor="w"),
		labels=[label if value > 0 else "" for label, value in zip(inner_labels, flat_values)],
		labeldistance=0.2,
		autopct=lambda p: "{:.1f}%".format(round(p)) if p > 0 else "",
		# pctdistance=0.6,
		startangle = start_angle
	)

	for text in texts:
		text.set_fontsize(8)

	ax.set_aspect("equal")  
	plt.title(title, pad=20)

	show_graphic(title)

# Grafica de barras
def display_bar_chart(df, title, ylabel, xlabel, bar_color, sizex=8, sizey=6):
	ax_bis = df.plot(kind="bar", legend=False, color=bar_color, figsize=(sizex, sizey))
	for p in ax_bis.patches:
		ax_bis.annotate(f"{p.get_height():.2f}", (p.get_x() + p.get_width() / 2., p.get_height()), ha="center", va="center", xytext=(0, 10), textcoords="offset points")
	plt.title(title)
	plt.ylabel(ylabel)
	plt.xlabel(xlabel)
	plt.xticks(rotation=0)

	show_graphic(title)

def display_heatmap(posX, posY, title, background_image):
	# Grafica
	plt.figure(figsize=(15, 15))
	plt.scatter(posX, posY, alpha=0.6, s=15)
	plt.title(title)
	plt.xlabel("PointerX")
	plt.ylabel("PointerY")
	plt.gca().invert_yaxis()   # (0,0) arriba‑izquierda, como en coordenadas de pantalla
	plt.grid(True, linestyle="--", linewidth=0.5, alpha=0.4)
	axes = plt.gca()
	axes.set_xlim(0, 1600)
	axes.set_ylim(900, 0)
	img = np.asarray(Image.open(background_image))
	plt.imshow(img)

	show_graphic(title)




def flexible_double_donut(outer_data, outer_labels,inner_data, inner_labels,title,
	show_outer_label_in_chart=True,show_outer_percentage_in_chart=True,
	show_outer_panel=False,show_outer_percentage_in_panel=True,
	show_inner_label_in_chart=True,show_inner_percentage_in_chart=True,
	show_inner_panel=False,show_inner_percentage_in_panel=True,
	outer_title="Outer",inner_title="Inner",
	outer_colors=None,inner_colors=None,start_angle = 90
):
	fig, ax = plt.subplots(figsize=(8, 5))
	width = 0.3

	def filter_nonzero(data, labels, colors):
		idx = [i for i, v in enumerate(data) if v > 0]
		filtered_data = [data[i] for i in idx]
		filtered_labels = [labels[i] for i in idx]
		filtered_colors = [colors[i] for i in idx]
		return filtered_data, filtered_labels, filtered_colors

	if not outer_colors:
		outer_colors = plt.cm.tab20c.colors[:len(outer_data)]
	if not inner_colors:
		inner_colors = plt.cm.tab20c.colors[len(outer_data):len(outer_data)+len(inner_data)]

	# For the chart, remove zeros
	outer_data_nonzero, outer_labels_nonzero, outer_colors_nonzero = filter_nonzero(outer_data, outer_labels, outer_colors)
	inner_data_nonzero, inner_labels_nonzero, inner_colors_nonzero = filter_nonzero(inner_data, inner_labels, inner_colors)

	def labels_with_percentage(labels, data):
		total = sum(data)
		return [f"{e} ({v/total*100:.1f}%)" if total > 0 else f"{e} (0.0%)" for e, v in zip(labels, data)]

	
	# OUTER
	labels_ext = outer_labels_nonzero if show_outer_label_in_chart else None
	autopct_ext = '%1.1f%%' if show_outer_percentage_in_chart else None

	ax.pie(
		outer_data_nonzero, radius=1, labels=labels_ext, autopct=autopct_ext,
		colors=outer_colors_nonzero, pctdistance=0.85, labeldistance=1.08,
		wedgeprops=dict(width=width, edgecolor='w'), textprops=dict(color="black", fontsize=9),
		startangle = start_angle
	)

	# INNER
	labels_int = inner_labels_nonzero if show_inner_label_in_chart else None
	autopct_int = '%1.1f%%' if show_inner_percentage_in_chart else None

	ax.pie(
		inner_data_nonzero, radius=1-width, labels=labels_int, autopct=autopct_int,
		colors=inner_colors_nonzero, pctdistance=0.7, labeldistance=1.02,
		wedgeprops=dict(width=width, edgecolor='w'), textprops=dict(color="black", fontsize=8),
		startangle = start_angle
	)

	ax.set(aspect="equal")

	# OUTER PANEL
	if show_outer_panel:
		if show_outer_percentage_in_panel:
			panel_labels_ext = labels_with_percentage(outer_labels, outer_data)
		else:
			panel_labels_ext = outer_labels
		handles_ext = [Patch(facecolor=c, edgecolor='k') for c in outer_colors]
		fig.legend(
			handles_ext, panel_labels_ext, title=outer_title, 
			bbox_to_anchor=(0.95, 0.92), loc="upper left"
		)

	# INNER PANEL
	if show_inner_panel:
		if show_inner_percentage_in_panel:
			panel_labels_int = labels_with_percentage(inner_labels, inner_data)
		else:
			panel_labels_int = inner_labels
		handles_int = [Patch(facecolor=c, edgecolor='k') for c in inner_colors]
		fig.legend(
			handles_int, panel_labels_int, title=inner_title, 
			bbox_to_anchor=(0.95, 0.5), loc="upper left"
		)

	plt.tight_layout()
	plt.title(title, pad=20)
	plt.show()
