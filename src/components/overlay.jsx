import React                    from 'react';

export default class Overlay extends React.Component {
    
    render() {
        const styles = {
            overlayBackground: {
                display: 'block',
                position: 'absolute',
                backgroundColor: (this.props.type !== 'productAddTo' && this.props.type !== 'profile') ? 'rgba(50, 50, 50, 0.4)' : '',
                width: '100%',
                top: '0',
                left: '0',
                zIndex: '999'
            },
            closeSection: {
                height: '100%',
                width: '100%'
            }
        }

        return (
            <div id="overlay-container" style={styles.overlayBackground}>
                { this.props.children }
            </div>
        );
    }
}