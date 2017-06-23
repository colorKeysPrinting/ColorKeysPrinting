import React            from 'react';
import { Link }         from 'react-router';

export default function AddToConfirmationOverlay(props) {

    let styles = {
        container: {
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            width: '625px',
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
            width: '100%',
            padding: '30px',
            textAlign: 'left',
        },
        title: {
            color: '#06cfe5'
        },
        content: {
            width: '89%',
            margin: '0px auto',
            marginTop: '40px',
            textAlign: 'left'
        },
        image: {
            margin: '10px',
        },
        text: {
            color: '#F00',
            padding: '10px'
        },
        submitBtn: {
            backgroundColor: '#06cfe5',
            borderRadius: '5px',
            color: '#FFF',
            cursor: 'pointer',
            width: '200px',
            height: '46px',
            margin: '7px auto',
            textAlign: 'center',
            fontSize: '18px',
            paddingTop: '14px'
        },
        viewMatchup: {
            border: '1px solid #C0C0C0',
            borderRadius: '5px',
            color: 'rgb(47, 205, 237)',
            cursor: 'pointer',
            paddingTop: '14px',
            width: '200px',
            height: '46px',
            fontSize: '18px',
            margin: '7px auto',
            textAlign: 'center',
        }
    };

    let title;
    let product = props.product;
    let list = props.overlayObj.listObj;
    let viewType = (props.overlayObj.type === 'Matchup') ? <div onClick={()=>props.changeOverlay('customMatchup')} style={styles.viewMatchup} >View Matchup</div>
                                                         : <Link to={`/products/myList-${ list.id }`} style={styles.viewMatchup} >View List</Link>;

    return (
        <div style={styles.container}>
            <div style={styles.titleBar}>
                <div>1 Item Added to &nbsp;</div>
                <div style={styles.title} >{ list.name }</div>
            </div>
            <div style={styles.content}>
                <div style={{display: 'inline-flex'}}>
                    <div><img src={''} alt={product.modelNum} height="200" width="175" style={styles.image} /></div>
                    <div>
                        <div>{ product.name }</div>
                        <div>Model # { product.modelNum }</div>
                    </div>
                </div>
                <div style={styles.text} >*SIBI does not guarantee the products you add to a custom matchup will function together properly.</div>
                <div style={{display: 'inline-flex', width: '100%'}}>
                    { viewType }
                    <div onClick={props.close} style={styles.submitBtn} >Continue Shopping</div>
                </div>
            </div>
        </div>
    );
}
