import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from 'react';
import AppContext from "../context/AppContext";

let onceExecute = false

function Init() {

    const { api } = useContext(AppContext);
    let navigate = useNavigate();

    useEffect(() => navigate("/Home"), [navigate]);

    if (!onceExecute) {
        api.checkServeurStatus()
        onceExecute = true
    }
        

    return <></>;
}

export default Init;