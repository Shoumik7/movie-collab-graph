import networkx as nx
import matplotlib.pyplot as plt

G = nx.Graph()
G.add_nodes_from(["a", "b"])
G.add_edge("a", "b")
nx.draw_networkx(G)
plt.savefig("graph.pdf")
plt.savefig("graph.png")
plt.savefig("graph.svg")

G = nx.path_graph(4)
nx.write_gexf(G, "test.gexf")


