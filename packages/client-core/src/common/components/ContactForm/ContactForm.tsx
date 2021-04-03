import React, { Component} from 'react'
import emailjs from 'emailjs-com'
import styles from './ContactForm.module.css';
import { withTranslation } from 'react-i18next';

export class ContactForm extends Component{

    state={
        userName:  "",
        emailAddress:   "",
        companyName:    "",
        message:        ""
    }

    handleSubmit = (e) => {
        e.preventDefault()

        var templateParams = {
            from_name:  this.state.userName,
            to_name:    'Administrator',
            company:    this.state.companyName,
            email:      this.state.emailAddress,
            message:    this.state.message
        };

        console.log(process.env.EMAILJS_SERVICE_ID, 
            process.env.EMAILJS_TEMPLATE_ID, 
            templateParams, 
            process.env.EMAILJS_USER_ID);
        

        emailjs.send(
            process.env.EMAILJS_SERVICE_ID, 
            process.env.EMAILJS_TEMPLATE_ID, 
            templateParams, 
            process.env.EMAILJS_USER_ID
        ).then(
            result => {
                alert(this.props.t('xr3engineContact.lbl-success'), result.text);
            },
            error => {
                alert( this.props.t('xr3engineContact.lbl-failure'), error.text);
            }
        )

        this.setState({
            userName:       "",
            emailAddress:   "",
            companyName:    "",
            message:        ""
        })
    }

    handleChange=(e)=>{
        var name = e.target.name;
        var value = e.target.value;
        this.setState({
            [name]: value
        })
    }
    
    render(){
        const t = this.props.t;
        return (
                    <div className={styles.emailDiv}>
                        <p className={styles.emailTitle}>{t('xr3engineContact.header')}</p>
                        <p className={styles.emailDetail}>
                            {t('xr3engineContact.description')}
                        </p>
                        <div className="row">
                            <input type="text" className={styles.emailInput} value={this.state.userName} name="userName" onChange={this.handleChange} placeholder={t('xr3engineContact.lbl-name')}/>
                        </div>
                        <div className="row mt-4">
                            <input type="text" className={styles.emailInput} value={this.state.emailAddress} name="emailAddress" onChange={this.handleChange} placeholder={t('xr3engineContact.lbl-email')}/>
                        </div>
                        <div className="row mt-4">
                            <input type="text" className={styles.emailInput} value={this.state.companyName} name="companyName" onChange={this.handleChange} placeholder={t('xr3engineContact.lbl-company')}/>
                        </div>
                        <div className="row mt-4">
                            <textarea type="text" className={styles.emailInput} rows="5" placeholder={t('xr3engineContact.lbl-project')} 
                            value={this.state.message} name="message" onChange={this.handleChange}/>
                        </div>
                        <div className="row mt-3">
                            <button className="button email-button" type="button" onClick={this.handleSubmit}>{t('xr3engineContact.lbl-send')}</button>
                        </div>
                    </div>
        )
    }
}

export default withTranslation()(ContactForm);