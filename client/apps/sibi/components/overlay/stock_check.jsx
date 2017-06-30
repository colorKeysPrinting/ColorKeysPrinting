import React    from 'react';

export default function StockCheck(props) {

    let styles = {
        container: {
            position: 'absolute',
            top: '190px',
            left: '735px',
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            width: '490px',
            margin: '10em auto',
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
            height: '50px',
            width: '50%',
            margin: '20px auto',
            paddingTop: '10px',
            padding: '18px'
        },
        cancelBtn: {
            height: '50px',
            width: '50%',
            margin: '20px auto',
            paddingTop: '10px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.text}>The inventory at this location is low.  Would you like to check and make sure the item is still available here?</div>
            </div>
            <div style={{display: 'inline-flex', width: '100%'}}>
                <div className="cancel-btn" style={styles.cancelBtn} onClick={props.close}>No, Thanks</div>
                <div className="submit-btn" style={styles.submitBtn} onClick={()=>props.checkingInventory(props.product.modelNum, props.location)}>Check</div>
            </div>
        </div>
    );
}
