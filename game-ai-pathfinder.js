/**
 * game-ai-pathfinder.js — A* pathfinding (Buckland Ch5 / Common Graph style).
 * Grid-based A* for the game world; returns waypoints.
 */
(function (global) {
  'use strict';

  /**
   * A* on a 2D grid. Cells: 0 = walkable, 1 = obstacle.
   * @param {number[][]} grid - grid[row][col], 0 = passable
   * @param {number} startRow
   * @param {number} startCol
   * @param {number} goalRow
   * @param {number} goalCol
   * @returns {{ row: number, col: number }[]} path from start to goal (empty if none)
   */
  function aStarGrid(grid, startRow, startCol, goalRow, goalCol) {
    const rows = grid.length;
    const cols = grid[0] ? grid[0].length : 0;
    if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols) return [];
    if (goalRow < 0 || goalRow >= rows || goalCol < 0 || goalCol >= cols) return [];
    if (grid[goalRow][goalCol] !== 0) return [];

    const open = [];
    const closed = new Set();
    const gScore = {};
    const fScore = {};
    const cameFrom = {};
    const key = (r, c) => r + ',' + c;
    const startK = key(startRow, startCol);
    const goalK = key(goalRow, goalCol);

    const heuristic = (r, c) => Math.abs(r - goalRow) + Math.abs(c - goalCol);
    gScore[startK] = 0;
    fScore[startK] = heuristic(startRow, startCol);
    open.push({ row: startRow, col: startCol, f: fScore[startK] });

    while (open.length) {
      open.sort((a, b) => a.f - b.f);
      const current = open.shift();
      const ck = key(current.row, current.col);
      if (ck === goalK) {
        const path = [];
        let cur = current;
        while (cur) {
          path.unshift({ row: cur.row, col: cur.col });
          const from = cameFrom[key(cur.row, cur.col)];
          cur = from;
        }
        return path;
      }
      closed.add(ck);
      const neighbors = [
        [current.row - 1, current.col],
        [current.row + 1, current.col],
        [current.row, current.col - 1],
        [current.row, current.col + 1],
        [current.row - 1, current.col - 1],
        [current.row - 1, current.col + 1],
        [current.row + 1, current.col - 1],
        [current.row + 1, current.col + 1]
      ];
      for (let i = 0; i < neighbors.length; i++) {
        const [nr, nc] = neighbors[i];
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] !== 0) continue;
        const nk = key(nr, nc);
        if (closed.has(nk)) continue;
        const cost = (Math.abs(nr - current.row) + Math.abs(nc - current.col)) === 2 ? 1.414 : 1;
        const tentative = (gScore[ck] || Infinity) + cost;
        if (tentative >= (gScore[nk] || Infinity)) continue;
        cameFrom[nk] = current;
        gScore[nk] = tentative;
        fScore[nk] = tentative + heuristic(nr, nc);
        open.push({ row: nr, col: nc, f: fScore[nk] });
      }
    }
    return [];
  }

  /**
   * Build a simple grid from world bounds and cell size; all passable.
   * For obstacles, mark cells that overlap building rects (optional).
   */
  function buildPassableGrid(worldMinX, worldMinY, worldMaxX, worldMaxY, cellSize) {
    const cols = Math.ceil((worldMaxX - worldMinX) / cellSize);
    const rows = Math.ceil((worldMaxY - worldMinY) / cellSize);
    const grid = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = 0;
      }
    }
    return { grid, cellSize, worldMinX, worldMinY, cols, rows };
  }

  /**
   * World position to grid cell.
   */
  function worldToGrid(worldX, worldY, worldMinX, worldMinY, cellSize) {
    const col = Math.floor((worldX - worldMinX) / cellSize);
    const row = Math.floor((worldY - worldMinY) / cellSize);
    return { row, col };
  }

  /**
   * Grid cell to world position (center of cell).
   */
  function gridToWorld(row, col, worldMinX, worldMinY, cellSize) {
    const x = worldMinX + (col + 0.5) * cellSize;
    const y = worldMinY + (row + 0.5) * cellSize;
    return { x, y };
  }

  /**
   * Find path in world coordinates. gridData = { grid, cellSize, worldMinX, worldMinY, cols, rows }.
   */
  function findPathWorld(gridData, fromX, fromY, toX, toY) {
    const { grid, cellSize, worldMinX, worldMinY, rows, cols } = gridData;
    const start = worldToGrid(fromX, fromY, worldMinX, worldMinY, cellSize);
    const goal = worldToGrid(toX, toY, worldMinX, worldMinY, cellSize);
    start.row = Math.max(0, Math.min(rows - 1, start.row));
    start.col = Math.max(0, Math.min(cols - 1, start.col));
    goal.row = Math.max(0, Math.min(rows - 1, goal.row));
    goal.col = Math.max(0, Math.min(cols - 1, goal.col));
    const path = aStarGrid(grid, start.row, start.col, goal.row, goal.col);
    return path.map(p => gridToWorld(p.row, p.col, worldMinX, worldMinY, cellSize));
  }

  global.GameAIAStarGrid = aStarGrid;
  global.GameAIBuildPassableGrid = buildPassableGrid;
  global.GameAIWorldToGrid = worldToGrid;
  global.GameAIGridToWorld = gridToWorld;
  global.GameAIFindPathWorld = findPathWorld;
})(typeof window !== 'undefined' ? window : this);
