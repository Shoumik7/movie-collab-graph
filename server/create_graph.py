import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
import json

# Opening JSON file
f = open('uniqueActors.json')
  
# returns JSON object as 
# a dictionary
data = json.load(f)

#print(data)

G = nx.Graph()
G.add_nodes_from(data)

options = {
    'node_color': range(311),
    'cmap':plt.cm.colors,
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


#nx.write_gexf(G, "test.gexf")


