import { createContext } from "preact";
import { useState } from "preact/hooks";

type ToastObject = {
	message: string;
	color: "green" | "red";
};

type ContextProps = {
	showToastNotification: (message: string, color: "green" | "red") => void;
	// toastVisible: boolean;
};

export const ToastContext = createContext<ContextProps>({});

const ToastContextProvider = ({ children }) => {
	const [toastVisible, setToastVisible] = useState(false);
	const [toast, setToast] = useState<ToastObject>();

	const showToastNotification = (message: string, color: "green" | "red") => {
		try {
			setToast({
				message,
				color,
			});
			setToastVisible(true);

			// console.log("showing toast with", toast);

			setTimeout(function () {
				setToast(); //typesafe
				setToastVisible(false);
			}, 2000);
		} catch (error) {
			// console.log("show error", error);
		}
	};

	return (
		<ToastContext.Provider value={{ showToastNotification }}>
			{children}
			{toastVisible && (
				<div id="status" style={{ backgroundColor: toast?.color }}>
					{toast?.message}
				</div>
			)}
		</ToastContext.Provider>
	);
};

export default ToastContextProvider;
