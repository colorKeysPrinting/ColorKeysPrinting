import React                                     from 'react';
import assets                                    from '../../libs/assets';

export default function EditProduct(props) {
    let inputs, actionSection, close;

    const styles = {
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
        }
    };

    const title = (props.overlayObj) ? 'Edit Product' : 'Add Product';

    const categories = _.map(props.productCategories, (category) => (<option key={category.id} value={category.id}>{ category.name }</option>));

    const content = (<form onSubmit={props.saveProduct}>
        <div style={styles.content}>
            <div style={{ columnCount: 2, display: 'inline-flex', width: '540px' }}>
                <select value={props.category} onChange={(e) => props.update('category', e.target.value)} required >
                    <option disabled selected value="" >Select category</option>
                    { categories }
                </select>
                <input type="text" placeholder="Product name" value={props.productName} onChange={(e) => props.update('productName', e.target.value)} required />
                <input type="text" placeholder="Classification"  value={props.classification}  onChange={(e) => props.update('classification', e.target.value)}  required />
            </div>
            <div><input type="checkbox" /></div>
        </div>
        <input className="submit-btn" type="submit" value="add" style={{ width: '89%' }} />
    </form>);

    return (
        <div style={styles.container}>
            { title }
            { content }
        </div>
    );
}
