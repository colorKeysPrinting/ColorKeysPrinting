import React                                from 'react';
import { PropTypes }                        from 'prop-types';
import _                                    from 'lodash';

export default class Select extends React.Component {
    static propTypes = {
        value   : PropTypes.string.isRequired,
        options : PropTypes.object.isRequired
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
            const isActive = (prevState.isActive === '.active') ? '' : '.active';
            return { isActive };
        });
    }

    render() {
        const className = (this.props.className) ? this.props.className : 'select-box';
        const name = (this.props.name) ? this.props.name : '';

        const options = _.map(this.props.options, (option) => {
            const className = (option.className) ? option.className : 'option';

            return (
                <div
                    className={className}
                    value={option.value}
                    onClick={() => { this.showOptions(); this.state.onChange(option.value) }}
                >
                    { option.label }
                </div>
            );
        });

        const selectedOption = _.find(this.props.options, (option) => { return option.value === this.props.value });

        return (
            <div className={className} >
                <div className="input" onClick={this.showOptions}>{ selectedOption.label }<div className={`arrow-indicator${this.state.isActive}`}></div></div>
                <div className={`select-options${this.state.isActive}`} >{ options }</div>
            </div>
        )
    }
}