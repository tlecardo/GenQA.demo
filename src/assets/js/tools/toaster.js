import { toast } from "react-toastify";

class Toaster {
    static errorInputs(text) {
        toast.error(text, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: "light"
        });
    };

    static successServeur(name) {
        toast.success(name, {
            delay: 1000*(1 + Math.random()),
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: "light"
        });
    };

    static warningServeur(name) {
        toast.warn(name, {
            delay: 1000*(1 + Math.random()),
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: "light"
        });
    };

    static errorServeur(name) {
        toast.error(name, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: "light"
        });
    };

    static successFile(name) {
        toast.success(`${name}.faq file has been created`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            progress: undefined,
            theme: "light"
        });
    };
}

export default Toaster;