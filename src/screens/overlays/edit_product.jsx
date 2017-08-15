import React                    from 'react';
import { connect }              from 'react-redux';
import { withRouter }           from 'react-router';
import { withCookies }          from 'react-cookie';
import _                        from 'lodash';
import assets                   from 'libs/assets';

import { updateProduct, createProduct, archiveProduct }      from 'ducks/products/actions';

import Overlay                  from 'components/overlay';

class EditProduct extends React.Component {
    constructor(props) {
        super(props);

        const product = (this.props.location.state) ? this.props.location.state.product : {
            name: '',
            manufacturerModelNumber: '',
            serialNumber: '',
            shortDescription: '',
            sku: '',
            overview: '',
            specifications: '',
            faq: '',
            videos: [],
            productCategoryId: this.props.activeUser.tradeId,
            productSubcategoryId: '',
            applianceType: '',
            applianceSize: '',
            applianceDescription: '',
            sibiModelNumber: '',
            applianceFuelType: '',
            applianceWidth: '',
            applianceHeight: '',
            applianceDepth: '',
            applianceInstallDescription: '',
            applianceInstallPrice: '',
            applianceInstallCode: '',
            applianceColorsAndImages: [],
            applianceAssociatedParts: [],
            applianceSpecSheetUrl: '',
            applianceRemovalDescription: '',
            applianceRemovalCode: '',
            applianceRemovalPrice: '',
        };

        this.state = { 
            activeSection: '', 
            isInstall: false, 
            isRemoval: false,
            ...product 
        };

        this.update = this.update.bind(this);
        this.close = this.close.bind(this);
        this.changeActiveSection = this.changeActiveSection.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
    }

    update(type, value) {
        this.setState({ [type]: value });
    }

    close() {
        this.props.history.goBack();
    }

    changeActiveSection(activeSection) {
        this.setState((prevState) => { 
            activeSection = (prevState.activeSection !== activeSection) ? activeSection : '';

            return { activeSection };
        });
    }

    saveProduct({ id, activeUser }) {
        console.log('save product', id);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        const category = _.find(this.props.productCategories.toJS(), ['id', this.state.productSubcategoryId]);

        const product = {
            name: this.state.name,
            manufacturerModelNumber: this.state.manufacturerModelNumber || '',  // not in invision
            serialNumber: this.state.serialNumber || '',                        // not in invision
            shortDescription: this.state.shortDescription || '',                // not in invision
            sku: this.state.sku || '',                                          // not in invision
            overview: this.state.overview || '',                                // not in invision
            specifications: this.state.specifications || '',                    // not in invision
            faq: this.state.faq || '',                                          // not in invision
            videos: this.state.videos || [],                                    // not in invision
            productCategoryId: activeUser.tradeId,
            productSubcategoryId: this.state.productSubcategoryId,
            applianceType: this.state.applianceType || '',                      // not in invision
            applianceSize: this.state.size,
            applianceDescription: this.state.applianceDescription || '',
            sibiModelNumber: this.state.sibiModelNumber || '',                  // not in invision
            applianceFuelType: this.state.applianceFuelType || '',              // not in invision
            applianceWidth: this.state.applianceWidth || '',                    // not in invision
            applianceHeight: this.state.applianceHeight || '',                  // not in invision
            applianceDepth: this.state.applianceDepth || '',                    // not in invision
            applianceInstallDescription: this.state.applianceInstallDescription || '',    // not in invision
            applianceInstallPrice: this.state.applianceInstallPrice,
            applianceInstallCode: this.state.applianceInstallCode,
            applianceColorsAndImages: this.state.applianceColorsAndImages || [],
            applianceAssociatedParts: this.state.applianceAssociatedParts || [],
            applianceSpecSheetUrl: this.state.applianceSpecSheetUrl || '',              // not in invision
            applianceRemovalDescription: this.state.applianceRemovalDescription || '',  // not in invision
            applianceRemovalCode: this.state.applianceRemovalCode,
            applianceRemovalPrice: this.state.applianceRemovalPrice,
        };

        if (id) {
            product['id'] = id;
            
            this.props.updateProduct({ token: jwt.token, category: category.name, product });
        } else {

            this.props.createProduct({ token: jwt.token, category: category.name, product })
        }

        this.props.history.push(`/products`);
    }

    render() {
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-admin-jwt');
        
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
            checkbox: {
                // width: '60%',
                padding: '30px'
            },
            text: {
                margin: '10px'
            }
        };

        const category = _.find(this.props.productCategories.toJS(), ['id', this.state.productSubcategoryId]);
        const categories = _.map(this.props.productCategories.toJS(), (category) => {
            return <option key={category.id} value={category.id}>{ category.name }</option>;
        });
        const title = (this.props.location.state) ? 'Edit' : 'Add';
        const buttonTxt = (this.state.id) ? 'Update' : 'Add';
        const deleteBtn = (this.state.id) ? <div className="remove-btn" onClick={() => this.props.archiveProduct({ token: jwt.token, category, id: this.state.id })}>Remove Product</div> : null;
        
        return (
            <Overlay type="editProduct">
                <div style={styles.container}>
                    <div style={styles.titleBar} >
                        <div style={styles.title}>{ title } Product</div>
                        <div onClick={this.close} style={styles.close}>X</div>
                    </div>
                    <form onSubmit={() => this.saveProduct({ id: this.state.id ,activeUser: this.props.activeUser.toJS() })}>
                        <div style={styles.content}>
                            <div style={{ columnCount: 2, display: 'inline-flex', width: '540px' }}>
                                <div>
                                    <select value={this.state.productSubcategoryId} onChange={(e) => this.update('productSubcategoryId', e.target.value)} required >
                                        <option disabled selected value="" >Select category</option>
                                        { categories }
                                    </select>
                                </div>
                                <div><input type="text" placeholder="Product name"   value={this.state.name} onChange={(e) => this.update('name', e.target.value)}    required /></div>
                            </div>
                            <div style={{ columnCount: 2, display: 'inline-flex', width: '540px' }}>
                                <div><input type="text" placeholder="Classification" value={this.state.applianceDescription} onChange={(e) => this.update('applianceDescription', e.target.value)} required /></div>
                                <div><input type="text" placeholder="Size"           value={this.state.applianceSize}        onChange={(e) => this.update('applianceSize', e.target.value)}           required /></div>
                            </div>
                            <div id="accordion">
                                <div id="accordion-pictures" onClick={() => this.changeActiveSection('pictures')}>
                                    <div>{ _.size(this.state.applianceColorsAndImages) } Photos</div>
                                </div>
                                <div style={{ display: (this.state.activeSection === 'pictures') ? 'block' : 'none' }} > showing pictures </div>
                                <div id="accordion-parts" onClick={() => this.changeActiveSection('parts')} >
                                    <div>{ _.size(this.state.applianceAssociatedParts) } Parts</div>
                                </div>
                                <div style={{ display: (this.state.activeSection === 'parts') ? 'block' : 'none' }} > showing parts </div>
                            </div>
                            <div style={styles.checkbox}>
                                <input
                                    id="checkbox-is-ge-install"
                                    type="checkbox"
                                    onClick={() => this.update('isInstall', !(this.state.isInstall))}
                                    checked={this.state.isInstall}
                                    style={{ height: '15px', width: '30px' }}
                                />Option for GE to install
                            </div>
                            <div style={{ display: (this.state.isInstall) ? 'block' : 'none' }} >
                                <div><input type="text" placeholder="install code (e.g. M106)" value={this.state.applianceInstallCode} onChange={(e) => this.update('applianceInstallCode', e.target.value)} /></div>
                                <div><input type="number" placeholder="install value (e.g. 0.00)" value={this.state.applianceInstallPrice} onChange={(e) => this.update('applianceInstallPrice', e.target.value)} /></div>
                            </div>
                            <div style={styles.checkbox}>
                                <input
                                    id="checkbox-is-ge-remove-old"
                                    type="checkbox"
                                    onClick={() => this.update('isRemoval', !(this.state.isRemoval))}
                                    checked={this.state.isRemoval}
                                    style={{ height: '15px', width: '30px' }}
                                />Option for GE to remove old appliance
                            </div>
                            <div style={{ display: (this.state.isRemoval) ? 'block' : 'none' }} >
                                <div><input type="text" placeholder="removal code (e.g. M106)" value={this.state.applianceRemovalCode} onChange={(e) => this.update('applianceRemovalCode', e.target.value)} /></div>
                                <div><input type="number" placeholder="removal value (e.g. 0.00)" value={this.state.applianceRemovalPrice} onChange={(e) => this.update('applianceRemovalPrice', e.target.value)} /></div>
                            </div>
                        </div>
                        <input className="btn submit-btn" type="submit" value={buttonTxt} style={{ width: '89%' }} />
                        { deleteBtn }
                    </form>
                </div>
            </Overlay>
        );
    }
}

const select = (state) => ({
    activeUser          : state.activeUser.get('activeUser'),
    productCategories   : state.products.get('productCategories')
});

const actions = {
    updateProduct, 
    createProduct,
    archiveProduct
};

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(EditProduct)));