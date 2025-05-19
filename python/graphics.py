import matplotlib.pyplot as plt
import numpy as np


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
	plt.show()

	return fig, ax


# Grafica de sectores anidada
def display_nested_pie_chart(outer_values, inner_values, outer_labels, inner_labels, title, figsize=(8, 8), radius = 1.2):
	fig, ax = plt.subplots(figsize=figsize)

	size = 0.5
	start_angle = 0
	
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
		ang=(p.theta2-p.theta1)/2. +p.theta1
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
	plt.show()


# Grafica de barras
def plot_bar_chart(df, title, ylabel, xlabel, bar_color, sizex=8, sizey=6):
	ax = df.plot(kind="bar", legend=False, color=bar_color, figsize=(sizex, sizey))
	for p in ax.patches:
		ax.annotate(f"{p.get_height():.2f}", (p.get_x() + p.get_width() / 2., p.get_height()), ha="center", va="center", xytext=(0, 10), textcoords="offset points")
	plt.title(title)
	plt.ylabel(ylabel)
	plt.xlabel(xlabel)
	plt.xticks(rotation=0)
	plt.show()

	return ax