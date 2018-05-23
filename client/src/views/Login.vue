<template>
    <div id='login'>
        <b-navbar toggleable="md" type="light" variant="light" >

            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

            <b-collapse is-nav id="nav_collapse">

                <b-navbar-nav class='mx-auto'>
                    <b-navbar-brand ><router-link to='/' style="color:grey" >Hacktiv Overflow</router-link></b-navbar-brand>
                    <b-nav-item ><router-link to='/question' style="color:grey" >Question</router-link></b-nav-item>
                    <b-nav-item >Tags</b-nav-item>
                </b-navbar-nav>

            </b-collapse>
        </b-navbar>

        <div class='container col-sm-4 offset-sm-4 mt-5 pt-1' style='background-color: beige'>
            <h1 style="margin: 40px;text-align: center">User Login</h1>
            <div class="form-group">
                <label for="exampleInputEmail1">Email</label>
                <input v-model='email' type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter email" name='email'>
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input v-model='password' type="password" class="form-control" placeholder="Password" name="password">
            </div>
            <br>
            <input v-on:click='signIn()' type="submit" class="btn btn-primary" value="Sign In"> 
            <br>
            <br>

            <fb-signin-button
                    :params="fbSignInParams"
                    @success="checkLoginState"
                    @error="onSignInError">
                    Sign in with Facebook
            </fb-signin-button>
         
            <br> <br>
            Not Registered? 
            <a style="cursor: pointer;color:blue" v-b-modal.modal1 variant='info' >Sign Up</a>
        <!-- Modal -->
            <b-modal ref="myModalRef" id="modal1" hide-footer title="Register">
                <div class="form-group">
                    <label for="exampleInputEmail1">Email</label>
                    <input v-model='email' type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter email" name='email'>
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Name</label>
                    <input v-model='name' type="text" class="form-control" placeholder="Enter name" name="name">
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input v-model='password' type="password" class="form-control" placeholder="Password" name="password">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-info" data-dismiss="modal" @click='register' >Register</button>
                </div>
            </b-modal>
        <!-- end modal -->
        </div>

    </div>
</template>

<script>
 
import axios from 'axios'
import swal from 'sweetalert'
import NavHome from '@/components/NavHome' 


export default {
    name:'login',
    data() {
        return {
            image:'https://placehold.it/50x50?text=NO IMAGE',
            token: localStorage.getItem('token') || null,
            name: localStorage.getItem('name') || null,
            role:null,
            email:null,
            name:null,
            password:null,
            fbSignInParams: {
                scope: 'email,public_profile',
                return_scopes: true
            }
        }
    },
    
    methods:{
        signIn(){
            axios.post('https://overflow-api.maxville.net/signin',{
                email:this.email,
                password:this.password
            }).then(response=>{
                let message = response.data.message
                swal({
                    icon: "success",
                    text: message,
                });
                if(response.data.token!=undefined){
                        localStorage.setItem('token', response.data.token)
                        localStorage.setItem('role', response.data.user.role)
                        localStorage.setItem('image', this.image)
                        localStorage.setItem('name', response.data.user.name)
                        localStorage.setItem('id', response.data.user._id)
                        this.$router.push({name:'home'})
                }
            }).catch(err=>{
                let error = err.response.data.message
                swal({
                    text: error,
                });
            })
        },
        register(){
            axios.post('https://overflow-api.maxville.net/signup',{
                email:this.email,
                name:this.name,
                password:this.password,
                role:'admin'
            }).then(response=>{
                swal('success to signup')
                console.log(response)
            }).catch(err=>{
                let error = err.response.data.message
                if (error[0] == 'x') {
                    error = 'email already registered'
                }
                swal({
                    text: error,
                });
            })
        },
        checkLoginState() {
            let self = this
                FB.getLoginStatus(function (response) {
                    if (response.status == 'connected') {
                        console.log(response)
                    axios.post('https://overflow-api.maxville.net/fblogin', {}, {
                            headers: {
                                fbToken: response.authResponse.accessToken
                            }
                        }).then(result => {
                           swal('berhasil login dengan facebook')
                            self.$router.push({name:'home'})
                            localStorage.setItem('token', result.data.token)
                            localStorage.setItem('role', result.data.role)
                            localStorage.setItem('image',result.data.image)
                            localStorage.setItem('name',result.data.name)
                        }).catch(err => {
                            swal('login gagal')
                        })
                    } 
                });
            },
        onSignInError (error) {
            console.log('Cant login ', error)
        }
    },
    
    mounted(){
         window.fbAsyncInit = function () {
                FB.init({
                    appId: '203486610450512',
                    cookie: true,
                    xfbml: true,
                    version: 'v3.0'
                });
                FB.AppEvents.logPageView();

            };

            (function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) { return; }
                    js = d.createElement(s); js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

        this.role = localStorage.getItem('role')
        if ( this.role == 'admin') {
            this.$router.push({name:'home'})
        }
    }
}
</script>
<style>
.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
  cursor:pointer;
}
</style>