'use strict';

import React                    from 'react';
import Scroll                   from 'react-scroll';
import _                        from 'lodash';
import assets                   from 'libs/assets';

export default class Navbar extends React.Component {
    constructor(props){
        super(props)
        const scroll = Scroll.animateScroll;

        this.state = { scroll }

        this.scrollToTop = this.scrollToTop.bind(this)
    }

    scrollToTop() {
        this.state.scroll.scrollToTop();
    }

    render(){
        return (
            <div>
                <br/>
                <div className="center">
                    <a className="btn waves-effect waves-light" onClick={this.scrollToTop}>Back To Top</a>
                </div>
                <footer className="page-footer black">
                    <div className="container">
                        <div className="row">
                            <div className="col l6 s12">
                                <p className="grey-text text-lighten-4">Copyright © 2016 Color Keys Printing - All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                    <div className="footer-copyright">
                        <div className="container">
                        Made with <a className="brown-text text-lighten-3" href="http://materializecss.com">Materialize</a>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}
