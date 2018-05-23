<template>
    <b-navbar toggleable="md" type="light" variant="light" >

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav class='mx-auto'>
                <b-navbar-brand ><router-link to='/' style="color:grey" >Hacktiv Overflow</router-link></b-navbar-brand>
                <b-nav-item ><router-link to='/' style="color:grey" >Questions</router-link></b-nav-item>
                <b-nav-item >Tags</b-nav-item>
            </b-navbar-nav>

                <!-- Right aligned nav items -->
             <b-navbar-nav class="mx-auto">
                <b-nav-form>
                    <b-form-input size="sm" type="text" placeholder="Search" v-model='val' />
                </b-nav-form>
                <b-nav-item v-if='!token' ><router-link to='/login' style="color:grey" >Log in</router-link></b-nav-item>
                <b-button v-if='!token' size="sm" class="my-2 my-sm-0" type="submit" variant='info' @click='signUp' >Sign Up</b-button>
                <b-nav-item v-if='token' ><router-link to='/user' style="color:grey" >Profile</router-link></b-nav-item>
                <b-button v-if='token' size="sm" class="my-2 my-sm-0 ml-1" type="submit" variant='info' @click='logout' >Log out</b-button>
            </b-navbar-nav>

        </b-collapse>
    </b-navbar>

</template>

<script>
    import {mapActions, mapState} from 'vuex'  

    export default {
        data(){
            return {
                val:'',
                token:null
            }
        },
        methods:{
            ...mapActions([
                'searchVal'
            ]),
            signUp(){
                this.$router.push({name:'login'})
            },
            logout(){
                localStorage.removeItem('token')
                localStorage.removeItem('name')
                localStorage.removeItem('role')
                localStorage.removeItem('image')
                localStorage.removeItem('id')
                this.token=null
                swal({
                    text:'logout success',
                    icon:'success'
                })
                this.$router.push({name:'home'})
            }
           
        },
        computed:{
            ...mapState([
                'search'
            ])
        },
        updated(){
            this.searchVal(this.val)
            
        },
        mounted(){
            this.token = localStorage.getItem('token')
        }
    }
</script>