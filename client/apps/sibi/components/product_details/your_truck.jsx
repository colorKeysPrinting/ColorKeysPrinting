import React                    from 'react';
import assets                   from '../../libs/assets';
import _                        from 'lodash';

export default class YourTruck extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let truck;

        let styles = {
            container: {
                height: ("innerHeight" in window) ? window.innerHeight : document.documentElement.offsetHeight,
                width: '20%',
                backgroundColor: '#F4F8FB'
            },
            title: {
                padding: '10px',
                fontSize: '18px'
            }
        };

        if(_.size(this.props.truck) > 0) {

            truck = _.map(this.props.truck, (item, key)=>{
                let image = (item.image) ? item.image : '';

                return (
                    <div key={key}>
                        <div><img src={image} alt={item.modelNum} /></div>
                        <div>{item.name}</div>
                    </div>
                );
            });

        } else {
            truck = <div>
                        <div><img src={assets('./images/empty-truck.png')} width="100%"/></div>
                        <div>Your truck is empty</div>
                    </div>;
        }



        return (
            <div id="your-truck-section" style={styles.container}>
                <div style={styles.title}>YOUR TRUCK</div>
                <hr />
                { truck }
            </div>
        );
    }

}