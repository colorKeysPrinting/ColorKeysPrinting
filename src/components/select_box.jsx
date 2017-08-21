import React                                from 'react';
import { PropTypes }                        from 'prop-types';
import _                                    from 'lodash';
import assets                               from 'libs/assets';

export default class Select extends React.Component {
    static propTypes = {
        value   : PropTypes.bool.isRequired,
        options : PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            isActive: '',
            onChange: (this.props.onChange) ? this.props.onChange : ({value}) => {console.log('using internal function'); this.setState({value})}
        };

        this.showOptions = this.showOptions.bind(this);
    }

    showOptions() {
        this.setState((prevState) => {
            const isActive = (prevState.isActive) ? false : true;
            return { isActive };
        });
    }

    render() {
        const className = (this.props.className) ? this.props.className : 'select-box';
        const name = (this.props.name) ? this.props.name : '';

        const options = _.map(this.props.options, (option, i) => {
            const className = (option.className) ? option.className : 'option';

            return (
                <div
                    key={`option${i}`}
                    className={className}
                    value={option.value}
                    onClick={() => { this.showOptions(); this.state.onChange(option.value) }}
                >
                    { option.label }
                </div>
            );
        });

        const selectedOption = _.find(this.props.options, (option) => { return option.value === this.props.value });
        const isActiveClass = (this.state.isActive) ? 'select-options-active' : 'select-options';
        const arrowImg = (this.state.isActive) ? assets('./images/icons-arrow-up.png') : assets('./images/icons-arrow-down.png');

        return (
            <div className={className} >
                <div className="input" onClick={this.showOptions}>
                    <div>{ selectedOption.label }</div>
                    <div className="arrow-indicator" ><img src={arrowImg} alt="arrow" height="7px" /></div>
                </div>
                <div className={isActiveClass} >
                    { options }
                </div>
            </div>
        )
    }
}