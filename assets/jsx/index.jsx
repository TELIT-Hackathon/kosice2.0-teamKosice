import ReactDOMClient from "react-dom/client";
import React from 'react';
import MainPage from "./main_page.jsx";

import { BrowserRouter as Router, Route, Routes,useSearchParams } from "react-router-dom";


ReactDOMClient.createRoot(
    document.getElementById("app")
)
.render(<div>
    <Router>
        <Routes>
            <Route path="/" element={<MainPage/>} />
        </Routes>
    </Router>
    </div>
);