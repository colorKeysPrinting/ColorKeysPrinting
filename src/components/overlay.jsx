import React                    from 'react';
import { withRouter }           from 'react-router';

export default withRouter(
    class Overlay extends React.Component {

        render() {
            const styles = {
                overlayBackground: {
                    backgroundColor: (this.props.type !== 'profile') ? 'rgba(69, 87, 126, 0.4)' : '',
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }

            return (
                <div id="overlay-container" style={styles.overlayBackground} onClick={this.props.closeOverlay}>
                    { this.props.children }
                </div>
            );
        }
    }
)