import React from 'react';

import SectionBinder from '../binders/SectionBinder.js';
import ArticleView from './article.jsx';

class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            content: ""
        };
    }

    componentWillMount() {
        SectionBinder(this, ["getFromJson"]);
        this.getFromJson('home');
    }

    componentDidMount() {
        this.refs.article.changeContent(this.state.content);
    }

    render() {
        return <div id="home">

            <section className="top">
                <div>
                    <img src="img/logo.png" alt="" className="logo"/>

                    <p className="intro">
                    Focus.js is a front-end framework built to simplify single page application communication.
                    It is an experimental framework that uses method binders as a means of making views
                    and data communicate using clear cut separation of concerns.
                    </p>

                    <ul className="buttons">

                        <li><a href="#start">Get Started</a></li>

                        <li><a>Download v0.1.0</a></li>

                    </ul>
                </div>
            </section>


            <section className="main">
                <div>
                    <ArticleView ref="article"  htmlContent={this.state.content} />
                </div>
            </section>

        </div>;
    }
}

export default Home;