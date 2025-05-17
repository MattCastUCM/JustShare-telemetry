import matplotlib.pyplot as plt

# Grafica de barras
def display_pie_chart(values, labels, title, figsize=(6, 6),label_fontsize=12,pct_fontsize=10):
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
    plt.show()

# Grafica de barras
def plot_bar_chart(df, title, ylabel, xlabel, bar_color):
    ax = df.plot(kind="bar", legend=False, color=bar_color, figsize=(8, 6))
    for p in ax.patches:
        ax.annotate(f'{p.get_height()}', (p.get_x() + p.get_width() / 2., p.get_height()), ha='center', va='center', xytext=(0, 10), textcoords='offset points')
    plt.title(title)
    plt.ylabel(ylabel)
    plt.xlabel(xlabel)
    plt.xticks(rotation=0)
    plt.show()