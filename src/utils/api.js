import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api", // proxy de Vite
    withCredentials: false,
    headers: { "Content-Type": "application/json" },
});

const normalizeBoard = (dto) => ({
    id: dto.id,
    title: dto.title || dto.name || `Board ${dto.id}`,
    columns: (dto.columns || []).map((col) => ({
        id: String(col.id),
        title: col.title || col.name,
        cards: (col.cards || []).map((card) => ({
            id: String(card.id),
            title: card.title || card.name,
            description: card.description || "",
            tags: card.tags || [],
        })),
    })),
});

export const boardsApi = {
    list() {
        return api.get(`/boards`).then((r) => r.data);
    },
    get(boardId) {
        return api
            .get(`/boards/${boardId}`)
            .then((r) => normalizeBoard(r.data));
    },
};

export const columnsApi = {
    create({ boardId, title }) {
        return api.post(`/columns`, { boardId, title }).then((r) => r.data);
    },
    update({ columnId, boardId, title, toIndex }) {
        return api
            .patch(`/columns/${columnId}`, { boardId, title, toIndex })
            .then((r) => r.data);
    },
    remove({ columnId, boardId }) {
        return api
            .delete(`/columns/${columnId}`, { data: { boardId } })
            .then((r) => r.data);
    },
};

export const cardsApi = {
    create({
        boardId,
        columnId,
        title,
        description,
        priority,
        dueDate,
        orderIndex,
    }) {
        return api
            .post(`/cards`, {
                boardId,
                columnId,
                title,
                description,
                priority,
                dueDate,
                orderIndex,
            })
            .then((r) => r.data);
    },
    update({ cardId, title, description, priority, dueDate }) {
        return api
            .patch(`/cards/${cardId}`, {
                title,
                description,
                priority,
                dueDate,
            })
            .then((r) => r.data);
    },
    // Alineado con tu CardMoveSchema: SOLO toColumnId + toPosition
    move({ cardId, toColumnId, toPosition }) {
        return api
            .post(`/cards/${cardId}/move`, { toColumnId, toPosition })
            .then((r) => r.data);
    },
    remove({ cardId }) {
        return api.delete(`/cards/${cardId}`).then((r) => r.data);
    },
};
