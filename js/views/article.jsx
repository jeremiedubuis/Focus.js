import React from 'react';

class Article extends React.Component {

    constructor() {
        super();
        this.mainRegex = new RegExp(/(\n\n|\*\*(?:[\s\S]*?)\*\*|'''(?:[\s\S]*?)'''|\*\s(?:[\s\S]*?)\n)/g);
        this.titleRegex = new RegExp(/(?:\*\*([\s\S]*?)\*\*)/);
        this.codeRegex = new RegExp(/(?:'''([\s\S]*?)''')/);
        this.listRegex = new RegExp(/(?:\*\s(?:[\s\S]*?)\n)/);
        this.ul = [];
        this.state = {
            content: []
        };
    }

    setContent() {
        if (this.props.htmlContent && !this.state.content.length) this.setState( {content: this.formatText(this.props.htmlContent) });
    }

    changeContent(content) {
         this.setState( {content: this.formatText(content) });
    }

    formatText(_text) {

        var _this = this;
        var _content = [];
        _text = _text.split(this.mainRegex);
        _text.forEach( function(_frag) {
            if (_this.codeRegex.test(_frag))  {
                    _content.push( {type: "code", value: _frag.match(_this.codeRegex)[1] } );
             } else if (!/\n\n/g.test(_frag) ) {
                if (_this.titleRegex.test(_frag))  _content.push( {type: "h2", value: _frag.match(_this.titleRegex)[1] } );
                else if (_this.listRegex.test(_frag)) _content.push( {type: "li", value: _frag.replace('*','') });
                else if (_frag!=="") _content.push({type: "p", value: _frag});
            }

        });

        for (let i = 0, j = _content.length; i<j; ++i) {
            if (_content[i].type === "li") {
                if (i>0 && _content[i-1].type !== "li" && _content[i-1].type !== "ul") {
                    _content.splice(i, 0, {type: "ul"});
                }
                if ( _content[i+1] && _content[i+1].type !== "li" && _content[i+1].type !== "endul") {
                    _content.splice(i+1, 0, {type: "endul"});
                }
            }
        }
        return _content;
    }

    render() {

        return <article>
            {this.state.content.map(this.renderText.bind(this))}
        </article>;

    }

    renderText(_tag, i) {
        switch (_tag.type) {

            case "p":
                return <p key={i} dangerouslySetInnerHTML={ {__html:_tag.value.replace(/\n/g, "<br/>") }}></p>;
                break;

            case "h2":
                return <h2 key={i}>{_tag.value}</h2>;
                break;

            case "code":
                return <pre key={i}><code clasName="js">{_tag.value}</code></pre>;
                break;
            case "ul":
                this.ul = [];
                break;
            case "li":
                this.ul.push(_tag.value);
                break;
            case "endul":
                return <ul key={i}>
                {
                    this.ul.map(function(_li, i) {
                        return <li key={"li"+i}>{_li}</li>
                    })

                 }</ul>;
                break;

        }

    }


    componentDidUpdate() {

        this.setContent();
        this.highlightCode();

    }

    highlightCode() {

        var _codeBlocks = document.getElementsByTagName('code');
        for (var i = 0, j = _codeBlocks.length; i<j; ++i) {
            hljs.highlightBlock(_codeBlocks[i]);
        }

    }

}

export default Article;