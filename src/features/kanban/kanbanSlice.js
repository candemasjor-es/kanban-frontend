import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { boardsApi, cardsApi } from "../../utils/api";

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
    async (
        { cardId, boardId, fromColumnId, toColumnId, toIndex },
        { rejectWithValue }
    ) => {
        try {
            const data = await cardsApi.move({
                cardId,
                boardId,
                fromColumnId,
                toColumnId,
                toIndex,
            });
            return data;
        } catch (err) {
            return rejectWithValue(
                err?.response?.data || {
                    message: "No se pudo mover la tarjeta",
                }
            );
        }
    }
);

const initialState = {
    boardId: null,
    board: null,
    loading: false,
    error: null,
    _snapshot: null,
};

const findColumn = (columns, id) =>
    columns.find((c) => String(c.id) === String(id));

const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers: {
        reorderColumns(state, action) {
            const { sourceIndex, destinationIndex } = action.payload;
            const cols = state.board.columns;
            const [removed] = cols.splice(sourceIndex, 1);
            cols.splice(destinationIndex, 0, removed);
        },
        moveCardLocal(state, action) {
            const { cardId, fromColumnId, toColumnId, toIndex } =
                action.payload;
            state._snapshot = JSON.parse(JSON.stringify(state.board));
            const columns = state.board.columns;
            const fromCol = findColumn(columns, fromColumnId);
            const toCol = findColumn(columns, toColumnId);
            if (!fromCol || !toCol) return;
            const srcIndex = fromCol.cards.findIndex(
                (c) => String(c.id) === String(cardId)
            );
            if (srcIndex < 0) return;
            const [moved] = fromCol.cards.splice(srcIndex, 1);
            const safeIndex = Math.min(toIndex, toCol.cards.length);
            toCol.cards.splice(safeIndex, 0, moved);
        },
        rollbackMove(state) {
            if (state._snapshot) {
                state.board = state._snapshot;
                state._snapshot = null;
            }
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchBoard.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.boardId = Number(action.payload.boardId);
                state.board = action.payload.board;
            })
            .addCase(fetchBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error;
            })
            .addCase(moveCard.fulfilled, (state) => {
                state._snapshot = null;
            })
            .addCase(moveCard.rejected, (state, action) => {
                state.error = action.payload || action.error;
                if (state._snapshot) {
                    state.board = state._snapshot;
                    state._snapshot = null;
                }
            });
    },
});

export const { reorderColumns, moveCardLocal, rollbackMove } =
    kanbanSlice.actions;
export const selectBoard = (s) => s.kanban.board;
export const selectColumns = (s) => s.kanban.board?.columns || [];
export const selectKanbanLoading = (s) => s.kanban.loading;
export default kanbanSlice.reducer;
