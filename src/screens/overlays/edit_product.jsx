import React                    from 'react';
import _                        from 'lodash';
import assets                   from 'libs/assets';

import Overlay                  from 'components/overlay';

export default class EditProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = { activeSection: '', isInstall: false, isRemoval: false };

        this.update = this.update.bind(this);
        this.changeActiveSection = this.changeActiveSection.bind(this);
    }

    update(type, value) {
        this.setState({ [type]: value });
    }

    changeActiveSection(activeSection) {
        this.setState({ activeSection });
    }

    render() {
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
            checkbox: {
                // width: '60%',
                padding: '30px'
            },
            text: {
                margin: '10px'
            }
        };

        const categories = _.map(this.props.productCategories, (category) => (<option key={category.id} value={category.id}>{ category.name }</option>));
        const deleteBtn = (this.props.id) ? <div className="remove-btn" onClick={() => this.props.deleteProduct(this.props.id)}>Remove Product</div> : null;
        const buttonTxt = (this.props.id) ? 'Update' : 'Add';

        const content = (<form onSubmit={() => this.props.saveProduct(this.props.id)}>
            <div style={styles.content}>
                <div style={{ columnCount: 2, display: 'inline-flex', width: '540px' }}>
                    <div>
                        <select value={this.props.category} onChange={(e) => this.props.update('category', e.target.value)} required >
                            <option disabled selected value="" >Select category</option>
                            { categories }
                        </select>
                    </div>
                    <div><input type="text" placeholder="Product name"   value={this.props.productName}    onChange={(e) => this.props.update('productName', e.target.value)}    required /></div>
                </div>
                <div style={{ columnCount: 2, display: 'inline-flex', width: '540px' }}>
                    <div><input type="text" placeholder="Classification" value={this.props.classification} onChange={(e) => this.props.update('classification', e.target.value)} required /></div>
                    <div><input type="text" placeholder="Size"           value={this.props.size}           onChange={(e) => this.props.update('size', e.target.value)}           required /></div>
                </div>
                <div id="accordion">
                    <div id="accordion-pictures" onClick={() => this.changeActiveSection('pictures')}>
                        <div>{ _.size(this.props.pictures) } Photos</div>
                    </div>
                    <div style={{ display: (this.state.activeSection === 'pictures') ? 'block' : 'none' }} > showing pictures </div>
                    <div id="accordion-parts" onClick={() => this.changeActiveSection('parts')} >
                        <div>{ _.size(this.props.parts) } Parts</div>
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
                    <div><input type="text" placeholder="install code (e.g. M106)" value={this.props.installCode} onChange={(e) => this.props.update('installCode', e.target.value)} /></div>
                    <div><input type="number" placeholder="install value (e.g. 0.00)" value={this.props.installPrice} onChange={(e) => this.props.update('installPrice', e.target.value)} /></div>
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
                    <div><input type="text" placeholder="removal code (e.g. M106)" value={this.props.removalCode} onChange={(e) => this.props.update('removalCode', e.target.value)} /></div>
                    <div><input type="number" placeholder="removal value (e.g. 0.00)" value={this.props.removalPrice} onChange={(e) => this.props.update('removalPrice', e.target.value)} /></div>
                </div>
            </div>
            <input className="submit-btn" type="submit" value={buttonTxt} style={{ width: '89%' }} />
            { deleteBtn }
        </form>);

        return (
            <Overlay>
                <div style={styles.container}>
                    <div style={styles.titleBar} >
                        <div style={styles.title}>{ this.props.title }</div>
                        <div onClick={this.props.close} style={styles.close}>X</div>
                    </div>
                    { content }
                </div>
            </Overlay>
        );
    }
}
