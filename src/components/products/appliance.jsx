import React                   from 'react';
import _                       from 'lodash';
import { PropTypes }           from 'prop-types';
import Select                  from 'react-select';
import assets                  from 'libs/assets';

export default class ApplianceProducts extends React.Component {
    static propTypes = {
        applianceManufacturerName: PropTypes.string.isRequired,
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
        applianceAssociatedParts       : PropTypes.array,
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
        const fuelTypeOptions = [
            { label: 'Select Fuel Type', value: '', disabled: true },
            { label: 'Gas', value: 'Gas' },
            { label: 'Electric', value: 'Electric' }
        ]

        const productPictures = _.map(this.props.applianceColorsInfo, (image, index) => {
            return (
                <div key={`colorImages${index}`} className="pictures-section accordion-detail-row" style={{ display: 'inline-flex', width: '100%' }} >
                    <img src={image.imageUrl} alt="picture" width="auto" height="60" />
                    <input type="text" value={image.color} disabled />
                    <div className="cancel-btn" onClick={()=> this.props.removeColorAndImage({ color: image.color }) } ><img src={assets('./images/icon-x-big.svg')} /></div>
                </div>
            );
        });

        // const productParts = _.map(this.props.applianceAssociatedParts, (part, index) => {
        //     return (
        //         <div key={`parts${index}`} className="parts-section accordion-detail-row" style={{ display: 'inline-flex', width: '100%' }} >
        //             <input type="text" value={part.description} disabled />
        //             <input type="text" value={part.code} disabled />
        //             <div className="cancel-btn" onClick={()=> this.removePart({ partId: (part.id) ? part.id : index }) } ><img src={assets('./images/icon-x-big.svg')} /></div>
        //         </div>
        //     );
        // });

        return (
            <div id="appliance-product" className="container">
                <input name="appliance-manuf-name" type="text" placeholder="Manufacturer Name (e.g. GE)" value={this.props.applianceManufacturerName} onChange={(e) => this.props.update({ type: 'applianceManufacturerName', value: e.target.value})}  />
                <input name="appliance-type" type="text" placeholder="Type" value={this.props.applianceType} onChange={(e) => this.props.update({ type: 'applianceType', value: e.target.value})} />
                <input name="appliance-size" type="text" placeholder="Size" value={this.props.applianceSize} onChange={(e) => this.props.update({ type: 'applianceSize', value: e.target.value})} />
                <textarea name="appliance-description" placeholder="Description" value={this.props.applianceDescription} onChange={(e) => this.props.update({ type: 'applianceDescription', value: e.target.value})} maxLength="1000" />
                <Select
                    name="appliance-fuel-type"
                    value={this.props.applianceFuelType}
                    options={fuelTypeOptions}
                    onChange={(value) => this.props.update({ type: 'applianceFuelType', value })}
                    required
                />
                <input name="appliance-width" type="text" placeholder="Width"  value={this.props.applianceWidth} onChange={(e) => this.props.update({ type: 'applianceWidth', value: e.target.value})}  />in.
                <input name="appliance-height" type="text" placeholder="Height" value={this.props.applianceHeight} onChange={(e) => this.props.update({ type: 'applianceHeight', value: e.target.value})} />in.
                <input name="appliance-depth" type="text" placeholder="Depth"  value={this.props.applianceDepth} onChange={(e) => this.props.update({ type: 'applianceDepth', value: e.target.value})}  />in.
                <input name="appliance-spec-sheet" type="url" placeholder="Spec Sheet URL" value={this.props.applianceSpecSheetUrl} onChange={(e) => this.props.update({ type: 'applianceSpecSheetUrl', value: e.target.value})} />
                <div className="accordion-detail" >
                    { productPictures }
                    <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
                        <label className="btn blue" >
                            { (this.props.image !== '') ? <img src={this.props.image} alt="uploaded-image" height="60" /> : 'Choose File' }
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.svg"
                                onChange={(e) => {e.preventDefault(); this.props.updateImage({ image: e.target.files[0] }); }}
                                style={{ display: 'none' }}
                            />
                        </label>
                        <input type="text" value={this.props.color} placeholder="Color name" onChange={(e) => this.props.update({ type: 'color', value: e.target.value })} />
                        <div onClick={this.props.addColorAndImage} className="cancel-btn blue">Add</div>
                    </div>
                </div>

                {/* <div className="accordion-detail" >
                    { productParts }
                    <div className="accordion-detail-row" style={{ display: 'inline-flex' }} >
                        <input type="text" value={this.props.partDescription} placeholder="Part name" onChange={(e) => this.props.update({ type: 'partDescription', value: e.target.value })} />
                        <input type="text" value={this.props.partCode} placeholder="Part number" onChange={(e) => this.props.update({ type: 'partCode', value: e.target.value })} />
                        <div onClick={this.addPart} className="cancel-btn blue">Add</div>
                    </div>
                </div> */}

                <input
                    id="checkbox-is-ge-install"
                    type="checkbox"
                    onClick={() => this.showCheckboxSection({ type: 'isInstallShowing' })}
                    checked={this.state.isInstallShowing}
                    style={{ height: '15px', width: '30px' }} /> Option for GE to install
                <div style={{ display: (this.state.isInstallShowing) ? 'inline-flex' : 'none' }} >
                    <input name="appliance-install-code" type="text" placeholder="install code (e.g. M106)" value={this.props.applianceInstallCode} onChange={(e) => this.props.update({ type: 'applianceInstallCode', value: e.target.value})} />
                    <input name="appliance-install-value" type="number" placeholder="install value (e.g. 0.00)" value={this.props.applianceInstallPrice} onChange={(e) => this.props.update({ type: 'applianceInstallPrice', value: e.target.value})} />
                    <textarea name="appliance-install-descr" type="text" placeholder="Install Description" value={this.props.applianceInstallDescription} onChange={(e) => this.props.update({ type: 'applianceInstallDescription', value: e.target.value})} />

                    <input name="appliance-install-code" type="text" placeholder="install code (e.g. M106)" value={this.props.applianceInstallCode2} onChange={(e) => this.props.update({ type: 'applianceInstallCode2', value: e.target.value})} />
                    <input name="appliance-install-value" type="number" placeholder="install value (e.g. 0.00)" value={this.props.applianceInstallPrice2} onChange={(e) => this.props.update({ type: 'applianceInstallPrice2', value: e.target.value})} />
                    <textarea name="appliance-install-descr" type="text" placeholder="Install Description" value={this.props.applianceInstallDescription2} onChange={(e) => this.props.update({ type: 'applianceInstallDescription2', value: e.target.value})} />
                </div>

                <input
                    id="checkbox-is-ge-remove-old"
                    type="checkbox"
                    onClick={() => this.showCheckboxSection({ type: 'isRemovalShowing' })}
                    checked={this.state.isRemovalShowing}
                    style={{ height: '15px', width: '30px' }} />Option for GE to remove old appliance
                <div style={{ display: (this.state.isRemovalShowing) ? 'inline-flex' : 'none' }} >
                    <input name="appliance-removal-code" type="text" placeholder="removal code (e.g. M106)" value={this.props.applianceRemovalCode} onChange={(e) => this.props.update({ type: 'applianceRemovalCode', value: e.target.value})} />
                    <input name="appliance-removal-value" type="number" placeholder="removal value (e.g. 0.00)" value={this.props.applianceRemovalPrice} onChange={(e) => this.props.update({ type: 'applianceRemovalPrice', value: e.target.value})}/>
                    <textarea name="appliance-removal-descr" type="text" placeholder="Removal Description" value={this.props.applianceRemovalDescription} onChange={(e) => this.props.update({ type: 'applianceRemovalDescription', value: e.target.value})} />
                </div>

                <input
                    id="checkbox-is-ge-remove-old"
                    type="checkbox"
                    onClick={() => this.showCheckboxSection({ type: 'isDisconnectShowing' })}
                    checked={this.state.isDisconnectShowing}
                    style={{ height: '15px', width: '30px' }} />Option for GE to remove old appliance
                <div style={{ display: (this.state.isDisconnectShowing) ? 'inline-flex' : 'none' }} >
                    <input name="appliance-Disconnect-code" type="text" placeholder="Disconnect code (e.g. M106)" value={this.props.applianceDisconnectCode} onChange={(e) => this.props.update({ type: 'applianceDisconnectCode', value: e.target.value})} />
                    <input name="appliance-Disconnect-value" type="number" placeholder="Disconnect value (e.g. 0.00)" value={this.props.applianceDisconnectPrice} onChange={(e) => this.props.update({ type: 'applianceDisconnectPrice', value: e.target.value})}/>
                    <textarea name="appliance-Disconnect-descr" type="text" placeholder="Disconnect Description" value={this.props.applianceDisconnectDescription} onChange={(e) => this.props.update({ type: 'applianceDisconnectDescription', value: e.target.value})} />
                </div>
            </div>
        );
    }
}
