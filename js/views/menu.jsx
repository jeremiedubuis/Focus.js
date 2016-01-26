import React from 'react';


class Menu extends React.Component {

    constructor() {
        super();
        this.state = {
            menuToggled: false
        };
    }

    componentDidMount() {

        App.dispatcher.register(App.constants.actions.viewChange, this.closeMobileMenu, this);
    }

    componentWillUnmount() {

        App.dispatcher.unregister(App.constants.actions.viewChange, this.closeMobileMenu, this);
    }

    render() {
        return <nav>
            <button id="menu-toggle" onClick={this.toggleMobileMenu.bind(this)}>Menu</button>
            <ul className={this.state.menuToggled ? "menu-toggled" : ""}>

                <li>
                    <a href="#start">Get Started</a>
                </li>

                <li>
                    <a href="#doc">Documentation</a>
                </li>

                <li>
                    <a>Github</a>
                </li>

            </ul>
        </nav>;
    }

    toggleMobileMenu() {
        console.log(this);
        this.setState({
            menuToggled: !this.state.menuToggled
        })
    }

    closeMobileMenu() {
        this.setState({
            menuToggled: false
        });
    }

}

export default Menu;