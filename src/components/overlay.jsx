import React                    from 'react';
import { withRouter }           from 'react-router';

export default withRouter(
    class Overlay extends React.Component {
    
        render() {
            const styles = {
                overlayBackground: {
                    display: 'block',
                    position: 'absolute',
                    backgroundColor: (this.props.type !== 'profile') ? 'rgba(50, 50, 50, 0.4)' : '',
                    width: '100%',
                    height: '100%',
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
                <div id="overlay-container" style={styles.overlayBackground} onClick={() => {(this.props.type === 'profile') ? this.props.history.goBack() : null;}} >
                    { this.props.children }
                </div>
            );
        }
    }
)