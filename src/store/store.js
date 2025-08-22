import { configureStore } from "@reduxjs/toolkit";
import kanbanReducer from "../features/kanban/kanbanSlice";

export const store = configureStore({
    reducer: {
        kanban: kanbanReducer,
    },
    middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export default store;
