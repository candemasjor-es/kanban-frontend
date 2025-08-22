import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api", // proxy Vite
    withCredentials: false, // en dev, mejor sin cookies; si usas cookies, activa y configura CORS en backend
});

const toStr = (v, fb) => String(v ?? fb);

const normalizeBoard = (dto) => ({
    id: dto.id,
    title: dto.title || dto.name || `Board ${dto.id}`,
    columns: (dto.columns || []).map((col) => ({
        id: toStr(
            col.id ?? col.column_id,
            `col-${col.name ?? col.title ?? "x"}`
        ),
        title: col.title || col.name,
        cards: (col.cards || []).map((card) => ({
            id: toStr(card.id ?? card.card_id, undefined),
            title: card.title || card.name,
            description: card.description || "",
            tags: card.tags || [],
        })),
    })),
});

export const boardsApi = {
    list() {
        return api.get(`/boards`).then((r) => r.data); // [{ id, name, created_at }]
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
    create({ boardId, columnId, title, description = "", tags = [] }) {
        return api
            .post(`/cards`, { boardId, columnId, title, description, tags })
            .then((r) => r.data);
    },
    update({ cardId, boardId, title, description, tags }) {
        return api
            .patch(`/cards/${cardId}`, { boardId, title, description, tags })
            .then((r) => r.data);
    },
    move({ cardId, boardId, fromColumnId, toColumnId, toIndex }) {
        return api
            .post(`/cards/${cardId}/move`, {
                boardId,
                fromColumnId,
                toColumnId,
                toIndex,
            })
            .then((r) => r.data);
    },
    remove({ cardId, boardId }) {
        return api
            .delete(`/cards/${cardId}`, { data: { boardId } })
            .then((r) => r.data);
    },
};
