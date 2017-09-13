import React                    from 'react';
import _                        from 'lodash';
import { PropTypes }            from 'prop-types';
import Select                   from 'react-select';
import assets                   from 'libs/assets';

export default class ApplianceProducts extends React.Component {
    static propTypes = {
        isDisabled                     : PropTypes.bool.isRequired,
        image                          : PropTypes.string.isRequired,
        color                          : PropTypes.string.isRequired,
        applianceManufacturerName      : PropTypes.string.isRequired,
        applianceType                  : PropTypes.string.isRequired,
        applianceSize                  : PropTypes.string.isRequired,
        applianceDescription           : PropTypes.string.isRequired,
        applianceFuelType              : PropTypes.string.isRequired,
        applianceWidth                 : PropTypes.string.isRequired,
        applianceHeight                : PropTypes.string.isRequired,
        applianceDepth                 : PropTypes.string.isRequired,
        applianceInstallDescription    : PropTypes.string.isRequired,
        applianceInstallPrice          : PropTypes.number.isRequired,
        applianceInstallCode           : PropTypes.string.isRequired,
        applianceInstallDescription2   : PropTypes.string,
        applianceInstallPrice2         : PropTypes.number,
        applianceInstallCode2          : PropTypes.string,
        applianceColorsInfo            : PropTypes.array.isRequired,
        applianceSpecSheetUrl          : PropTypes.string.isRequired,
        applianceRemovalDescription    : PropTypes.string.isRequired,
        applianceRemovalCode           : PropTypes.string.isRequired,
        applianceRemovalPrice          : PropTypes.number.isRequired,
        applianceDisconnectDescription : PropTypes.string,
        applianceDisconnectCode        : PropTypes.string,
        applianceDisconnectPrice       : PropTypes.number,
        applianceAssociatedParts       : PropTypes.array.isRequired,
        update                         : PropTypes.func.isRequired,
        updateImage                    : PropTypes.func.isRequired,
        addColorAndImage               : PropTypes.func.isRequired,
        removeColorAndImage            : PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = { isInstallShowing: false, isRemovalShowing: false };

        this.showCheckboxSection = this.showCheckboxSection.bind(this);
    }

    showCheckboxSection({ type }) {
        this.setState((prevState) => {
            const value = (prevState[type]) ? false : true;
            return { [type]: value };
        });
    }

    render() {
        const { isDisabled, image, color, applianceColorsInfo, applianceAssociatedParts, applianceType,
            applianceSize, applianceDescription, applianceFuelType, applianceWidth, applianceHeight, applianceManufacturerName,
            applianceDepth, applianceSpecSheetUrl, applianceInstallCode, applianceInstallPrice, applianceInstallDescription,
            applianceInstallCode2, applianceInstallPrice2, applianceInstallDescription2, applianceRemovalCode, applianceRemovalPrice,
            applianceRemovalDescription, applianceDisconnectCode, applianceDisconnectPrice, applianceDisconnectDescription } = this.props;

        const fuelTypeOptions = [
            { label: 'Select Fuel Type', value: '', disabled: true },
            { label: 'Gas', value: 'Gas' },
            { label: 'Electric', value: 'Electric' }
        ]

        const productPictures = _.map(applianceColorsInfo, (image, index) => {
            return (
                <div key={`colorImages${index}`} className="pictures-section accordion-detail-row" style={{ display: 'inline-flex', width: '100%' }} >
                    <img src={image.imageUrl} alt="picture" width="auto" height="60" />
                    <input type="text" value={image.color} disabled />
                    {(!isDisabled) ? <div className="cancel-btn" onClick={()=> this.props.removeColorAndImage({ color: image.color }) } ><img src={assets('./images/icon-x-big.svg')} /></div> : null}
                </div>
            );
        });

        const addPictureSection = (!isDisabled) ? <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
            <label className="btn blue" >
                { (image !== '') ? <img src={image.imageUrl} alt="uploaded-image" height="60" /> : 'Choose File' }
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={(e) => {e.preventDefault(); this.props.updateImage({ type: 'product', imageFile: e.target.files[0] }); }}
                    style={{ display: 'none' }}
                />
            </label>
            <input type="text" value={color} placeholder="Color name" onChange={(e) => this.props.update({ type: 'color', value: e.target.value })} />
            <div onClick={this.props.addColorAndImage} className="cancel-btn blue">Add</div>
        </div> : null;

        const productParts = _.map(applianceAssociatedParts, (part, index) => {
            return (
                <div key={`parts${index}`} className="parts-section accordion-detail-row" style={{ display: 'inline-flex', width: '100%' }} >
                    <input type="text" value={part.description} disabled />
                    <input type="text" value={part.code} disabled />
                    {(!isDisabled) ? <div className="cancel-btn" onClick={()=> this.props.showAddPart({ part }) } >Edit</div> : null}
                    {(!isDisabled) ? <div className="cancel-btn" onClick={()=> this.props.removePart({ partId: (part.id) ? part.id : index }) } ><img src={assets('./images/icon-x-big.svg')} /></div> : null}
                </div>
            );
        });

        const addPartSection = (!isDisabled) ? <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
            <div onClick={this.props.showAddPart} className="btn blue">Add Part</div>
        </div> : null;

        return (
            <div id="appliance-product" className="container">
                <input name="appliance-manuf-name" type="text" placeholder="Manufacturer Name (e.g. GE)" value={applianceManufacturerName} onChange={(e) => this.props.update({ type: 'applianceManufacturerName', value: e.target.value})} disabled={isDisabled} />
                <input name="appliance-type" type="text" placeholder="Type" value={applianceType} onChange={(e) => this.props.update({ type: 'applianceType', value: e.target.value})} disabled={isDisabled} />
                <input name="appliance-size" type="text" placeholder="Size" value={applianceSize} onChange={(e) => this.props.update({ type: 'applianceSize', value: e.target.value})} disabled={isDisabled} />
                <textarea name="appliance-description" placeholder="Description" value={applianceDescription} onChange={(e) => this.props.update({ type: 'applianceDescription', value: e.target.value})} maxLength="1000" disabled={isDisabled} />
                <Select
                    name="appliance-fuel-type"
                    value={applianceFuelType}
                    options={fuelTypeOptions}
                    onChange={(selected) => (!isDisabled) ? this.props.update({ type: 'applianceFuelType', value: selected.value }) : console.log(`you don't have permission to change!`)}
                    required
                />
                <input name="appliance-width" type="text" placeholder="Width"  value={applianceWidth} onChange={(e) => this.props.update({ type: 'applianceWidth', value: e.target.value})} disabled={isDisabled} />in.
                <input name="appliance-height" type="text" placeholder="Height" value={applianceHeight} onChange={(e) => this.props.update({ type: 'applianceHeight', value: e.target.value})}disabled={isDisabled} />in.
                <input name="appliance-depth" type="text" placeholder="Depth"  value={applianceDepth} onChange={(e) => this.props.update({ type: 'applianceDepth', value: e.target.value})} disabled={isDisabled} />in.
                <input name="appliance-spec-sheet" type="url" placeholder="Spec Sheet URL" value={applianceSpecSheetUrl} onChange={(e) => this.props.update({ type: 'applianceSpecSheetUrl', value: e.target.value})} disabled={isDisabled} />
                <div className="accordion-detail" >
                    { productPictures }
                    { addPictureSection }
                </div>

                <div className="accordion-detail" >
                    { productParts }
                    { addPartSection }
                </div>

                <input
                    id="checkbox-is-ge-install"
                    type="checkbox"
                    onClick={() => this.showCheckboxSection({ type: 'isInstallShowing' })}
                    checked={this.state.isInstallShowing}
                    style={{ height: '15px', width: '30px' }} /> Option for GE to install

                <div style={{ display: (this.state.isInstallShowing) ? 'inline-flex' : 'none' }} >
                    <input name="appliance-install-code" type="text" placeholder="install code (e.g. M106)" value={applianceInstallCode} onChange={(e) => this.props.update({ type: 'applianceInstallCode', value: e.target.value})} disabled={isDisabled} />
                    <input name="appliance-install-value" type="number" placeholder="install value (e.g. 0.00)" value={applianceInstallPrice} onChange={(e) => this.props.update({ type: 'applianceInstallPrice', value: e.target.value})} disabled={isDisabled} />
                    <textarea name="appliance-install-descr" type="text" placeholder="Install Description" value={applianceInstallDescription} onChange={(e) => this.props.update({ type: 'applianceInstallDescription', value: e.target.value})} disabled={isDisabled} />

                    <input name="appliance-install-code" type="text" placeholder="install code (e.g. M106)" value={applianceInstallCode2} onChange={(e) => this.props.update({ type: 'applianceInstallCode2', value: e.target.value})} disabled={isDisabled} />
                    <input name="appliance-install-value" type="number" placeholder="install value (e.g. 0.00)" value={applianceInstallPrice2} onChange={(e) => this.props.update({ type: 'applianceInstallPrice2', value: e.target.value})} disabled={isDisabled} />
                    <textarea name="appliance-install-descr" type="text" placeholder="Install Description" value={applianceInstallDescription2} onChange={(e) => this.props.update({ type: 'applianceInstallDescription2', value: e.target.value})} disabled={isDisabled} />
                </div>

                <input
                    id="checkbox-is-ge-remove"
                    type="checkbox"
                    onClick={() => this.showCheckboxSection({ type: 'isRemovalShowing' })}
                    checked={this.state.isRemovalShowing}
                    style={{ height: '15px', width: '30px' }} />Option for GE to remove old appliance
                <div style={{ display: (this.state.isRemovalShowing) ? 'inline-flex' : 'none' }} >
                    <input name="appliance-removal-code" type="text" placeholder="removal code (e.g. M106)" value={applianceRemovalCode} onChange={(e) => this.props.update({ type: 'applianceRemovalCode', value: e.target.value})} disabled={isDisabled} />
                    <input name="appliance-removal-value" type="number" placeholder="removal value (e.g. 0.00)" value={applianceRemovalPrice} onChange={(e) => this.props.update({ type: 'applianceRemovalPrice', value: e.target.value})}disabled={isDisabled} />
                    <textarea name="appliance-removal-descr" type="text" placeholder="Removal Description" value={applianceRemovalDescription} onChange={(e) => this.props.update({ type: 'applianceRemovalDescription', value: e.target.value})} disabled={isDisabled} />
                </div>

                <input
                    id="checkbox-is-ge-disconnect"
                    type="checkbox"
                    onClick={() => this.showCheckboxSection({ type: 'isDisconnectShowing' })}
                    checked={this.state.isDisconnectShowing}
                    style={{ height: '15px', width: '30px' }} />Option for GE to remove old appliance
                <div style={{ display: (this.state.isDisconnectShowing) ? 'inline-flex' : 'none' }} >
                    <input name="appliance-Disconnect-code" type="text" placeholder="Disconnect code (e.g. M106)" value={applianceDisconnectCode} onChange={(e) => this.props.update({ type: 'applianceDisconnectCode', value: e.target.value})} disabled={isDisabled} />
                    <input name="appliance-Disconnect-value" type="number" placeholder="Disconnect value (e.g. 0.00)" value={applianceDisconnectPrice} onChange={(e) => this.props.update({ type: 'applianceDisconnectPrice', value: e.target.value})} disabled={isDisabled} />
                    <textarea name="appliance-Disconnect-descr" type="text" placeholder="Disconnect Description" value={applianceDisconnectDescription} onChange={(e) => this.props.update({ type: 'applianceDisconnectDescription', value: e.target.value})} disabled={isDisabled} />
                </div>
            </div>
        );
    }
}
