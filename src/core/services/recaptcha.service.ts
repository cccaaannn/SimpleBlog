import axios from 'axios';

import { ErrorResult, IResult, SuccessResult } from '../results/Result';
import { RecaptchaConfig } from '../configs/recaptcha.config'


async function verify(recaptchaToken: string): Promise<IResult> {
    try {

        const response: any = await axios.post(RecaptchaConfig.RECAPTCHA_BASE_URL, undefined, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptchaToken
            }
        });
        console.info(response.data);

        if (!response.data.success) {
            return new ErrorResult("Captcha verification failed.");
        }
        
        if (response.data.score < 0.5) {
            return new ErrorResult("You don't look like human.");
        }

        return new SuccessResult("Captcha verification passed.");

    } 
    catch (err) {
        return new ErrorResult("Captcha verification failed.");
    }
};


const RecaptchaService = { verify }
export default RecaptchaService;
