import React, { Component } from 'react';
import { connect } from 'react-redux';

export default (WrappedComponent, to = '/', requiredAuth = true) => {
    class Auth extends Component {
        componentDidMount() {
            this.redirect();
        }

        componentDidUpdate(){
            this.redirect();
        }

        redirect() {
            const { auth, history } = this.props;

            if(requiredAuth && !auth || !requiredAuth && auth) {
                history.push(to);
            }
        }

        render() {
            return <WrappedComponent {...this.props}/>
        }
    }

    function mapStateToProps(state) {
        return {
            auth: state.user.auth
        };
    }
    return connect(mapStateToProps)(Auth);
}