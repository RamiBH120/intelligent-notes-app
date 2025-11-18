"use client";

import { NoteProviderContext } from "@/app/providers/NoteProvider";
import React from "react";

function useNote() {
    const context = React.useContext(NoteProviderContext);
    if (!context) {
        throw new Error("useNote must be used within a NoteProvider");
    }

    return context;
}

export default useNote;