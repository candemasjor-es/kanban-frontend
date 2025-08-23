import {
    createSlice,
    createAsyncThunk,
    createSelector,
} from "@reduxjs/toolkit";
import { boardsApi, cardsApi } from "../../utils/api";

// --- Thunks ---
export const fetchBoard = createAsyncThunk(
    "kanban/fetchBoard",
    async (boardId, { rejectWithValue }) => {
        try {
            const board = await boardsApi.get(boardId);
            return { boardId, board };
        } catch (err) {
            return rejectWithValue(
                err?.response?.data || { message: "Error al cargar el tablero" }
            );
        }
    }
);

export const moveCard = createAsyncThunk(
    "kanban/moveCard",
    async ({ cardId, toColumnId, toPosition }, { rejectWithValue }) => {
        try {
            return await cardsApi.move({ cardId, toColumnId, toPosition });
        } catch (err) {
            return rejectWithValue(
                err?.response?.data || {
                    message: "No se pudo mover la tarjeta",
                }
            );
        }
    }
);

// --- State ---
const initialState = {
    boardId: null,
    board: null,
    loading: false,
    error: null,
    _snapshot: null,
};

// helpers
const findColumn = (columns, id) =>
    columns.find((c) => String(c.id) === String(id));

const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers: {
        reorderColumns(state, action) {
            const { sourceIndex, destinationIndex } = action.payload;
            const [removed] = state.board.columns.splice(sourceIndex, 1);
            state.board.columns.splice(destinationIndex, 0, removed);
        },
        moveCardLocal(state, action) {
            const { cardId, fromColumnId, toColumnId, toPosition } =
                action.payload;
            state._snapshot = JSON.parse(JSON.stringify(state.board));
            const fromCol = findColumn(state.board.columns, fromColumnId);
            const toCol = findColumn(state.board.columns, toColumnId);
            if (!fromCol || !toCol) return;
            const srcIndex = fromCol.cards.findIndex(
                (c) => String(c.id) === String(cardId)
            );
            if (srcIndex < 0) return;
            const [moved] = fromCol.cards.splice(srcIndex, 1);
            const safe = Math.min(Number(toPosition), toCol.cards.length);
            toCol.cards.splice(safe, 0, moved);
        },
        rollbackMove(state) {
            if (state._snapshot) {
                state.board = state._snapshot;
                state._snapshot = null;
            }
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchBoard.pending, (s) => {
            s.loading = true;
            s.error = null;
        })
            .addCase(fetchBoard.fulfilled, (s, a) => {
                s.loading = false;
                s.boardId = Number(a.payload.boardId);
                s.board = a.payload.board;
            })
            .addCase(fetchBoard.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || a.error;
            })
            .addCase(moveCard.fulfilled, (s) => {
                s._snapshot = null;
            })
            .addCase(moveCard.rejected, (s, a) => {
                s.error = a.payload || a.error;
                if (s._snapshot) {
                    s.board = s._snapshot;
                    s._snapshot = null;
                }
            });
    },
});

export const { reorderColumns, moveCardLocal, rollbackMove } =
    kanbanSlice.actions;

// --- Selectores memoizados (evita warnings) ---
const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_BOARD = Object.freeze({
    id: null,
    title: "",
    columns: EMPTY_ARRAY,
});

export const selectBoard = (s) => s.kanban.board ?? EMPTY_BOARD;
export const selectColumns = createSelector(
    (s) => s.kanban.board?.columns,
    (cols) => cols ?? EMPTY_ARRAY
);
export const selectKanbanLoading = (s) => s.kanban.loading;

export default kanbanSlice.reducer;
