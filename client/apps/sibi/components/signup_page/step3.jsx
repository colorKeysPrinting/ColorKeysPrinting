import React                    from 'react';
import { connect }              from 'react-redux';
import assets                   from '../../libs/assets';


export default function SignUpStep3(props) {

    let styles = {
        container: {
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            minHight: '400px',
            width: '490px',
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
            width: '100%'
        },
        title: {
            textAlign: 'left',
            padding: '30px',
            width: '90%'
        },
        steps: {
            color: 'green',
            cursor: 'pointer',
            textAlign: 'right',
            padding: '30px',
            width: '30%'
        },
        contentUpload: {
            width: '89%',
            margin: '0px auto',
            marginTop: '40px',
            textAlign: 'left',
            display: 'grid'
        },
        submitBtn: {
            backgroundColor: 'rgb(47, 205, 237)',
            borderRadius: '5px',
            color: '#FFF',
            cursor: 'pointer',
            height: '65px',
            width: '70%',
            margin: '20px auto',
            paddingTop: '10px',
            fontSize: '20px'
        },
        width100: {
            width: '98%'
        },
        element: {
            display: 'inline-flex',
            height: '70px',
            margin: '5px 0'
        },
        image: {
            height: '60px',
            width: '60px',
            border: '1px dashed rgba(50, 50, 50, 0.4)',
            backgroundColor: '#FFF'
        },
        textSection: {
            margin: '20px'
        },
        notAdded: {
            color: 'rgb(47, 205, 237)',
            cursor: 'pointer',
            fontSize: '20px',
            margin: '20px'
        },
        added: {
            display: 'inline-flex',
            margin: '5px 20px'
        },
        checkmark: {
            height: '30px',
            margin: '5px',
            marginTop: '-6px'
        },
        remove: {
            color: 'rgba(50, 50, 50, 0.4)',
            fontSize: '16px',
            margin: '6px'
        }
    };

    // #22D8AF - green

    let workerCompText = (props.docWorkerComp) ? <div style={styles.added}>
                                                     <div>
                                                        <h2>Worker's comp</h2>
                                                        <div onClick={()=>props.update('docWorkerComp', '')} style={styles.remove}>Remove</div>
                                                     </div>
                                                     <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                                 </div>
                                               : <div style={styles.notAdded}>Add Worker's Comp</div>;
    let w9Text = (props.docW9) ? <div style={styles.added}>
                                     <div>
                                        <h2>w9</h2>
                                        <div onClick={()=>props.update('docW9', '')} style={styles.remove}>Remove</div>
                                     </div>
                                     <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                 </div>
                               : <div style={styles.notAdded}>Add w9</div>;

    let insuranceText = (props.docInsurance) ? <div style={styles.added}>
                                                   <div>
                                                        <h2>proof of insurance</h2>
                                                        <div onClick={()=>props.update('docInsurance', '')} style={styles.remove}>Remove</div>
                                                   </div>
                                                   <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                               </div>
                                             : <div style={styles.notAdded}>Add proof of insurance</div>;

    let goodmanText = (props.contractGoodman) ? <div style={styles.added}>
                                                    <div>
                                                        <h2>Accepted Goodman contract</h2>
                                                        <div onClick={()=>props.update('contractGoodman', '')} style={styles.remove}>Remove</div>
                                                    </div>
                                                    <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                                </div>
                                              : <div style={styles.notAdded}>Agree to Goodman contract</div>;

    let asureText = (props.contractAsure) ? <div style={styles.added}>
                                                <div>
                                                    <h2>Accepted Asure contact</h2>
                                                    <div onClick={()=>props.update('contractAsure', '')} style={styles.remove}>Remove</div>
                                                </div>
                                                <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                            </div>
                                          : <div style={styles.notAdded}>Agree to Asure contact</div>;

    let title = <div id="sign-up-title" style={ styles.titleBar}><div style={ styles.title }>Compliance</div><div style={styles.steps}>step 3 of 4</div></div>;
    let content =   <form onSubmit={props.nextAction}>
                        <div style={styles.contentUpload}>
                            <div onClick={()=>{props.showOverlay('docWorkerComp')}} style={styles.element}>
                                <img src={''} alt="workersCompImg" style={styles.image}/>
                                {workerCompText}
                            </div>
                            <div onClick={()=>{props.showOverlay('docW9')}} style={styles.element}>
                                <img src={''} alt="w9Img" style={styles.image}/>
                                {w9Text}
                            </div>
                            <div onClick={()=>{props.showOverlay('docInsurance')}} style={styles.element}>
                                <img src={''} alt="insuranceImg" style={styles.image}/>
                                {insuranceText}
                            </div>
                            <div onClick={()=>{props.showOverlay('contractGoodman')}} style={styles.element}>
                                <img src={''} alt="insuranceImg" style={styles.image}/>
                                {goodmanText}
                            </div>
                            <div onClick={()=>{props.showOverlay('contractAsure')}} style={styles.element}>
                                <img src={''} alt="insuranceImg" style={styles.image}/>
                                {asureText}
                            </div>
                        </div>

                        <input type="submit" value="Finish" style={ styles.submitBtn } required/>
                    </form>;

    return (
        <div style={styles.container}>
            {title}
            {content}
        </div>
    );
}
