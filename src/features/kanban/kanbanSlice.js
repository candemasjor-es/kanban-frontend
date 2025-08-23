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

// --- Estado inicial ---
const initialState = {
    boardId: null,
    board: null,
    loading: false,
    error: null,
    _snapshot: null,
};

// helpers
const findColumn = (columns, id) =>
    columns?.find((c) => String(c.id) === String(id));

// --- Slice ---
const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers: {
        // movimiento optimista solo de cards
        moveCardLocal(state, action) {
            const { cardId, fromColumnId, toColumnId, toPosition } =
                action.payload;
            if (!state.board) return;
            state._snapshot = JSON.parse(JSON.stringify(state.board));

            const fromCol = findColumn(state.board.columns, fromColumnId);
            const toCol = findColumn(state.board.columns, toColumnId);
            if (!fromCol || !toCol) return;

            const idx = fromCol.cards.findIndex(
                (c) => String(c.id) === String(cardId)
            );
            if (idx < 0) return;

            const [moved] = fromCol.cards.splice(idx, 1);
            const dst = Math.min(Number(toPosition), toCol.cards.length);
            toCol.cards.splice(dst, 0, moved);
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
                s._snapshot = null; // commit del optimista
            })
            .addCase(moveCard.rejected, (s, a) => {
                s.error = a.payload || a.error;
                if (s._snapshot) {
                    s.board = s._snapshot; // rollback
                    s._snapshot = null;
                }
            });
    },
});

export const { moveCardLocal, rollbackMove } = kanbanSlice.actions;

// --- Selectores memoizados ---
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

// --- Reducer por defecto ---
export default kanbanSlice.reducer;
