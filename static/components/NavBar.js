const { useEffect, useRef, useState } = React;
const { Link } = ReactRouterDOM

const NavBar = () => {
    const [showMobileNavBar, setShowMobileNavBar] = useState(false)
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" to="/">
                    <h1>Meteo de la mobilité pendant les JO</h1>
                </Link>

                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={_ => setShowMobileNavBar(!showMobileNavBar)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className={"navbar-menu " + (showMobileNavBar ? "is-active" : "")}>
                <div className="navbar-start">
                <Link className="navbar-item" to="/">
                    Introduction
                </Link>
                <Link to="/ceremonie_ouverture" className="navbar-item">
                    Cérémonie d'ouverture
                </Link>
                {/* <Link to="/general" className="navbar-item">
                    Statistiques générales
                </Link> */}
                <Link to="/sites" className="navbar-item">
                    Sites Olympiques
                </Link>
                <Link to="/exode" className="navbar-item">
                    Grands mouvements
                </Link>

                {/* <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">
                    More
                    </a>

                    <div className="navbar-dropdown">
                    <a className="navbar-item">
                        About
                    </a>
                    <a className="navbar-item is-selected">
                        Jobs
                    </a>
                    <a className="navbar-item">
                        Contact
                    </a>
                    <hr className="navbar-divider"></hr>
                    <a className="navbar-item">
                        Report an issue
                    </a>
                    </div>
                </div>*/}
                </div> 
            </div>
        </nav>
    )
}