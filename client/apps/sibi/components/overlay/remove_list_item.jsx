import React                                     from 'react';
import assets                                    from '../../libs/assets';

export default function RemoveListItem(props) {
    let title, message, productID;
    let list = props.list;

    let styles = {
        container: {
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            width: '490px',
            margin: '10em auto',
        },
        titleBar: {
            display: 'inline-flex',
            backgroundColor: '#FFF',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            height: '20%',
            width: '100%'
        },
        title: {
            textAlign: 'left',
            padding: '30px',
            width: '90%'
        },
        close: {
            cursor: 'pointer',
            textAlign: 'right',
            padding: '30px',
            width: '10%'
        },
        content: {
            margin: '20px auto 0px',
            textAlign: 'left',
            display: 'inline-grid',
        },
        text: {
            margin: '10px'
        },
        submitBtn: {
            backgroundColor: 'rgb(47, 205, 237)',
            borderRadius: '5px',
            color: '#FFF',
            cursor: 'pointer',
            height: '50px',
            width: '50%',
            margin: '20px auto',
            paddingTop: '10px',
            padding: '18px'
        },
        cancelBtn: {
            cursor: 'pointer',
            height: '50px',
            width: '50%',
            margin: '20px auto',
            paddingTop: '10px',
            border: '1px solid #C0C0C0',
            color: 'rgb(47, 205, 237)',
            borderRadius: '5px',
        }
    };

    if(props.product) {
        title = 'Remove Item from';
        message = `Are you sure you want to remove "${ props.product.name }" from ${ list.name }`;
        productID = props.product.id;
    } else {
        title = 'Delete'
        message = `Are you sure you want to remove "${ list.name }"`;
    }

    let modelNum = (props.product) ? props.product.modelNum : '';
    let redirect = (props.overlayObj.redirect) ? props.overlayObj.redirect : '';

    return (
        <div style={styles.container}>
            <div style={styles.titleBar}>
                <div style={styles.title}>{ title } { list.name }</div>
                <div onClick={props.close} style={styles.close}>X</div>
            </div>
            <div style={styles.content}>
                <p>{ message }</p>
            </div>
            <div style={{display: 'inline-flex', width: '100%'}}>
                <div style={styles.cancelBtn} onClick={props.close}>Cancel</div>
                <div style={styles.submitBtn} onClick={()=>props.removeProduct({listType: props.overlayObj.listType, listID: list.id, productID, redirect})}>Remove</div>
            </div>
        </div>
    );
}
