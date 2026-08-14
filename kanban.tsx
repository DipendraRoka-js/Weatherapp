import React, { useReducer, useState, useCallback, useMemo, useRef, createContext, useContext } from "react";
import { Plus, Trash2, Undo2, Redo2, X, GripVertical, Search, Flag } from "lucide-react";

// ---------- Domain ----------
const COLUMNS = ["backlog", "in-progress", "review", "done"];
const COLUMN_LABELS = {
  "backlog": "Backlog",
  "in-progress": "In Progress",
  "review": "Review",
  "done": "Done",
};
const PRIORITIES = ["low", "medium", "high"];
const PRIORITY_COLOR = {
  low: "bg-slate-200 text-slate-700",
  medium: "bg-amber-200 text-amber-800",
  high: "bg-rose-200 text-rose-800",
};

let idCounter = 1;
const nextId = () => `card-${idCounter++}`;

const seedCards = () => [
  { id: nextId(), title: "Define API contract", column: "backlog", priority: "medium", tags: ["api"] },
  { id: nextId(), title: "Set up CI pipeline", column: "backlog", priority: "low", tags: ["infra"] },
  { id: nextId(), title: "Build auth flow", column: "in-progress", priority: "high", tags: ["auth", "security"] },
  { id: nextId(), title: "Design empty states", column: "review", priority: "medium", tags: ["ui"] },
  { id: nextId(), title: "Ship landing page", column: "done", priority: "high", tags: ["marketing"] },
];

// ---------- Reducer with undo/redo ----------
const initialHistoryState = {
  past: [],
  present: { cards: seedCards() },
  future: [],
};

function boardReducer(state, action) {
  switch (action.type) {
    case "ADD_CARD": {
      const card = {
        id: nextId(),
        title: action.title,
        column: "backlog",
        priority: action.priority || "medium",
        tags: [],
      };
      return commit(state, { cards: [...state.present.cards, card] });
    }
    case "DELETE_CARD": {
      return commit(state, {
        cards: state.present.cards.filter((c) => c.id !== action.id),
      });
    }
    case "MOVE_CARD": {
      const { id, column } = action;
      return commit(state, {
        cards: state.present.cards.map((c) =>
          c.id === id ? { ...c, column } : c
        ),
      });
    }
    case "REORDER_WITHIN_COLUMN": {
      const { column, orderedIds } = action;
      const rest = state.present.cards.filter((c) => c.column !== column);
      const colCards = orderedIds
        .map((id) => state.present.cards.find((c) => c.id === id))
        .filter(Boolean);
      return commit(state, { cards: [...rest, ...colCards] });
    }
    case "CYCLE_PRIORITY": {
      return commit(state, {
        cards: state.present.cards.map((c) => {
          if (c.id !== action.id) return c;
          const idx = (PRIORITIES.indexOf(c.priority) + 1) % PRIORITIES.length;
          return { ...c, priority: PRIORITIES[idx] };
        }),
      });
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }
    default:
      return state;
  }
}

function commit(state, newPresent) {
  return {
    past: [...state.past, state.present],
    present: newPresent,
    future: [],
  };
}

// ---------- Context ----------
const BoardContext = createContext(null);
const useBoard = () => useContext(BoardContext);

// ---------- Drag & drop hook ----------
function useDragReorder(dispatch) {
  const dragItem = useRef(null);

  const onDragStart = (cardId) => (e) => {
    dragItem.current = cardId;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropOnColumn = (column, cardsInColumn) => (e) => {
    e.preventDefault();
    const id = dragItem.current;
    if (!id) return;
    const alreadyThere = cardsInColumn.some((c) => c.id === id);
    if (!alreadyThere) {
      dispatch({ type: "MOVE_CARD", id, column });
    }
    dragItem.current = null;
  };

  const onDropOnCard = (column, cardsInColumn, targetId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = dragItem.current;
    if (!id || id === targetId) return;

    const withoutDragged = cardsInColumn.filter((c) => c.id !== id);
    const targetIdx = withoutDragged.findIndex((c) => c.id === targetId);
    const draggedCard =
      cardsInColumn.find((c) => c.id === id) || { id, column };

    const reordered = [...withoutDragged];
    reordered.splice(targetIdx, 0, { ...draggedCard, column });

    dispatch({ type: "MOVE_CARD", id, column });
    dispatch({
      type: "REORDER_WITHIN_COLUMN",
      column,
      orderedIds: reordered.map((c) => c.id),
    });
    dragItem.current = null;
  };

  const onDragOver = (e) => e.preventDefault();

  return { onDragStart, onDropOnColumn, onDropOnCard, onDragOver };
}

// ---------- Components ----------
function Card({ card, dnd, cardsInColumn }) {
  const { dispatch } = useBoard();
  return (
    <div
      draggable
      onDragStart={dnd.onDragStart(card.id)}
      onDragOver={dnd.onDragOver}
      onDrop={dnd.onDropOnCard(card.column, cardsInColumn, card.id)}
      className="group bg-white rounded-lg border border-slate-200 p-3 mb-2 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <GripVertical size={16} className="text-slate-300 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 break-words">
            {card.title}
          </p>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <button
              onClick={() => dispatch({ type: "CYCLE_PRIORITY", id: card.id })}
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${PRIORITY_COLOR[card.priority]}`}
              title="Click to cycle priority"
            >
              <Flag size={10} />
              {card.priority}
            </button>
            {card.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: "DELETE_CARD", id: card.id })}
          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-opacity"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function Column({ column, cards, dnd }) {
  const cardsInColumn = cards.filter((c) => c.column === column);
  return (
    <div
      onDragOver={dnd.onDragOver}
      onDrop={dnd.onDropOnColumn(column, cardsInColumn)}
      className="flex-1 min-w-[240px] bg-slate-50 rounded-xl p-3 flex flex-col max-h-full"
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {COLUMN_LABELS[column]}
        </h3>
        <span className="text-xs font-semibold bg-slate-200 text-slate-600 rounded-full px-2 py-0.5">
          {cardsInColumn.length}
        </span>
      </div>
      <div className="overflow-y-auto flex-1 min-h-[80px]">
        {cardsInColumn.length === 0 && (
          <div className="text-xs text-slate-300 text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
            Drop here
          </div>
        )}
        {cardsInColumn.map((card) => (
          <Card key={card.id} card={card} dnd={dnd} cardsInColumn={cardsInColumn} />
        ))}
      </div>
    </div>
  );
}

function AddCardForm() {
  const { dispatch } = useBoard();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [open, setOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch({ type: "ADD_CARD", title: trimmed, priority });
    setTitle("");
    setPriority("medium");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        <Plus size={16} /> Add card
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 shadow-sm"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title..."
        className="flex-1 text-sm px-2 py-1 outline-none min-w-[160px]"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="text-xs border border-slate-200 rounded px-1 py-1 outline-none"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
      >
        Add
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-slate-400 hover:text-slate-600"
      >
        <X size={16} />
      </button>
    </form>
  );
}

function Toolbar({ search, setSearch, dispatch, canUndo, canRedo }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Project Board</h1>
        <p className="text-xs text-slate-400">
          Drag cards across columns · reorder within a column · click priority to cycle
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards..."
            className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 w-48"
          />
        </div>
        <button
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={!canUndo}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50"
          title="Undo"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={() => dispatch({ type: "REDO" })}
          disabled={!canRedo}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50"
          title="Redo"
        >
          <Redo2 size={16} />
        </button>
        <AddCardForm />
      </div>
    </div>
  );
}

export default function KanbanApp() {
  const [state, dispatch] = useReducer(boardReducer, initialHistoryState);
  const [search, setSearch] = useState("");
  const dnd = useDragReorder(dispatch);

  const filteredCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return state.present.cards;
    return state.present.cards.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [state.present.cards, search]);

  const boardValue = useMemo(() => ({ dispatch }), [dispatch]);

  return (
    <BoardContext.Provider value={boardValue}>
      <div className="w-full h-full min-h-[600px] bg-white p-5 flex flex-col font-sans">
        <Toolbar
          search={search}
          setSearch={setSearch}
          dispatch={dispatch}
          canUndo={state.past.length > 0}
          canRedo={state.future.length > 0}
        />
        <div className="flex gap-3 flex-1 overflow-x-auto pb-2">
          {COLUMNS.map((col) => (
            <Column key={col} column={col} cards={filteredCards} dnd={dnd} />
          ))}
        </div>
      </div>
    </BoardContext.Provider>
  );
}