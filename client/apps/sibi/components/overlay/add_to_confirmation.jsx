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
        }
    };

    let title;
    let product = props.product;
    let collection = props.overlayObj.collectionObj;
    let viewType = (props.overlayObj.type === 'Matchup') ? <div className="cancel-btn" onClick={()=>props.changeOverlay('customMatchup')} style={{margin: '7px auto'}} >View Matchup</div>
                                                         : <Link className="cancel-btn" to={`/products/myList-${ collection.id }`} style={{margin: '7px auto'}} >View List</Link>;

    return (
        <div style={styles.container}>
            <div style={styles.titleBar}>
                <div>1 Item Added to &nbsp;</div>
                <div style={styles.title} >{ collection.name }</div>
            </div>
            <div style={styles.content}>
                <div style={{display: 'inline-flex'}}>
                    <div><img src={''} alt={product.modelNumber} height="200" width="175" style={styles.image} /></div>
                    <div>
                        <div>{ product.name }</div>
                        <div>Model # { product.modelNumber }</div>
                    </div>
                </div>
                <div style={styles.text} >*SIBI does not guarantee the products you add to a custom matchup will function together properly.</div>
                <div style={{display: 'inline-flex', width: '100%'}}>
                    { viewType }
                    <div className="submit-btn" onClick={props.close} style={{margin: '7px auto'}} >Continue Shopping</div>
                </div>
            </div>
        </div>
    );
}
