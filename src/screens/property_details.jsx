import React                                                from 'react';
import _                                                    from 'lodash';
import { connect }                                          from 'react-redux';
import { withRouter }                                       from 'react-router';
import { withCookies }                                      from 'react-cookie';
import moment                                               from 'moment';
import assets                                               from 'libs/assets';
import Iframe                                               from 'react-iframe';
import Loader                                               from 'react-loader';

import { formatPhoneNumbers }                               from 'libs/reformat';

import { logout }                                           from 'ducks/active_user/actions';
import { triggerSpinner }                                   from 'ducks/ui/actions';
import { setActiveTab }                                     from 'ducks/header/actions';

import MyTable                                              from 'components/my_table';
import ProductTable                                         from 'components/product_table';
import PartTable                                            from 'components/part_table';

class PropertyDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = { editOrder: false, productsAndParts: {} };

        this.editOrder = this.editOrder.bind(this);
        this.handleAction = this.handleAction.bind(this);
    }

    componentWillMount() {
        const { cookies, location } = this.props;
        const jwt = cookies.get('sibi-ge-admin');

        if (jwt) {
            const reOrder = /propertyId=(.*)/;
            const propertyId = reOrder.exec(location.search)[1];

            if (propertyId) {
                this.props.triggerSpinner({ isOn: true });
                this.props.getOrderById({ id: propertyId });

            } else {
                alert('No propertyId provided routing back to propertys');
                this.props.history.push(`/propertys`);
            }
        }

        this.props.setActiveTab('propertys');
    }

    componentWillUnmount() {
        this.props.clearOrder();
    }

    editOrder({ propertyId }) {
        this.setState({ editOrder: propertyId });
    }

    handleAction({ propertyId }) {
        console.log('user action:', propertyId);
        const { cookies } = this.props;
        const jwt = cookies.get('sibi-ge-admin');

        this.props.approveOrder({ id: propertyId });
    }

    render() {
        const { property, spinner, activeUser } = this.props;
        let pageData, tenantInfoTitle, tenantInfoDetails;;

        const productHeaders = {
            productDescription: '',
            address: 'Shipped to',
            qty: 'Qty',
            price: 'Cost'
        };

        const propertyHeaders = {
            propertyStatus: 'Order Status',
            geOrderNumber: 'GE Order #',
            createdBy: 'Ordered By',
            occupied: 'Occupancy',
            lockBoxCode: '',
            installTime: 'Preferred Install Time',
            hotshotDelivery: 'Hot Shot',
            hotshotInstallDate: '',
            hotshotCode: '',
        };

        if (property.size > 0) {
            const myOrder = property.toJS();
            const user = myOrder.createdByUser;
            const permissions = activeUser.get('permissions').toJS();

            propertyHeaders['hotshotInstallDate'] = (myOrder.isApplianceHotShotDelivery) ? 'Hot Shot Install Date' : 'Install Date';
            propertyHeaders['hotshotCode'] = (myOrder.isApplianceHotShotDelivery) ? 'Hot Shot Code' : '';

            if (!this.state.editOrder) {
                const propertyStatus = myOrder.propertyStatus;

                const propertyPageHeading = {
                    address: `${myOrder.pmOffice.addressLineOne} ${myOrder.pmOffice.addressLineTwo} ${myOrder.pmOffice.addressLineThree}, ${myOrder.pmOffice.city}, ${myOrder.pmOffice.state}, ${myOrder.pmOffice.zipcode}`,
                    PM: myOrder.pmOffice.name
                };

                const productsAndDestinations = [];
                _.each(myOrder.productsAndDestinations, (product) => {
                    productsAndDestinations.push(product);

                    _.each(product.includedParts, (part) => {
                        productsAndDestinations.push({...part, productOrderId: product.productOrderId});
                    });
                });

                const productsAndParts = productsAndDestinations.concat(myOrder.partsAndDestinations);

                if (myOrder.occupied) {
                    const formatTenantPhone = formatPhoneNumbers(myOrder.tenantPhone);
                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Tenant Info: </div></td>
                    </tr>;

                    tenantInfoDetails = <tr>
                        <td><div>{`${myOrder.tenantFirstName} ${myOrder.tenantLastName}`} ∙ {formatTenantPhone} ∙ {myOrder.tenantEmail}</div></td>
                    </tr>;

                } else {
                    const formatUserPhone = (user.phoneNumber) ? formatPhoneNumbers(user.phoneNumber) : '';
                    const formatOfficePhone = (myOrder.pmOffice) ? formatPhoneNumbers(myOrder.pmOffice.phoneNumber) : '';
                    const pmOfficeName = (myOrder.pmOffice) ? myOrder.pmOffice.name : propertyPageHeading.PM;

                    tenantInfoTitle = <tr>
                        <td><div className="table-header">Delivery Contact: </div></td>
                        <td><div className="table-header">Phone Number: </div></td>
                    </tr>;

                    tenantInfoDetails = [
                        <tr key='tenantInfoDetails1'>
                            <td><div>{user.firstName} {user.lastName}</div></td>
                            <td><div>{formatUserPhone}</div></td>
                        </tr>,
                        <tr key='tenantInfoDetails2'>
                            <td><div>{pmOfficeName}</div></td>
                            <td><div>{formatOfficePhone}</div></td>
                        </tr>
                    ];
                }

                const propertyDetailsCols = {};
                propertyHeaders.lockBoxCode = (myOrder.lockBoxCode) ? 'Lockbox Code' : 'Tenant';
                _.each(propertyHeaders, (value, key) => {
                    value = property[key]
                    if (key === 'propertyStatus') {
                        value = myOrder.propertyStatus;

                    } else if (key === 'geOrderNumber'){
                        value = myOrder.geOrderNumber;

                    } else if (key === 'installTime') {
                        value = (myOrder.applianceDeliveryTime) ? myOrder.applianceDeliveryTime : 'Not Specified';

                    } else if (key === 'occupied') {
                        value = (myOrder.occupied === false) ? 'Unoccupied' : 'Occupied';

                    } else if (key === 'lockBoxCode') {
                        value = (myOrder.lockBoxCode) ? myOrder.lockBoxCode : `${myOrder.tenantFirstName} ${myOrder.tenantLastName}`;

                    } else if (key === 'createdBy') {
                        value = `${myOrder.propertyUser.firstName} ${myOrder.propertyUser.lastName}`;

                    } else if (key === 'hotshotDelivery') {
                        value = (myOrder.isApplianceHotShotDelivery) ? 'Yes' : 'No';

                    } else if (key === 'hotshotInstallDate') {
                        value = moment(myOrder.installDate).format('MM/DD/YYYY');

                    } else if (key === 'hotshotCode') {
                        value = (myOrder.isApplianceHotShotDelivery) ? myOrder.applianceHotShotCode : null;
                    }

                    propertyDetailsCols[key] = value;
                });

                pageData = <div className="container">
                    <div className="details-header">
                        <div className="header-property pure-u-2-3">
                            <h2 className="property-number">Order: { myOrder.propertyNumber }</h2>
                            <div className="property-manager">{ propertyPageHeading.address } ● PM Office: { propertyPageHeading.PM }</div>
                        </div>
                        { (propertyStatus == 'Pending') ? <div className="button-container pure-u-1-3">
                            { (permissions.updateAllOrders || permissions.updateFundOrders || permissions.updateFundOrdersPriorToApproval)
                                ? <div className="btn blue" onClick={() => this.editOrder({ propertyId: myOrder.id })}>Edit</div>
                                : null }
                            { (permissions.viewAllApprovedAndProcessedOrders || permissions.approveAllOrders || permissions.approveFundOrders)
                                ? <div className="btn blue" onClick={() => this.handleAction({ propertyId: myOrder.id })}>Approve</div>
                                : null }
                        </div> : null }
                    </div>
                    <MyTable
                        className="property-details-table"
                        type="propertyDetails"
                        headers={propertyHeaders}
                        data={{propertyDetailsCols}}
                    />
                    <div className="tenant-info-table">
                        <table className="table">
                            <thead className="head">
                                { tenantInfoTitle }
                            </thead>
                            <tbody>
                                { tenantInfoDetails }
                            </tbody>
                        </table>
                    </div>
                    <div className="product-table-wrapper">
                        { _.map(productsAndParts, (propertyDetail, productIndex) => {
                            if (propertyDetail.product) {
                                const replacement = (propertyDetail.selectedColorInfo.replacementManufacturerModelNumber) ? propertyDetail.selectedColorInfo.replacementManufacturerModelNumber : false;
                                const address = <div className="no-limit">
                                    <div>{`${myOrder.fundProperty.addressLineOne} ${myOrder.fundProperty.addressLineTwo} ${myOrder.fundProperty.addressLineThree},`}</div>
                                    <div>{`${myOrder.fundProperty.city}, ${myOrder.fundProperty.state}, ${myOrder.fundProperty.zipcode}`}</div>
                                </div>;

                                return <ProductTable
                                    key={`product${productIndex}`}
                                    type="propertyDetails"
                                    productIndex={productIndex}
                                    productHeaders={productHeaders}
                                    product={propertyDetail.product}
                                    replacement={replacement}
                                    image={propertyDetail.selectedColorInfo.imageUrl}
                                    manufacturerModelNumber={propertyDetail.selectedColorInfo.manufacturerModelNumber}
                                    color={propertyDetail.selectedColorInfo.color}
                                    qty={(propertyDetail.qty) ? propertyDetail.qty : 1}
                                    installAppliance={propertyDetail.installAppliance}
                                    removeOldAppliance={propertyDetail.removeOldAppliance}
                                    address={address}
                                    price={propertyDetail.ProductPrice.price}
                                />;
                            } else if (propertyDetail.part) {
                                const replacement = (propertyDetail.replacementModelNumber) ? propertyDetail.replacementModelNumber : false;
                                return <PartTable
                                    key={`part${productIndex}`}
                                    type="propertyDetails"
                                    productIndex={productIndex}
                                    part={propertyDetail.part}
                                    replacement={replacement}
                                    qty={(propertyDetail.qty) ? propertyDetail.qty : 1}
                                    price={propertyDetail.PartPrice.price}
                                />;
                            }
                        }) }
                    </div>
                    <div>
                        {(myOrder.isApplianceHotShotDelivery) ? <div className="cost-section" >
                            <h5 style={{right: '8%', position: 'absolute', margin: '-6px' }}>Hot Shot Delivery: <span>${ myOrder.applianceHotShotPrice }</span></h5>
                        </div> : null}
                        <div className="cost-section">
                            <h5 className="cost-header">Order Summary </h5>
                            <div className="cost-row">
                                <h5>Subtotal: <span>${ myOrder.subTotalCost }</span></h5>
                                <h5>Sales Tax: <span>${ myOrder.salesTax }</span></h5>
                                <h5>Total: <span>${ myOrder.totalCost }</span></h5>
                            </div>
                        </div>
                    </div>
                </div>;
            }

            this.props.triggerSpinner({ isOn: false });
        }

        return (
            <Loader loaded={spinner} >
                <div id="property-details-page">
                    { pageData }
                </div>
            </Loader>
        );
    }
}

const select = (state) => ({
    spinner    : state.ui.get('spinner'),
    property   : state.properties.get('property'),
    activeUser : state.activeUser.get('activeUser'),
});

const actions = {
    logout,
    triggerSpinner,
    setActiveTab
}

export default connect(select, actions, null, { withRef: true })(withRouter(withCookies(PropertyDetails)));
