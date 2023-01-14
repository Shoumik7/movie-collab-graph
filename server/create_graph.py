import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph


G = nx.Graph()
G.add_nodes_from(["a", "b"])
G.add_edge("a", "b")
nx.draw_networkx(G)
plt.savefig("graph.pdf")
plt.savefig("graph.png")
plt.savefig("graph.svg")
G = nx.path_graph(4)


#DG = nx.DiGraph()
#DG.add_edge('a', 'b')
print(json_graph.node_link_data(G))


#nx.write_gexf(G, "test.gexf")


