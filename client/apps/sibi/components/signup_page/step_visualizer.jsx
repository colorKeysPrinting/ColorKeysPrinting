import React                    from 'react';
import _                        from 'lodash';
import assets                   from '../../libs/assets';

export default function SignUpStep2(props) {
    let step1Img, step2Img, step3Img, step4Img;
    const styles = {};

    switch (props.currentStep) {
    case 1:
        step1Img = './images/signup/step1_selected.png';
        step2Img = './images/signup/step2.png';
        step3Img = './images/signup/step3.png';
        step4Img = './images/signup/step4.png';
        break;

    case 2:
        step1Img = './images/signup/completed.png';
        step2Img = './images/signup/step2_selected.png';
        step3Img = './images/signup/step3.png';
        step4Img = './images/signup/step4.png';
        break;

    case 3:
        step1Img = './images/signup/completed.png';
        step2Img = './images/signup/completed.png';
        step3Img = './images/signup/step3_selected.png';
        step4Img = './images/signup/step4.png';
        break;

    case 4:
        step1Img = './images/signup/completed.png';
        step2Img = './images/signup/completed.png';
        step3Img = './images/signup/completed.png';
        step4Img = './images/signup/step4_selected.png';
        break;
    default:
    }

    return (
        <div id="step-visualizer" style={{ display: 'inline-flex' }}>
            <div>
                <img src={assets(step1Img)} alt="email password selected" />
                <div>Email & Password</div>
            </div>
            <div>
                <img src={assets(step2Img)} alt="account details" />
                <div>Account Details</div>
            </div>
            <div>
                <img src={assets(step3Img)} alt="compliance" />
                <div>Compliance</div>
            </div>
            <div>
                <img src={assets(step4Img)} alt="billing info" />
                <div>Billing Info</div>
            </div>
        </div>
    );
}
