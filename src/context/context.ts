import { createContext } from "react";
import { AlertType } from "../components/shared/toast";

const GlobalContext = createContext<{
    alert: (alert: {message: string, type: AlertType}) => void,
}>({
    alert: () => {},
});

export default GlobalContext;