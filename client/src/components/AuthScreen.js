import React, {Component} from "react";
import {
    Form, Icon, Input, Button, Card,
  } from 'antd';
import { Link } from "react-router-dom";
  
  const FormItem = Form.Item;
  
  class LoginForm extends Component {

    constructor(props) {
        super(props)
        console.log(props)
    }

    handleLogin(e) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.form.submit()
        }
        e.preventDefault();
      });
    }

    handleRegister(e) {
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.form.submit()
          }
          e.preventDefault();
        });
    }

    validatePasswordConfirmation(field, val, cb) {
        var password = this.props.form.getFieldValue('passwordRegister');
        if (val === password) {
            cb();
        } else {
            cb(new Error("passwords doesn't match"));
        }
    }
  
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
            <Card className="width-60" style={{minHeight: '100vh', border: '0', margin: 'auto'}}>
                {this.props.match.params.page === 'register' && (<Form action="/register/" method="post" onSubmit={this.handleRegister.bind(this)} className="login-form" style={{width: '300px', margin: 'auto'}}>
                <FormItem>
                    {getFieldDecorator('emailRegister', {
                    rules: [{ required: true, message: 'Please enter your email' }],
                    })(
                    <Input name="email" style={{height: '32px'}} prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('passwordRegister', {
                    rules: [{ required: true, message: 'Please enter your Password' }],
                    })(
                    <Input name="password" style={{height: '32px'}} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('confirmPassword', {
                    rules: [{ required: true, message: "Sorry, the passwords doesn't match", validator: this.validatePasswordConfirmation.bind(this) }],
                    })(
                    <Input name="confirmPassword" style={{height: '32px'}} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirm Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="width-100 login-form-button">
                    Register
                    </Button>
                    Or <Link to="/writes/auth/login">Login</Link>
                </FormItem>
                </Form>)}
                
                {this.props.match.params.page === 'login' && (<Form action="/login/" method="post" onSubmit={this.handleLogin.bind(this)} className="login-form" style={{width: '300px', margin: 'auto'}}>
                <FormItem>
                    {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please enter your email' }],
                    })(
                    <Input name="email" style={{height: '32px'}} prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please enter your Password' }],
                    })(
                    <Input name="password" style={{height: '32px'}} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="width-100 login-form-button">
                    Log in
                    </Button>
                    Or <Link to="/writes/auth/register">register now!</Link>
                </FormItem>
                </Form>)}
            </Card>
      );
    }
  }
  
const AuthScreen = Form.create()(LoginForm);
export default AuthScreen;