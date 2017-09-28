import React                    from 'react';
import _                        from 'lodash';
import { PropTypes }            from 'prop-types';
import assets                   from 'libs/assets';
import Select                   from 'react-select';

import Overlay                  from 'components/overlay';

export default class EditPartOverlay extends React.Component {
    static propTypes = {
        token               : PropTypes.string.isRequired,
        isDisabled          : PropTypes.bool.isRequired,
        productId           : PropTypes.string.isRequired,
        productCategoryId   : PropTypes.string.isRequired,
        id                  : PropTypes.string.isRequired,
        description         : PropTypes.string.isRequired,
        code                : PropTypes.string.isRequired,
        imageUrl            : PropTypes.string.isRequired,
        modelNumber         : PropTypes.string.isRequired,
        gePrice             : PropTypes.number,
        sibiPrice           : PropTypes.number,
        includedInManufacturerInstall : PropTypes.bool.isRequired,
        isPartVerified      : PropTypes.bool.isRequired,
        isPartFound         : PropTypes.bool.isRequired,
        parts               : PropTypes.object.isRequired,
        update              : PropTypes.func.isRequired,
        uploadImage         : PropTypes.func.isRequired,
        checkModelNum       : PropTypes.func.isRequired,
        clearPart           : PropTypes.func.isRequired,
        getPartById         : PropTypes.func.isRequired,
        verifyPart          : PropTypes.func.isRequired,
        resetFound          : PropTypes.func.isRequired,
        close               : PropTypes.func.isRequired,
        newPart             : PropTypes.func.isRequired,
        createPart          : PropTypes.func.isRequired,
        updatePart          : PropTypes.func.isRequired,
        addPart             : PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.modifyExistingPart = this.modifyExistingPart.bind(this);
        this.savePart = this.savePart.bind(this);
    }

    componentWillUnmount() {
        this.props.clearPart();
        this.props.verifyPart({ verified: false });
        this.props.resetFound();
    }

    modifyExistingPart({ token }) {
        let { modelNumber, parts } = this.props;

        const part = _.find(parts.toJS(), ['modelNumber', modelNumber]);
        this.props.getPartById({ token, id: part.id });
        this.props.verifyPart({ verified: true });
        this.props.resetFound();
    }

    savePart({ token }) {
        const { productId, productCategoryId, id, description, code, imageUrl, modelNumber, gePrice, sibiPrice, includedInManufacturerInstall } = this.props;
        const part = {
            productCategoryId,
            id,
            description,
            code,
            imageUrl,
            modelNumber,
            // gePrice,
            // sibiPrice,
            includedInManufacturerInstall
        };

        _.each(part, (value, key) => {
            if(value === '' || typeof value === 'object' && _.size(value) === 0) {
                delete part[key];
            }
        });

        // TODO: may need to have a check here to check to see if the part is already added to the product. If so, need to increment the quantity
        (id) ? this.props.updatePart({ token, part, productId }) : this.props.createPart({ token, part, productId });
        this.props.close();
    }

    render() {
        const { token, isDisabled, productCategoryId, id, description, code, imageUrl, modelNumber, gePrice, sibiPrice, includedInManufacturerInstall, isPartVerified, isPartFound } = this.props;
        let pageContent;

        if (!isPartFound) {
            if (isPartVerified) {
                pageContent = <div className="part-details">
                    <label className="btn blue left-col" >
                        { (imageUrl !== '') ? <img src={imageUrl} alt="uploaded-image" height="60" /> : 'Choose Part Image' }
                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.svg"
                            onChange={(e) => {e.preventDefault(); this.props.uploadImage({ key: 'part', imageFile: e.target.files[0] }); }}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <input name="part-description" className="right-col" type="text"   placeholder="Name"       value={description} onChange={(e) => this.props.update({ isPart: true, key: 'description', value: e.target.value})} required />
                    <input name="part-Code"        className="left-col"  type="text"   placeholder="Code"       value={code}        onChange={(e) => this.props.update({ isPart: true, key: 'code', value: e.target.value})} required />
                    <input name="part-gePrice"     className="right-col" type="number" placeholder="GE Price"   value={gePrice}     onChange={(e) => this.props.update({ isPart: true, key: 'gePrice', value: e.target.value})} required />
                    <input name="part-sibiPrice"   className="left-col"  type="number" placeholder="SIBI Price" value={sibiPrice}   onChange={(e) => this.props.update({ isPart: true, key: 'sibiPrice', value: e.target.value})} required />
                    <br/>
                    <label className="right-col">
                        <input
                            name="part-includedIn"
                            type="checkbox"
                            checked={includedInManufacturerInstall}
                            onChange={(e, value) => this.props.update({ isPart: true, key: 'includedInManufacturerInstall', value: e.target.checked})}
                            style={{ height: '15px', width: '30px' }}/>
                        Included in Manufacturer install
                    </label>

                    <input className="btn blue fill" type="submit" value={(id) ? 'Update' : 'Add'} />
                </div>
            }

        } else {
            pageContent = <dialog open>
                <form method="dialog">
                    Alert:
                    <p>A part with this Sibi Model Number already exists!</p>
                    Do you wish to:
                    <p> - Use the existing part</p>
                    <p> - continue creating a new part (this will completely replace the existing part)</p>
                    <p> - modify the existing part?</p>
                    <input className="btn blue" type="submit" value="Add" onClick={() => this.props.addPart({ token, modelNumber })} />
                    <input className="btn borderless red fill" type="submit" value="Create New" onClick={() => {
                        this.props.verifyPart({ verified: true });
                        this.props.resetFound();
                        this.props.newPart({ productCategoryId });
                    }} />
                    <input className="add-btn blue" type="submit" value="Modify Existing" onClick={() => this.modifyExistingPart({ token })} />
                </form>
            </dialog>
        }

        return (
            <Overlay type="edit-part">
                <div id="edit-part-modal" className="modal">
                    <div className="titleBar">
                        <div className="title">{(id) ? 'Edit': 'Add'} Part</div>
                        <div onClick={this.props.close} className="icon-close"><img src={assets('./images/icon-x-big.svg')} /></div>
                    </div>
                    <form onSubmit={(e) => {e.preventDefault(); this.props.checkModelNum({ key: 'part', modelNumber });}} >
                        <div className="model-number-section">
                            <input
                                name="part-ModelNumber"
                                className="search-input"
                                type="text"
                                placeholder="Model #"
                                value={modelNumber}
                                onChange={(e) => {
                                    this.props.verifyPart({ verified: false });
                                    this.props.update({ isPart: true, key: 'modelNumber', value: e.target.value })
                                }}
                                required
                            />
                            { (!isPartVerified && !isDisabled) ? <input className="btn blue" type="submit" value="Add"/> : null }
                        </div>
                    </form>
                    <form onSubmit={(e) =>{e.preventDefault(); this.savePart({ token });}} >
                        { pageContent }
                    </form>
                </div>
            </Overlay>
        );
    }
}