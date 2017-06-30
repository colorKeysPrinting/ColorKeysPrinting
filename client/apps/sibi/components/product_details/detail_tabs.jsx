import React                                from 'react';
import { Tab, Tabs, TabList, TabPanel }     from 'react-tabs';
import _                                    from 'lodash';
import assets                               from '../../libs/assets';

import Product                              from './product';

export default function DetailTabs(props) {

    let tabs = _.map(props.tabs, (content, tab)=>{
        return <Tab key={tab}>{ (tab).toUpperCase() }</Tab>
    });

    let tabContent = _.map(props.tabs, (content, tab)=>{

        switch(tab) {
            case 'complete the system':
            case 'recommended parts':
                let products = _.map(content, (productID)=>{
                    return (
                        <Product
                            key={productID}
                            product={_.find(props.products, ['id', parseInt(productID)])}
                            addToTruck={props.addToTruck} />
                    );
                });

                content = <div key={tab} className="pure-g" >
                              { products }
                          </div>;
                break;

            case 'code compliance':
                content = <div dangerouslySetInnerHTML={{__html: content}}></div>
                break;

            case 'overview':
                let features = _.map(content, (item, key)=>{
                    if(key === 'downloadLink') {
                        return <div key={key}><a href={item}>Download Customer Brochure</a></div>

                    } else if(key === 'Standard Features' || key === 'Cabinet Features') {
                        let list = _.map(item, (listItem, key)=>{
                            return <li key={key+tab}>{ listItem }</li>
                        });

                        return (
                            <div key={key}>
                                <h3>{ key }</h3>
                                <ul>{ list }</ul>
                            </div>
                        );
                    } else {
                        return (
                            <div key={key}>
                                <div>{ key }</div>
                                <div>{ item }</div>
                            </div>
                        );
                    }
                });

                content = <div key={tab}>{ features }</div>;
                break;

            case 'specifications':
                content = <object data={assets(content)}
                                  type="application/pdf"
                                  width="100%"
                                  height="1000px">
                          </object>
                break;

            case 'FAQ':
                content = _.map(content, (questionAnswer, key)=>{
                    return (
                        <div key={'faq' + key}>
                            <div>{ questionAnswer.question }</div>
                            <div>{ questionAnswer.answer }</div>
                            <hr/>
                        </div>
                    );
                });
                break;

            default:
        }

        return (
            <TabPanel key={'tabPanel' + tab}>
                { content }
            </TabPanel>
        );
    });

    return (
        <div id="product-detail-tabs" >
            <Tabs defaultIndex={0} >
                <TabList>
                    {tabs}
                </TabList>
                {tabContent}
            </Tabs>
        </div>
    );
}