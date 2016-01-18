import React from 'react';

import SectionBinder from '../binders/SectionBinder.js';
import ArticleView from './article.jsx';

class Doc extends React.Component {

    constructor() {
        super();
        this.state = {
            content: [],
            article: ""
        };
    }

    componentDidMount() {

        var _this = this;
        SectionBinder(this, ['getFromJson']);
        this.getFromJson('doc', function(data) {
            _this.setState({
                content: data,
                article: _this.getArticleFromUrl(data, _this.props.option || "model")//data[0].articles[0].content
            })
        });

    }

    getArticleFromUrl(data, option) {

        for (var i = 0, j = data.length; i<j; ++i) {
            for (var k = 0, l = data[i].articles.length; k<l; ++k) {
                if (option.toLowerCase().trim() === data[i].articles[k].title.toLowerCase().trim()) {
                    return data[i].articles[k].content;
                }
            }
        }
    }

    render() {
        var _this = this;
        return <div id="doc">
            <div className="documentation-menu">
                {
                    this.state.content.map(function(_cat,i) {
                        console.log(_cat)
                         return <div key={"category-"+i}>
                            <h2>{_cat.title}</h2>
                            <ol>
                                {
                                    _cat.articles.map(function (_article, j) {

                                        return <li key={"category-"+i+"-article-"+j}>
                                            <a onClick={_this.switchArticle.bind(_this, i,j)}>{_article.title}</a>
                                        </li>
                                    })

                                }
                            </ol>
                        </div>

                    })
                }
            </div>



             <section className="main">
                <div>
                    <ArticleView ref="article" htmlContent={ this.state.article} />
                </div>
            </section>

        </div>;

    }


    switchArticle(categoryIndex, articleIndex) {
        this.refs.article.changeContent( this.state.content[categoryIndex].articles[articleIndex].content );
        App.router.setRoute('doc/'+ this.state.content[categoryIndex].articles[articleIndex].title, true);
    }
}

export default Doc;