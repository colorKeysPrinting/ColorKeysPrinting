import React                                     from 'react';
import assets                                    from '../../libs/assets';

export default function RemoveItem(props) {

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

    let listType = (props.listType === 'myList') ? 'list' : 'matchup';

    return (
        <div style={styles.container}>
            <div style={styles.titleBar}>
                <div style={styles.title}>Remove Item from { props.list }</div>
                <div onClick={props.close} style={styles.close}>X</div>
            </div>
            <form onSubmit={()=>props.submitLoginBtn(props.type)}>
                <div style={styles.content}>
                    <p>Are you sure you want to remove "{ props.product.name }" from { props.list }</p>
                </div>
                <div style={{display: 'inline-flex', width: '100%'}}>
                    <div style={styles.cancelBtn} onClick={props.close}>Cancel</div>
                    <div style={styles.submitBtn} onClick={()=>props.removeProduct(props.list, props.product.modelNum)}>Remove</div>
                </div>
            </form>
        </div>
    );
}
