import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
import json
from itertools import combinations


# Opening JSON file
f = open('uniqueActors.json')
g = open('movieCollabGroups.json')
  
# returns JSON object as 
# a dictionary
actors = json.load(f)

collab_groups = json.load(g)
print(collab_groups)

G = nx.Graph()
G.add_nodes_from(actors)

for key in collab_groups:
    nodes = collab_groups[key]

    edges = combinations(nodes, 2)
    G.add_edges_from(edges)

options = {
    'node_color': range(len(actors)),
    'cmap':plt.cm.Blues,
    'node_size': 50,
    'linewidths': 0,
    'width': 0.1,
    'with_labels':False
}

nx.draw_random(G, **options)
plt.savefig("graph.pdf")
plt.savefig("graph.png")
plt.savefig("graph.svg")

print(json_graph.node_link_data(G))
nx.write_gexf(G, "test.gexf")


