export const algoDetails = {
  "Recursive Backtracking (DFS)": {
    title: "Recursive Backtracking (DFS)",
    description: ["Uses depth-first search to explore and carve paths recursively through a grid.", "Grids filled with walls.", "Produces perfect mazes with a single unique path between any two points.", "Simple and space-efficient but often results in long, winding corridors.", "Requires a grid structure and a mechanism to track visited cells."],
    complexities: {
      average: "n",
      best: "n",
      worst: "n",
      space: "n",
    },
    code: `def carve(x, y):
    visited[x][y] = True
    for (nx, ny) in shuffled_neighbors(x, y):
        if not visited[nx][ny]:
            remove_wall_between(x, y, nx, ny)
            carve(nx, ny)`,
  },

  "Recursive Division (Balanced)": {
    title: "Recursive Division Balanced",
    description: ["Recursively splits the grid with alternating vertical and horizontal walls, leaving a gap in each.", "Empty grids.", "Creates mazes with balanced partitions and room-like structures.", "Can appear structured or blocky compared to organic algorithms.", "Requires region boundaries and wall placement logic with random gaps."],
    complexities: {
      average: "n",
      best: "n",
      worst: "n log n",
      space: "n",
    },
    code: `def divide(x, y, w, h, orientation):
    if w < 2 or h < 2:
        return
    if orientation == 'H':
        wy = choose_horizontal_wall_line(y, h)
        gap = choose_random_gap(x, w)
        draw_horizontal_wall(x, wy, w, gap)
        divide(x, y, w, wy - y, choose_orientation(w, wy - y))
        divide(x, wy + 1, w, y + h - wy - 1, choose_orientation(w, y + h - wy - 1))
    else:
        wx = choose_vertical_wall_line(x, w)
        gap = choose_random_gap(y, h)
        draw_vertical_wall(wx, y, h, gap)
        divide(x, y, wx - x, h, choose_orientation(wx - x, h))
        divide(wx + 1, y, x + w - wx - 1, h, choose_orientation(x + w - wx - 1, h))`,
  },

  "Recursive Division (Vertical Skew)": {
    title: "Recursive Division Vertical Skew",
    description: ["Always divides regions vertically when width exceeds height, leaving a single random gap.", "Empty grids (preferred for long horizontal grids).", "Produces fast mazes with a strong vertical corridor bias.", "Results in imbalanced layouts with long vertical passages.", "Requires region dimensions and logic to insert vertical walls with gaps."],
    complexities: {
      average: "n",
      best: "n",
      worst: "n log n",
      space: "n",
    },
    code: `def divide_vertical_skew(x, y, w, h):
    if w < 2 or h < 2:
        return
    wx = choose_vertical_wall_line(x, w)
    gap = choose_random_gap(y, h)
    draw_vertical_wall(wx, y, h, gap)
    divide_vertical_skew(x, y, wx - x, h)
    divide_vertical_skew(wx + 1, y, x + w - wx - 1, h)`,
  },

  "Recursive Division (Horizontal Skew)": {
    title: "Recursive Division Horizontal Skew",
    description: ["Always divides regions horizontally when height exceeds or equals width, leaving a random gap.", "Empty grids (preferred for long vertical grids).", "Generates fast mazes with horizontal corridor bias.", "Creates imbalanced layouts with dominant horizontal features.", "Requires region bounds and wall-drawing logic with a single opening."],
    complexities: {
      average: "n",
      best: "n",
      worst: "n log n",
      space: "n",
    },
    code: `def divide_horizontal_skew(x, y, w, h):
    if w < 2 or h < 2:
        return
    wy = choose_horizontal_wall_line(y, h)
    gap = choose_random_gap(x, w)
    draw_horizontal_wall(x, wy, w, gap)
    divide_horizontal_skew(x, y, w, wy - y)
    divide_horizontal_skew(x, wy + 1, w, y + h - wy - 1)`,
  },

  "Prim's Algorithm": {
    title: "Prim’s Algorithm",
    description: ["Randomized algorithm that grows a maze by expanding from visited cells into unvisited neighbors through walls.", "Grids filled with walls.", "Generates perfect mazes with no loops and a single path between any two points.", "Produces natural-looking mazes with dense branching and short corridors.", "Requires a grid with wall cells and frontier management using a randomized selection."],
    complexities: {
      average: "n",
      best: "n",
      worst: "n",
      space: "n",
    },
    code: `start = choose_random_cell()
    visited = set()
    wall_list = []

    visited.add(start)
    wall_list.extend(neighbors(start))

    while wall_list:
        wall = random.choice(wall_list)
        wall_list.remove(wall)
        if connects_to_unvisited(wall):
            remove_wall(wall)
            new_cell = unvisited_neighbor(wall)
            visited.add(new_cell)
            wall_list.extend(neighbors(new_cell))`,
  },

  "Breadth-first Search": {
    title: "Breadth-first Search",
    description: ["Explores nodes level by level from the source, visiting all neighbors before moving deeper.", "Best suited for unweighted graphs or grids to find the shortest path.", "Guarantees shortest path in uniform cost graphs and is easy to implement.", "Consumes more memory due to wide expansions.", "Requires a queue and a visited node tracker."],
    complexities: {
      average: "v + e",
      best: "1",
      worst: "v + e",
      space: "v",
    },
    code: `def bfs(start):
    queue = [start]
    visited = set([start])
    while queue:
        u = queue.pop(0)
        for v in neighbors(u):
            if v not in visited:
                visited.add(v)
                queue.append(v)`,
  },

  "Depth-first Search": {
    title: "Depth-first Search",
    description: ["Traverses the graph deeply along each path before backtracking.", "Works on graphs, trees, and grids for tasks like pathfinding and component detection.", "Low memory usage on narrow graphs and simple to code.", "Does not guarantee shortest paths and may explore deep dead-ends.", "Requires tracking of visited nodes and uses recursion or a stack."],
    complexities: {
      average: "v + e",
      best: "1",
      worst: "v + e",
      space: "v",
    },
    code: `def dfs(u):
    visited.add(u)
    for v in neighbors(u):
        if v not in visited:
            dfs(v)`,
  },

  "Dijkstra's Algorithm": {
    title: "Dijkstra’s Algorithm",
    description: ["Finds shortest paths from a source node to all others in a graph with non-negative weights.", "Works on weighted graphs using adjacency structures.", "Guarantees optimal paths and performs efficiently with a heap.", "Cannot handle negative weights and becomes slower without a heap.", "Requires edge weights and a priority queue."],
    complexities: {
      average: "v + e log v",
      best: "1",
      worst: "v^2",
      space: "v + e",
    },
    code: `def dijkstra(graph, source):
    dist = {v: float('inf') for v in graph}
    dist[source] = 0
    pq = PriorityQueue()
    pq.put((0, source))
    while not pq.empty():
        d, u = pq.get()
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            alt = dist[u] + w
            if alt < dist[v]:
                dist[v] = alt
                pq.put((alt, v))`,
  },

  "A* Search": {
    title: "A* Search",
    description: ["Searches for the lowest-cost path using f(n) = g(n) + h(n), where h is a heuristic.", "Applies to graphs or grids with defined cost and heuristic functions.", "Optimal if the heuristic is admissible; often faster than Dijkstra.", "Requires well-designed heuristics and may use more memory.", "Needs cost function, admissible heuristic, and priority queue."],
    complexities: {
      average: "depends on heuristic",
      best: "n",
      worst: "e",
      space: "v",
    },
    code: `def astar(start, goal, h):
    open_set = PriorityQueue()
    open_set.put((h(start), start))
    g = {start: 0}
    while not open_set.empty():
        _, u = open_set.get()
        if u == goal:
            return reconstruct_path()
        for v, w in neighbors(u):
            tentative = g[u] + w
            if v not in g or tentative < g[v]:
                g[v] = tentative
                open_set.put((tentative + h(v), v))`,
  },

  "AO* Search": {
    title: "AO* Search",
    description: ["Solves problems represented as AND-OR graphs by combining heuristic guidance with recursive cost updates.", "AND-OR graphs, where OR nodes represent alternative choices and AND nodes represent required subproblems.", "Finds optimal solutions when heuristics are admissible; handles complex, decomposable problems; can prune suboptimal branches early.", "More complex than A*; may require significant memory; performance depends heavily on heuristic accuracy.", "Requires admissible heuristic, defined AND-OR structure, and cost evaluation for subproblems."],
    complexities: {
      average: "depends on heuristic and graph structure",
      best: "n",
      worst: "2^n",
      space: "v",
    },
    code: `def AO_star(node, h):
    if is_goal(node):
        node.status = 'solved'
        node.cost = 0
        return node.cost
  
    if node.children == []:
        expand(node)
  
    while True:
        for child_set in node.children:
            cost = sum(AO_star(child, h) for child in child_set)
            node.cost = h(node) + min(cost for child_set in node.children)
        best = argmin(node.children, key=lambda s: sum(c.cost for c in s))
        if all(child.status == 'solved' for child in best):
            node.status = 'solved'
            break
    return node.cost`,
  },

  "Greedy Best-first Search": {
    title: "Greedy Best-first Search",
    description: ["Chooses the next node based only on the heuristic value h(n), moving toward the goal.", "Used in graphs or grids where the heuristic estimates distance to the target.", "Fast with a good heuristic and easy to implement.", "Not optimal and can fail on misleading heuristics.", "Needs a heuristic function and priority queue."],
    complexities: {
      average: "e",
      best: "1",
      worst: "e",
      space: "v",
    },
    code: `def greedy(start, goal, h):
    open_set = PriorityQueue()
    open_set.put((h(start), start))
    visited = set()
    while not open_set.empty():
        _, u = open_set.get()
        if u == goal:
            return reconstruct_path()
        visited.add(u)
        for v in neighbors(u):
            if v not in visited:
                open_set.put((h(v), v))`,
  },

  "Swarm Algorithm": {
    title: "Swarm Algorithm (BFS-style)",
    description: ["Performs an unweighted breadth-first search starting from the source node.", "Explores unweighted grid or graph layer by layer to find the shortest path.", "Efficient for unweighted graphs or mazes and guarantees shortest paths.", "Simple and memory-friendly but expands widely in open spaces.", "Requires queue-based frontier, visited set, and parent tracking for path reconstruction."],
    complexities: {
      average: "v + e",
      best: "1",
      worst: "v + e",
      space: "v",
    },
    code: `def swarm(start):
    queue = [start]
    visited = set([start])
    parent = {}
    while queue:
        current = queue.pop(0)
        for neighbor in neighbors(current):
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                queue.append(neighbor)`,
  },

  "Bidirectional Swarm Algorithm": {
    title: "Bidirectional Swarm Algorithm (Bidirectional BFS)",
    description: ["Simultaneously performs BFS from both the start and end points until the searches meet. Speeds up search by exploring from both directions and meeting in the middle.", "Explores unweighted grid or graph layer by layer to find the shortest path.", "Efficient in large unweighted grids or graphs where paths are long.", "Guarantees shortest path and reduces the number of explored nodes compared to standard BFS.", "Requires two queues, two visited sets, and logic to merge paths at a meeting point."],
    complexities: {
      average: "v + e",
      best: "√v",
      worst: "v + e",
      space: "v",
    },
    code: `def bidirectional_bfs(start, end):
    queue_start = [start]
    queue_end = [end]
    visited_start = set([start])
    visited_end = set([end])
    parent_start = {}
    parent_end = {}
    
    while queue_start and queue_end:
        expand(queue_start, visited_start, parent_start)
        if visited_start & visited_end:
            break
        expand(queue_end, visited_end, parent_end)
        if visited_start & visited_end:
            break
    return reconstruct_meeting_path(parent_start, parent_end)`,
  },
};
