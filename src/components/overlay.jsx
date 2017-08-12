import React                    from 'react';

export default class Overlay extends React.Component {
    // fileDrop(type, value) {
    //     let isCorrect = true, errorMsg = '';

    //     console.log(type, value);

    //     const re = new RegExp('.(png|jpg|jpeg)', 'i');
    //     const maxSize = 25000; // 25KB = bytes

    //     const result = re.exec(value.name);

    //     if (!result) {
    //         isCorrect = false;
    //         errorMsg += "Incorrect file type!\n\tPlease upload a .PNG or .JPG\n\n"
    //     }

    //     if (value.size > maxSize) {
    //         isCorrect = false;
    //         errorMsg += "File is too big!\n\tPlease upload a file no larger than 25KB\n\n";
    //     }

    //     if (isCorrect) {
    //         this.setState((prevState) => {
    //             prevState.pictures.push(value);
    //             return { pictures: prevState.pictures };
    //         });
    //         this.changeOverlay('editProduct');
    //         return true;

    //     } else {
    //         this.setState({ errorMsg });
    //         return false;
    //     }
    // }
    render() {
        const styles = {
            overlayBackground: {
                display: 'block',
                position: 'absolute',
                backgroundColor: (this.props.type !== 'productAddTo' && this.props.type !== 'profile') ? 'rgba(50, 50, 50, 0.4)' : '',
                height: '100%',
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
        // case 'profile':
        //     overlay = (
        //         <Profile
        //             profilePic={this.state.activeUser.profilePic}
        //             username={this.state.activeUser.username}
        //             changeLanguage={this.props.changeLanguage}
        //             logout={this.props.logout}
        //         />);

        //     closeSection = <div onClick={this.close} style={styles.closeSection}></div>;
        //     break;

        // case 'filePhotos':
        //     overlay = (
        //         <FileUploader
        //             type={this.state.activeOverlay}
        //             fileDrop={this.fileDrop}
        //             close={this.close}
        //             errorMsg={this.state.errorMsg}
        //         />);
        //     break;
        return (
            <div id="overlay-container" style={styles.overlayBackground}>
                { this.props.children }
            </div>
        );
    }
}