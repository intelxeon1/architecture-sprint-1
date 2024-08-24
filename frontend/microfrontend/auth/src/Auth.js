import React from "react";
import ProtectedRoute from "./ProtectedRoute"
import Header from "./Header"
import Footer from "./Footer"
import CurrentUserContext from "shared"
import * as auth from "./auth_api"



export default () => {

    const history = useHistory();

    function closeAllPopups() {
        setIsInfoToolTipOpen(false);
    }

    function onRegister({ email, password }) {
        auth
            .register(email, password)
            .then((res) => {
                setTooltipStatus("success");
                setIsInfoToolTipOpen(true);
                history.push("/signin");
            })
            .catch((err) => {
                setTooltipStatus("fail");
                setIsInfoToolTipOpen(true);
            });
    }

    function onLogin({ email, password }) {
        auth
            .login(email, password)
            .then((res) => {
                setIsLoggedIn(true);
                setEmail(email);
                history.push("/");
            })
            .catch((err) => {
                setTooltipStatus("fail");
                setIsInfoToolTipOpen(true);
            });
    }

    function onSignOut() {
        // при вызове обработчика onSignOut происходит удаление jwt
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        // После успешного вызова обработчика onSignOut происходит редирект на /signin
        history.push("/signin");
    }

    const [currentUser, setCurrentUser] = React.useState({});
    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
    const [tooltipStatus, setTooltipStatus] = React.useState("");

    React.useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            auth
                .checkToken(token)
                .then((res) => {
                    setEmail(res.data.email);
                    setIsLoggedIn(true);
                    history.push("/");
                })
                .catch((err) => {
                    localStorage.removeItem("jwt");
                    console.log(err);
                });
        }
    }, [history]);

    React.useEffect(() => {
        api
            .getAppInfo()
            .then(([cardData, userData]) => {
                setCurrentUser(userData);
                setCards(cardData);
            })
            .catch((err) => console.log(err));
    }, []);
    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page__content">
                <Switch>
                    <ProtectedRoute
                        exact
                        path="/"
                        component={Header}
                        email={email}
                        onSignOut={onSignOut}
                    />
                    <Route path="/signup">
                        <Register onRegister={onRegister} />
                    </Route>
                    <Route path="/signin">
                        <Login onLogin={onLogin} />
                    </Route>
                </Switch>
                <Footer />
                <InfoTooltip
                    isOpen={isInfoToolTipOpen}
                    onClose={closeAllPopups}
                    status={tooltipStatus}
                />
            </div>
        </CurrentUserContext.Provider>
    )
};
