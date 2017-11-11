'use strict';

import React                    from 'react';
import Scroll                   from 'react-scroll';
import { Col, CardPanel, Card, Button } from 'react-materialize';
import _                        from 'lodash';
import assets                   from 'utils/assets';

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
                    <Button waves="light" className="waves-effect" onClick={this.scrollToTop}>Back To Top</Button>
                </div>
                <footer className="page-footer black">
                    <div className="container">
                        <div className="row">
                            <Col s={12} m={16} >
                                <p className="grey-text text-lighten-4">Copyright © 2016 Color Keys Printing - All Rights Reserved.</p>
                            </Col>
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
