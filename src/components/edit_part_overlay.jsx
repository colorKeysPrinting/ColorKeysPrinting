import React                    from 'react';
import _                        from 'lodash';
import { PropTypes }            from 'prop-types';
import assets                   from 'libs/assets';
import Select                   from 'react-select';

import Overlay                  from 'components/overlay';

export default class EditPartOverlay extends React.Component {
    static propTypes = {
        id                  : PropTypes.string.isRequired,
        imageUrl            : PropTypes.string.isRequired,
        description         : PropTypes.string.isRequired,
        code                : PropTypes.string.isRequired,
        modelNumber         : PropTypes.string.isRequired,
        gePrice             : PropTypes.number.isRequired,
        sibiPrice           : PropTypes.number.isRequired,
        isPartModelNumFound : PropTypes.bool.isRequired,
        showPartsDialog     : PropTypes.bool.isRequired,
        update              : PropTypes.func.isRequired,
        updateImage         : PropTypes.func.isRequired,
        savePart            : PropTypes.func.isRequired,
        showAddPart         : PropTypes.func.isRequired,
        checkModelNum       : PropTypes.func.isRequired
    };

    render() {
        const { id, imageUrl, description, code, modelNumber, gePrice, sibiPrice, isPartModelNumFound, showPartsDialog } = this.props;

        const buttonText = (id) ? 'Update' : 'Add';
        const modelNumAdd = (isPartModelNumFound) ? <input className="btn blue" type="submit" value="Add"/> : null;
        const dialogBox = (showPartsDialog) ? <dialog open>
            <form method="dialog">
                Alert:
                <p>A part with this Sibi Model Number already exists!</p>
                Do you wish to:
                <p> - continue creating a new part (this will completely replace the existing part)</p>
                <p> - modify the existing part?</p>
                <input className="btn red" type="submit" value="Create New" onClick={this.createNew} />
                <input className="btn blue" type="submit" value="Modify Existing" onClick={this.modifyExisting} />
            </form>
        </dialog> : null;

        const partDetails = (!isPartModelNumFound) ? <div className="content">
            <label className="btn blue" >
                { (imageUrl !== '') ? <img src={imageUrl} alt="uploaded-image" height="60" /> : 'Choose Product Image' }
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={(e) => {e.preventDefault(); this.props.updateImage({ type: 'part', imageFile: e.target.files[0] }); }}
                    style={{ display: 'none' }}
                />
            </label>
            <input name="part-description"  type="text"     placeholder="Name"          value={description} onChange={(e) => this.props.update({ type: 'partdescription', value: e.target.value})} required />
            <input name="part-Code"         type="text"     placeholder="Code"          value={code}        onChange={(e) => this.props.update({ type: 'partcode', value: e.target.value})} required />
            <input name="part-gePrice"      type="number"   placeholder="GE Price"      value={gePrice}     onChange={(e) => this.props.update({ type: 'partgePrice', value: e.target.value})} required />
            <input name="part-sibiPrice"    type="number"   placeholder="SIBI Price"    value={sibiPrice}   onChange={(e) => this.props.update({ type: 'partsibiPrice', value: e.target.value})} required />

            <input className="btn blue fill" type="submit" value={buttonText} />
        </div> : null;

        return (
            <Overlay type="edit-part">
                <div id="edit-part-modal" className="modal">
                    <div className="titleBar">
                        <div className="title">{(id) ? 'Edit': 'Add'} Part</div>
                        <div onClick={this.props.showAddPart} className="icon-close"><img src={assets('./images/icon-x-big.svg')} /></div>
                    </div>
                    <form onSubmit={(e) => {e.preventDefault(); this.props.checkModelNum({ type: 'part' });}} >
                        <div className="content">
                            <input
                                name="part-ModelNumber"
                                className="search-input"
                                type="text"
                                placeholder="Model #"
                                value={modelNumber}
                                onChange={(e) => this.props.update({ type: 'partmodelNumber', value: e.target.value })}
                                required
                            />
                            { modelNumAdd }
                        </div>
                    </form>
                    <form onSubmit={(e) =>{e.preventDefault(); this.props.savePart();}} >
                        { partDetails }
                    </form>
                    { dialogBox }
                </div>
            </Overlay>
        );
    }
}