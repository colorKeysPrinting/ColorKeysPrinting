import React    from 'react';

export default function AddToConfirmationOverlay(props) {

    let styles = {
        container: {
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            width: '490px',
            margin: '10em auto',
            zIndex: '999'
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
            width: '89%',
            margin: '0px auto',
            marginTop: '40px',
            textAlign: 'left'
        },
        submitBtn: {
            borderRadius: '5px',
            cursor: 'pointer',
            height: '40px',
            width: '86%',
            margin: '20px auto',
            paddingTop: '10px'
        }
    };

    let title;

    return (
        <div style={styles.container}>
            <div style={ styles.titleBar }>
                <div style={styles.title}>1 Item Added to <div>{props.addToConfTitle}</div></div>
            </div>
            <div style={styles.content}>
                <div>
                    <div><img src={''} alt={props.product.modelNum} /></div>
                    <div>
                        <div>{props.product.name}</div>
                        <div>{props.product.modelNum}</div>
                    </div>
                </div>
                <div>*SIBI does not guarantee the products you add to a custom matchup will function together properly.</div>
                <div>
                    <div onClick={()=>props.changeOverlay('customMatchup')}>View Matchup</div>
                    <div onClick={props.close}>Continue Shopping</div>
                </div>
            </div>
        </div>
    );
}
