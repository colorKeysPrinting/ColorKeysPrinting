import React                    from 'react';
import assets                   from '../../libs/assets';

export default function SignUpStep3(props) {

    let styles = {
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
            width: '69%',
            margin: '40px auto 0px',
            textAlign: 'left',
            display: 'grid'
        },
        submitBtn: {
            borderRadius: '5px',
            cursor: 'pointer',
            height: '65px',
            width: '70%',
            margin: '20px auto',
            paddingTop: '10px',
            fontSize: '20px'
        },
        element: {
            display: 'inline-flex',
            height: '70px',
            margin: '5px 0'
        },
        image: {
            backgroundColor: '#FFF',
            border: '2px dashed rgba(50, 50, 50, 0.4)',
            borderRadius: '5px',
            height: '70px',
            width: '70px',
        },
        imageAdded: {
            backgroundColor: '#FFF',
            border: '2px solid #22D8AF',
            borderRadius: '5px',
            height: '70px',
            width: '70px'
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
            cursor: 'pointer',
            fontSize: '16px',
            margin: '6px'
        },
        errorMsg: {
            color: '#F00',
            fontSize: '24px',
            margin: '30px auto -28px'
        }
    };

    let errorMsg = (props.errorMsg) ? <div style={styles.errorMsg}>{props.errorMsg}</div> : '';

    let workerCompText = (props.docWorkerComp) ? <div style={styles.added}>
                                                     <div>
                                                        <h2>Worker's comp</h2>
                                                        <div onClick={()=>props.update('docWorkerComp', '')} style={styles.remove}>Remove</div>
                                                     </div>
                                                     <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                                 </div>
                                               : <div onClick={()=>{props.showOverlay('docWorkerComp')}} style={styles.notAdded}>Add Worker's Comp</div>;
    let w9Text = (props.docW9) ? <div style={styles.added}>
                                     <div>
                                        <h2>w9</h2>
                                        <div onClick={()=>props.update('docW9', '')} style={styles.remove}>Remove</div>
                                     </div>
                                     <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                 </div>
                               : <div onClick={()=>{props.showOverlay('docW9')}} style={styles.notAdded}>Add w9</div>;

    let insuranceText = (props.docInsurance) ? <div style={styles.added}>
                                                   <div>
                                                        <h2>proof of insurance</h2>
                                                        <div onClick={()=>props.update('docInsurance', '')} style={styles.remove}>Remove</div>
                                                   </div>
                                                   <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                               </div>
                                             : <div onClick={()=>{props.showOverlay('docInsurance')}} style={styles.notAdded}>Add proof of insurance</div>;

    let goodmanText = (props.contractGoodman) ? <div style={styles.added}>
                                                    <div>
                                                        <h2>Accepted Goodman contract</h2>
                                                        <div onClick={()=>props.update('contractGoodman', false)} style={styles.remove}>Remove</div>
                                                    </div>
                                                    <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                                </div>
                                              : <div onClick={()=>{props.showOverlay('contractGoodman')}} style={styles.notAdded}>Agree to Goodman contract</div>;

    let asureText = (props.contractAsure) ? <div style={styles.added}>
                                                <div>
                                                    <h2>Accepted Asure contact</h2>
                                                    <div onClick={()=>props.update('contractAsure', false)} style={styles.remove}>Remove</div>
                                                </div>
                                                <img src={assets('./images/green_checkmark.png')} alt="checkmark" style={styles.checkmark} />
                                            </div>
                                          : <div onClick={()=>{props.showOverlay('contractAsure')}} style={styles.notAdded}>Agree to Asure contact</div>;

    let title = <div style={ styles.titleBar}><div style={styles.title }>Compliance</div><div style={styles.steps}>step 3 of 4</div></div>;
    let content =   <form onSubmit={()=>props.nextAction('step3')}>
                        <div style={styles.contentUpload}>
                            <div style={styles.element}>
                                <img src={''} alt="workersCompImg" style={(props.docWorkerComp) ? styles.imageAdded : styles.image}/>
                                {workerCompText}
                            </div>
                            <div style={styles.element}>
                                <img src={''} alt="w9Img" style={(props.docW9) ? styles.imageAdded : styles.image}/>
                                {w9Text}
                            </div>
                            <div style={styles.element}>
                                <img src={''} alt="insuranceImg" style={(props.docInsurance) ? styles.imageAdded : styles.image}/>
                                {insuranceText}
                            </div>
                            <div style={styles.element}>
                                <img src={''} alt="insuranceImg" style={(props.contractGoodman) ? styles.imageAdded : styles.image}/>
                                {goodmanText}
                            </div>
                            <div style={styles.element}>
                                <img src={''} alt="insuranceImg" style={(props.contractAsure) ? styles.imageAdded : styles.image}/>
                                {asureText}
                            </div>
                        </div>

                        <input className="button" type="submit" value="Finish" style={ styles.submitBtn }/>
                    </form>;

    return (
        <div>
            {title}
            {errorMsg}
            {content}
        </div>
    );
}
