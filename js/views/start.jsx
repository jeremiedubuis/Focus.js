import React from 'react';

import SectionBinder from '../binders/SectionBinder.js';
import ArticleView from './article.jsx';

class Start extends React.Component {

    constructor() {
        super();
        this.state = {
            content: ""
        };
    }

    componentWillMount() {
        SectionBinder(this, ["getFromJson"]);
        this.getFromJson('start');
    }

    componentDidMount() {
        this.refs.article.changeContent(this.state.content);
    }

    render() {
        return <section className="main">
            <div>
                <ArticleView ref="article" htmlContent={this.state.content} />
            </div>
            </section>;
    }

}

export default Start;